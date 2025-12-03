'use client'

import { Button } from '@ui/atoms/button'
import { useRouter } from 'next/navigation'
import { OrderSummary } from './_components/order-summary'
import { PaymentFormSection } from './_components/payment-form-section'
import { ShippingAddressSection } from './_components/shipping-address-section'
import { ShippingMethodSection } from './_components/shipping-method-section'
import {
  CheckoutProvider,
  useCheckoutContext,
} from './_context/checkout-context'

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const {
    cart,
    isCartLoading,
    hasItems,
    shipping,
    isReady,
    isCompleting,
    error,
    completeCheckout,
  } = useCheckoutContext()

  // Loading state
  if (isCartLoading) {
    return (
      <div className="container mx-auto p-500">
        <p className="text-fg-secondary">Načítání košíku...</p>
      </div>
    )
  }

  // Empty cart
  if (!hasItems || !cart) {
    return (
      <div className="container mx-auto p-500">
        <h1 className="font-bold text-2xl text-fg-primary">Košík je prázdný</h1>
        <p className="mt-200 text-fg-secondary">
          Přidejte produkty do košíku před pokračováním na checkout.
        </p>
        <Button onClick={() => router.push('/')} className="mt-400">
          Zpět na hlavní stránku
        </Button>
      </div>
    )
  }

  const selectedShipping = shipping.shippingOptions?.find(
    (opt) => opt.id === shipping.selectedShippingMethodId
  )

  return (
    <div className="container mx-auto min-h-screen p-500">
      <h1 className="mb-500 font-bold text-3xl text-fg-primary">Pokladna</h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-700 lg:grid-cols-2">
        {/* LEFT COLUMN: Checkout Form */}
        <div className="[&>*+*]:mt-500">
          <ShippingAddressSection />
          <ShippingMethodSection shipping={shipping} />
          <PaymentFormSection cart={cart} />
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div>
          <OrderSummary
            cart={cart}
            selectedShipping={selectedShipping}
            errorMessage={error || ''}
            isReady={isReady}
            isCompletingCart={isCompleting}
            onBack={() => router.back()}
            onComplete={completeCheckout}
          />
        </div>
      </div>
    </div>
  )
}
