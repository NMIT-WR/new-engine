'use client'

import { Button } from '@ui/atoms/button'
import { tv } from 'tailwind-variants'

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
  // onEditClick: () => void
  onCompleteClick: () => void
  isOrderComplete?: boolean
  orderNumber?: string
  isLoading?: boolean
}

const orderSummaryStyles = tv({
  slots: {
    root: 'fade-in slide-in-from-bottom-2 animate-in duration-300',
    container: 'rounded-lg p-6 bg-surface ',
    title: 'mb-6 font-bold text-xl',
    content: 'space-y-6',
    section: '',
    sectionTitle: 'mb-2 font-semibold text-fg-primary',
    sectionText: 'text-sm text-fg-secondary',
    actions: 'mt-8 flex gap-4',
  },
})

export function OrderSummary({
  addressData,
  selectedShipping,
  selectedPayment,
  // onEditClick,
  onCompleteClick,
  isOrderComplete = false,
  orderNumber,
  isLoading = false,
}: OrderSummaryProps) {
  const {
    root,
    container,
    title,
    content,
    section,
    sectionTitle,
    sectionText,
    actions,
  } = orderSummaryStyles()

  if (!addressData || !addressData.shipping) {
    return (
      <div className={root()}>
        <div className={container()}>
          <h2 className={title()}>Zkontrolujte objednávku</h2>
          <p className={sectionText()}>
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
      <div className={root()}>
        <div className={container()}>
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className={title()}>Objednávka byla úspěšně odeslána!</h2>
            <p className="mt-2 font-semibold text-fg-primary text-lg">
              Číslo objednávky: #{orderNumber}
            </p>
          </div>

          <div className={content()}>
            <div className={section()}>
              <h3 className={sectionTitle()}>Předpokládané doručení</h3>
              <p className={sectionText()}>
                {deliveryDate.toLocaleDateString('cs-CZ', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className={section()}>
              <h3 className={sectionTitle()}>Co bude následovat?</h3>
              <ul className={`${sectionText()} space-y-2`}>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-600 dark:text-green-400">
                    ✓
                  </span>
                  <span>Obdržíte e-mail s potvrzením objednávky</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-600 dark:text-green-400">
                    ✓
                  </span>
                  <span>
                    Jakmile bude objednávka odeslána, pošleme vám sledovací
                    číslo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-600 dark:text-green-400">
                    ✓
                  </span>
                  <span>Můžete sledovat stav objednávky ve svém účtu</span>
                </li>
              </ul>
            </div>

            <div className={section()}>
              <h3 className={sectionTitle()}>Souhrn objednávky</h3>
              <div className="space-y-1">
                <p className={sectionText()}>
                  <strong>Doručovací adresa:</strong>
                  <br />
                  {addressData.shipping.firstName}{' '}
                  {addressData.shipping.lastName}
                  <br />
                  {addressData.shipping.street}, {addressData.shipping.city}{' '}
                  {addressData.shipping.postalCode}
                </p>
                <p className={sectionText()}>
                  <strong>Způsob dopravy:</strong> {selectedShipping?.name}
                </p>
                <p className={sectionText()}>
                  <strong>Způsob platby:</strong> {selectedPayment?.name}
                </p>
              </div>
            </div>
          </div>

          <div className={actions()}>
            <Button
              onClick={() => window.print()}
              variant="secondary"
              icon="icon-[mdi--printer]"
            >
              Vytisknout potvrzení
            </Button>
            <Button
              onClick={() => (window.location.href = '/products')}
              variant="primary"
              icon="icon-[mdi--shopping]"
              className="flex-1"
            >
              Pokračovat v nákupu
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={root()}>
      <div className={container()}>
        <h2 className={title()}>Zkontrolujte objednávku</h2>

        <div className={content()}>
          <div className={section()}>
            <h3 className={sectionTitle()}>Doručovací adresa</h3>
            <p className={sectionText()}>
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
            <div className={section()}>
              <h3 className={sectionTitle()}>Fakturační adresa</h3>
              <p className={sectionText()}>
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

          <div className={section()}>
            <h3 className={sectionTitle()}>Doprava</h3>
            <p className={sectionText()}>
              {selectedShipping?.name} -{' '}
              {selectedShipping?.price
                ? `${selectedShipping.price} Kč`
                : 'Zdarma'}
              <br />
              Očekávané doručení: {selectedShipping?.estimatedDays}
            </p>
          </div>

          <div className={section()}>
            <h3 className={sectionTitle()}>Platba</h3>
            <p className={sectionText()}>
              {selectedPayment?.name}{' '}
              {selectedPayment?.fee ? `(+${selectedPayment.fee} Kč)` : ''}
            </p>
          </div>
        </div>

        <div className={actions()}>
          <Button
            variant="secondary"
            // onClick={onEditClick}
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
              <span className="text-xs opacity-80">• Bezpečná platba</span>
            </span>
          </Button>{' '}
        </div>
      </div>
    </div>
  )
}
