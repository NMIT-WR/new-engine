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
  onEditClick: () => void
  onCompleteClick: () => void
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
  onEditClick,
  onCompleteClick
}: OrderSummaryProps) {
  const { root, container, title, content, section, sectionTitle, sectionText, actions } = orderSummaryStyles()

  return (
    <div className={root()}>
      <div className={container()}>
        <h2 className={title()}>Zkontrolujte objednávku</h2>
        
        <div className={content()}>
          <div className={section()}>
            <h3 className={sectionTitle()}>Doručovací adresa</h3>
            <p className={sectionText()}>
              {addressData.shipping.firstName} {addressData.shipping.lastName}<br />
              {addressData.shipping.company && (
                <>{addressData.shipping.company}<br /></>
              )}
              {addressData.shipping.street}<br />
              {addressData.shipping.city}, {addressData.shipping.postalCode}<br />
              {addressData.shipping.email && (
                <>{addressData.shipping.email}<br /></>
              )}
              {addressData.shipping.phone && addressData.shipping.phone}
            </p>
          </div>
          
          {!addressData.useSameAddress && (
            <div className={section()}>
              <h3 className={sectionTitle()}>Fakturační adresa</h3>
              <p className={sectionText()}>
                {addressData.billing.firstName} {addressData.billing.lastName}<br />
                {addressData.billing.company && (
                  <>{addressData.billing.company}<br /></>
                )}
                {addressData.billing.street}<br />
                {addressData.billing.city}, {addressData.billing.postalCode}
              </p>
            </div>
          )}
          
          <div className={section()}>
            <h3 className={sectionTitle()}>Doprava</h3>
            <p className={sectionText()}>
              {selectedShipping?.name} - {selectedShipping?.price ? `${selectedShipping.price} Kč` : 'Zdarma'}<br />
              Očekávané doručení: {selectedShipping?.estimatedDays}
            </p>
          </div>
          
          <div className={section()}>
            <h3 className={sectionTitle()}>Platba</h3>
            <p className={sectionText()}>
              {selectedPayment?.name} {selectedPayment?.fee ? `(+${selectedPayment.fee} Kč)` : ''}
            </p>
          </div>
        </div>
        
        <div className={actions()}>
          <Button
            variant="secondary"
            onClick={onEditClick}
          >
            Upravit údaje
          </Button>
          <Button
            onClick={onCompleteClick}
            icon="icon-[mdi--check-circle]"
            className="flex-1"
          >
            Dokončit objednávku
          </Button>
        </div>
      </div>
    </div>
  )
}