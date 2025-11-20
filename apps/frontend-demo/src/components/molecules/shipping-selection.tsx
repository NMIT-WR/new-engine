import Image from 'next/image'
import { useCallback, useEffect, useMemo } from 'react'
import '../../tokens/app-components/molecules/_shipping-selection.css'
import { SHIPPING_METHODS } from '@/lib/checkout-data'
import { formatPrice } from '@/lib/format-price'
import type {
  BalikovnaPoint,
  BalikovnaSelection,
  CheckoutAddressData,
  ReducedShippingMethod,
} from '@/types/checkout'
import { Button } from '@new-engine/ui/atoms/button'
import { useToast } from '@new-engine/ui/molecules/toast'

interface ShippingSelectionProps {
  selected: string
  onSelect: (method: string, data?: Record<string, unknown>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  shippingMethods: ReducedShippingMethod[] | undefined
  isLoading: boolean
  addressData?: CheckoutAddressData | null
  balikovnaSelection: BalikovnaSelection | null
  onBalikovnaSelect: (selection: BalikovnaSelection | null) => void
}

const ShippingMethodDetail = ({
  method,
  selected,
  note,
}: {
  method: ReducedShippingMethod
  selected: string
  note?: string
}) => {
  const detailInfo =
    SHIPPING_METHODS.find((m) => m.name === method.name) ||
    SHIPPING_METHODS.find((m) => m.id === method.id)

  const priceWithTax = (method.calculated_price?.calculated_amount || 0) * 1.21
  const formattedPrice = formatPrice(
    priceWithTax,
    method.calculated_price.currency_code || 'CZK'
  )

  return (
    <div className="flex flex-1 items-center gap-3 sm:gap-4">
      {detailInfo?.image && (
        <Image
          src={detailInfo.image}
          alt={detailInfo.name}
          width={100}
          height={50}
          className={`${detailInfo.id === 'balikovna' && 'balikovna-dark'} h-[30px] w-[60px] object-contain sm:h-[40px] sm:w-[80px] lg:h-[50px] lg:w-[100px]`}
        />
      )}
      <div className="flex-1">
        <h3 className="xs:block hidden font-semibold text-fg-primary text-sm">
          {method.name}
        </h3>
        <p className="mt-0.5 xs:block hidden text-fg-secondary text-xs sm:text-sm">
          {detailInfo?.description}
        </p>
        <p className="xs:block hidden font-medium text-fg-secondary text-xs">
          {detailInfo?.deliveryDate || detailInfo?.delivery}
        </p>
        {note && (
          <p className="mt-1 text-fg-secondary text-xs sm:text-sm">{note}</p>
        )}
      </div>
      <span className="ml-auto font-bold text-fg-primary text-sm sm:text-lg">
        {formattedPrice}
      </span>
      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-border bg-base transition-all duration-200 sm:h-5 sm:w-5">
        <div
          className="h-2 w-2 scale-0 rounded-full bg-primary opacity-0 transition-all duration-200 data-[selected=true]:scale-100 data-[selected=true]:opacity-100 sm:h-2.5 sm:w-2.5"
          data-selected={selected === method.id}
        />
      </div>
    </div>
  )
}

const BALIKOVNA_WIDGET_URL =
  process.env.NEXT_PUBLIC_BALIKOVNA_WIDGET_URL || ''

const getBalikovnaService = (
  method?: ReducedShippingMethod | null
): BalikovnaSelection['service'] | null => {
  if (!method) return null
  const service = (method.data as Record<string, unknown> | undefined)
    ?.service as string | undefined

  if (
    service &&
    (service.toUpperCase() === 'NB' || service.toUpperCase() === 'ND')
  ) {
    return service.toUpperCase() as BalikovnaSelection['service']
  }

  if (method.name.toLowerCase().includes('balíkovna na adresu')) {
    return 'ND'
  }
  if (method.name.toLowerCase().includes('balíkovna')) {
    return 'NB'
  }
  return null
}

const parsePickupFromMessage = (payload: any): BalikovnaPoint | null => {
  if (!payload) return null
  const source =
    payload.point || payload.pickup_point || payload.location || payload

  if (!source?.id || (!source.city && !source.postal_code && !source.zip)) {
    return null
  }

  return {
    id: source.id,
    name: source.name || source.label || 'Balíkovna',
    city: source.city,
    street: source.street || source.address,
    postalCode: source.postal_code || source.zip,
    type: source.type,
    region: source.region,
    zip: source.zip,
  }
}

const BalikovnaWidget = ({
  onSelect,
  selection,
}: {
  onSelect: (point: BalikovnaPoint) => void
  selection?: BalikovnaPoint
}) => {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const parsed = parsePickupFromMessage(event.data)
      if (parsed) {
        onSelect(parsed)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onSelect])

  return (
    <div className="rounded-lg border-2 border-border-subtle bg-surface p-4">
      <div className="mb-3 font-semibold text-fg-primary text-sm">
        Balíkovna – oficiální widget
      </div>
      {BALIKOVNA_WIDGET_URL ? (
        <iframe
          title="Balíkovna - výběr výdejního místa"
          src={BALIKOVNA_WIDGET_URL}
          className="h-[420px] w-full rounded-md border border-border-subtle"
        />
      ) : (
        <div className="space-y-3 rounded-md bg-surface-hover p-3 text-sm text-fg-secondary">
          <p>
            Zadejte prosím adresu widgetu do proměnné
            <code className="ml-1 rounded bg-surface px-1 py-0.5">
              NEXT_PUBLIC_BALIKOVNA_WIDGET_URL
            </code>
            . Pro rychlé testování můžete použít ukázkové místo.
          </p>
          <Button
            size="sm"
            onClick={() =>
              onSelect({
                id: 'SIM-NB-001',
                name: 'Balíkovna - Praha 1',
                city: 'Praha',
                postalCode: '11000',
                street: 'Jungmannova 1',
                type: 'post_office',
              })
            }
          >
            Vybrat ukázkové místo
          </Button>
        </div>
      )}

      {selection && (
        <div className="mt-3 rounded-md bg-surface-hover px-3 py-2 text-sm">
          <div className="font-semibold text-fg-primary">{selection.name}</div>
          <div className="text-fg-secondary">
            {selection.street ? `${selection.street}, ` : ''}
            {selection.postalCode} {selection.city}
          </div>
        </div>
      )}
    </div>
  )
}

export function ShippingSelection({
  selected,
  onSelect,
  currentStep,
  setCurrentStep,
  shippingMethods,
  isLoading,
  addressData,
  balikovnaSelection,
  onBalikovnaSelect,
}: ShippingSelectionProps) {
  const toast = useToast()

  const selectedMethod = useMemo(
    () => shippingMethods?.find((m) => m.id === selected),
    [shippingMethods, selected]
  )

  const selectedService = useMemo(
    () => getBalikovnaService(selectedMethod),
    [selectedMethod]
  )

  const handleProgress = () => {
    if (!selected) {
      toast.create({
        type: 'error',
        title: 'Není vybrán dopravce',
        description: 'Je potřeba zvolit jeden způsob dopravy',
      })
      return
    }

    if (selectedService === 'NB' && !balikovnaSelection?.pickupPoint) {
      toast.create({
        type: 'error',
        title: 'Chybí výdejní místo',
        description: 'Vyberte prosím Balíkovnu pro pokračování',
      })
      return
    }

    setCurrentStep(currentStep + 1)
  }

  const handlePickupSelected = useCallback(
    async (point: BalikovnaPoint) => {
      onBalikovnaSelect({
        service: 'NB',
        pickupPoint: point,
      })

      if (selected && selectedService === 'NB') {
        try {
          await onSelect(selected, {
            service: 'NB',
            pickup_point: {
              id: point.id,
              name: point.name,
              city: point.city,
              postal_code: point.postalCode,
              street: point.street,
              type: point.type,
              region: point.region,
            },
          })
        } catch (err) {
          toast.create({
            type: 'error',
            title: 'Nepodařilo se uložit výdejní místo',
            description: 'Zkuste to prosím znovu',
          })
        }
      }
    },
    [onBalikovnaSelect, onSelect, selected, selectedService, toast]
  )

  const handleMethodClick = async (method: ReducedShippingMethod) => {
    const service = getBalikovnaService(method)

    if (service === 'NB') {
      if (!balikovnaSelection?.pickupPoint) {
        toast.create({
          type: 'error',
          title: 'Vyberte Balíkovnu',
          description: 'Pro tuto dopravu je potřeba zvolit výdejní místo.',
        })
        return
      }

      await onSelect(method.id, {
        service,
        pickup_point: {
          id: balikovnaSelection.pickupPoint.id,
          name: balikovnaSelection.pickupPoint.name,
          city: balikovnaSelection.pickupPoint.city,
          postal_code: balikovnaSelection.pickupPoint.postalCode,
          street: balikovnaSelection.pickupPoint.street,
          type: balikovnaSelection.pickupPoint.type,
          region: balikovnaSelection.pickupPoint.region,
        },
      })
      return
    }

    if (service === 'ND') {
      onBalikovnaSelect({ service: 'ND' })
      const shippingAddress = addressData?.shipping
      if (
        !shippingAddress ||
        (shippingAddress.country || 'cz').toLowerCase() !== 'cz'
      ) {
        toast.create({
          type: 'error',
          title: 'Doručení pouze v ČR',
          description:
            'Balíkovna na adresu je dostupná jen pro doručení v rámci ČR.',
        })
        return
      }

      await onSelect(method.id, {
        service,
        address: {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          address_1: shippingAddress.street,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country_code: (shippingAddress.country || 'cz').toLowerCase(),
          phone: shippingAddress.phone,
        },
      })
      return
    }

    onBalikovnaSelect(null)
    await onSelect(method.id)
  }

  const pickupNote =
    selectedService === 'NB'
      ? balikovnaSelection?.pickupPoint
        ? `${balikovnaSelection.pickupPoint.name}, ${
            balikovnaSelection.pickupPoint.city
          } ${
            balikovnaSelection.pickupPoint.postalCode ||
            balikovnaSelection.pickupPoint.zip
          }`
        : 'Vyberte výdejní místo'
      : selectedService === 'ND'
        ? 'Doručení Balíkovnou na adresu (CZ)'
        : undefined

  return (
    <div className="w-full space-y-250 py-2 sm:py-4">
      <div
        className="grid grid-cols-1 gap-3 sm:gap-4"
        role="radiogroup"
        aria-label="Vyberte způsob dopravy"
      >
        {shippingMethods?.map((method) => {
          const service = getBalikovnaService(method)
          const note =
            method.id === selected ? pickupNote : service === 'ND'
              ? 'Doručení v rámci ČR'
              : undefined
          return (
            <Button
              key={method.id}
              onClick={() => handleMethodClick(method)}
              className="relative flex items-center rounded-lg border-2 border-border-subtle bg-surface p-3 transition-all duration-200 hover:bg-surface-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base data-[selected=true]:border-primary data-[selected=true]:bg-surface-selected data-[selected=true]:shadow-lg sm:p-4"
              data-selected={selected === method.id}
              aria-checked={selected === method.id}
              aria-label={`${method.name} - ${method.calculated_price.calculated_amount}`}
              disabled={isLoading}
            >
              <ShippingMethodDetail
                method={method}
                selected={selected}
                note={note}
              />
            </Button>
          )
        })}
      </div>

      {selectedService === 'NB' && (
        <BalikovnaWidget
          onSelect={handlePickupSelected}
          selection={balikovnaSelection?.pickupPoint}
        />
      )}

      <div className="flex w-full justify-between">
        <Button size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
          Zpět
        </Button>
        <Button size="sm" onClick={handleProgress}>
          Pokračovat
        </Button>
      </div>
    </div>
  )
}
