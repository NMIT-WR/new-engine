'use client'

import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import { LinkButton } from '@ui/atoms/link-button'

interface AddressData {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  email?: string
  phone?: string
  company?: string
}

interface ShippingMethod {
  id: string
  name: string
  price: number
  estimatedDays: string
}

interface PaymentMethod {
  id: string
  name: string
  fee: number
}

interface OrderSummaryProps {
  addressData: {
    shipping: AddressData
    billing: AddressData
    useSameAddress: boolean
  }
  selectedShipping: ShippingMethod | undefined
  selectedPayment: PaymentMethod | undefined
  onEditClick: () => void
  onCompleteClick: () => void
  isOrderComplete?: boolean
  orderNumber?: string
  isLoading?: boolean
}

export function OrderSummary({
  addressData,
  selectedShipping,
  selectedPayment,
  onEditClick,
  onCompleteClick,
  isOrderComplete = false,
  orderNumber,
  isLoading = false,
}: OrderSummaryProps) {
  if (!addressData || !addressData.shipping) {
    return (
      <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
        <div className="rounded-lg p-6 bg-surface">
          <h2 className="mb-6 font-bold text-xl">Zkontrolujte objednávku</h2>
          <p className="text-sm text-fg-secondary">
            Nejprve vyplňte všechny potřebné údaje.
          </p>
        </div>
      </div>
    )
  }

  // Order complete state
  if (isOrderComplete && orderNumber) {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 3) // Add 3 days for delivery

    return (
      <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
        <div className="rounded-lg p-6 bg-surface">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success">
             <Icon icon='token-icon-check' className='text-white text-lg'/>
            </div>
            <h2 className="mb-6 font-bold text-xl">Objednávka byla úspěšně odeslána!</h2>
            <p className="mt-2 font-semibold text-fg-primary text-lg">
              Číslo objednávky: #{orderNumber}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-fg-primary">Předpokládané doručení</h3>
              <p className="text-sm text-fg-secondary">
                {deliveryDate.toLocaleDateString('cs-CZ', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-fg-primary">Co bude následovat?</h3>
              <ul className="text-sm text-fg-secondary space-y-2">
              <li className="flex items-center gap-2">
              <Icon icon="token-icon-circle-md"/>
                  <span>Obdržíte e-mail s potvrzením objednávky</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="token-icon-circle-md"/>
                  <span>
                    Jakmile bude objednávka odeslána, pošleme vám sledovací
                    číslo
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="token-icon-circle-md"/>
                  <span>Můžete sledovat stav objednávky ve svém účtu</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-fg-primary">Souhrn objednávky</h3>
              <div className="space-y-1">
                <p className="text-sm text-fg-secondary">
                  <strong>Doručovací adresa:</strong>
                  <br />
                  {addressData.shipping.firstName}{' '}
                  {addressData.shipping.lastName}
                  <br />
                  {addressData.shipping.street}, {addressData.shipping.city}{' '}
                  {addressData.shipping.postalCode}
                </p>
                <p className="text-sm text-fg-secondary">
                  <strong>Způsob dopravy:</strong> {selectedShipping?.name}
                </p>
                <p className="text-sm text-fg-secondary">
                  <strong>Způsob platby:</strong> {selectedPayment?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => {
                // Add print date to body for CSS
                document.body.setAttribute('data-print-date', new Date().toLocaleDateString('cs-CZ'))
                window.print()
                // Clean up after print
                setTimeout(() => {
                  document.body.removeAttribute('data-print-date')
                }, 1000)
              }}
              variant="secondary"
              icon="token-icon-printer"
            >
              Vytisknout potvrzení
            </Button>
            <LinkButton
              href='/products'
              variant="primary"
              icon="token-icon-shopping-bag"
              className="flex-1 gap-2 text-md rounded-sm"
            >
              Pokračovat v nákupu
            </LinkButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
      <div className="rounded-lg p-6 bg-surface">
        <h2 className="mb-6 font-bold text-xl">Zkontrolujte objednávku</h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold text-fg-primary">Doručovací adresa</h3>
            <p className="text-sm text-fg-secondary">
              {addressData.shipping.firstName} {addressData.shipping.lastName}
              <br />
              {addressData.shipping.company && (
                <>
                  {addressData.shipping.company}
                  <br />
                </>
              )}
              {addressData.shipping.street}
              <br />
              {addressData.shipping.city}, {addressData.shipping.postalCode}
              <br />
              {addressData.shipping.email && (
                <>
                  {addressData.shipping.email}
                  <br />
                </>
              )}
              {addressData.shipping.phone && addressData.shipping.phone}
            </p>
          </div>

          {!addressData.useSameAddress && addressData.billing && (
            <div>
              <h3 className="mb-2 font-semibold text-fg-primary">Fakturační adresa</h3>
              <p className="text-sm text-fg-secondary">
                {addressData.billing.firstName} {addressData.billing.lastName}
                <br />
                {addressData.billing.company && (
                  <>
                    {addressData.billing.company}
                    <br />
                  </>
                )}
                {addressData.billing.street}
                <br />
                {addressData.billing.city}, {addressData.billing.postalCode}
              </p>
            </div>
          )}

          <div>
            <h3 className="mb-2 font-semibold text-fg-primary">Doprava</h3>
            <p className="text-sm text-fg-secondary">
              {selectedShipping?.name} -{' '}
              {selectedShipping?.price
                ? `${selectedShipping.price} Kč`
                : 'Zdarma'}
              <br />
              Očekávané doručení: {selectedShipping?.estimatedDays}
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-fg-primary">Platba</h3>
            <p className="text-sm text-fg-secondary">
              {selectedPayment?.name}{' '}
              {selectedPayment?.fee ? `(+${selectedPayment.fee} Kč)` : ''}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            variant="secondary"
            onClick={onEditClick}
          >
            Upravit údaje
          </Button>
          <Button
            onClick={onCompleteClick}
            icon="icon-[mdi--lock-outline]"
            className="flex-1"
            isLoading={isLoading}
            disabled={isLoading}
          >
            <span className="flex items-center gap-2">
              Dokončit objednávku
            </span>
          </Button>{' '}
        </div>
      </div>
    </div>
  )
}
