import type { UseCheckoutShippingReturn } from '@/hooks/use-checkout-shipping'
import { formatToTaxIncluded } from '@/utils/format/format-product'
import type { HttpTypes } from '@medusajs/types'
import { Button } from '@techsio/ui-kit/atoms/button'
import { ErrorText } from '@techsio/ui-kit/atoms/error-text'
import { ExtraText } from '@techsio/ui-kit/atoms/extra-text'
import { Skeleton } from '@techsio/ui-kit/atoms/skeleton'

interface ShippingMethodSectionProps {
  shipping: UseCheckoutShippingReturn
}

interface ShippingOptionCardProps {
  option: HttpTypes.StoreCartShippingOption
  selected: boolean
  isUpdating?: boolean
  onSelect: (id: string) => void
}

function ShippingOptionCard({
  option,
  selected,
  isUpdating,
  onSelect,
}: ShippingOptionCardProps) {
  const formattedPrice = formatToTaxIncluded({
    amount: option.amount,
    currency: option.calculated_price.currency_code ?? 'czk',
  })

  return (
    <Button
      type="button"
      variant="tertiary"
      onClick={() => onSelect(option.id)}
      disabled={isUpdating}
      data-selected={selected}
      aria-label={`${option.name}, ${formattedPrice || 'zdarma'}`}
      className="flex w-full items-center gap-300 rounded-lg border border-border-secondary bg-surface-light p-300 data-[selected=true]:border-border-primary/30 data-[selected=true]:bg-overlay-light"
    >
      <div className="flex-1 text-left">
        <p className="font-medium text-fg-primary text-sm">{option.name}</p>
        <ExtraText size="sm">Dodání 2-3 dny</ExtraText>
      </div>
      <span>{formattedPrice || 'Zdarma'}</span>
    </Button>
  )
}

export function ShippingMethodSection({
  shipping,
}: ShippingMethodSectionProps) {
  return (
    <section className="rounded border border-border-secondary bg-surface-light p-400">
      <h2 className="mb-400 font-semibold text-fg-primary text-lg">
        Způsob dopravy
      </h2>

      {shipping.isLoadingShipping ? (
        <div
          className="grid grid-cols-1 gap-200 md:grid-cols-2"
          aria-busy="true"
          aria-label="Načítání způsobů dopravy"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton.Rectangle key={i} height="72px" />
          ))}
        </div>
      ) : shipping.shippingOptions && shipping.shippingOptions.length > 0 ? (
        <div
          className="grid grid-cols-1 gap-200 md:grid-cols-2"
          role="radiogroup"
          aria-label="Vyberte způsob dopravy"
          data-updating={shipping.isSettingShipping}
        >
          {shipping.shippingOptions.map((option) => (
            <ShippingOptionCard
              key={option.id}
              option={option}
              selected={shipping.selectedShippingMethodId === option.id}
              isUpdating={shipping.isSettingShipping}
              onSelect={shipping.setShipping}
            />
          ))}
        </div>
      ) : (
        <ErrorText showIcon size="md">
          Žádné způsoby dopravy nejsou momentálně k dispozici. Zkuste to prosím
          později.
        </ErrorText>
      )}
    </section>
  )
}
