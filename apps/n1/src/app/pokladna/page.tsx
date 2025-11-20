'use client'

import { useCart, useCompleteCart } from '@/hooks/use-cart'
import { useCheckout } from '@/hooks/use-checkout'
import { useRegion } from '@/hooks/use-region'
import { Button } from '@ui/atoms/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OrderSummary } from './_components/order-summary'
import { PaymentFormSection } from './_components/payment-form-section'
import { ShippingAddressSection } from './_components/shipping-address-section'
import { ShippingMethodSection } from './_components/shipping-method-section'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, isLoading: isCartLoading, hasItems } = useCart()
  const { regionId } = useRegion()
  const checkout = useCheckout(cart?.id, regionId, cart)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Auto-select first shipping option when loaded
  useEffect(() => {
    if (
      checkout.shipping.shippingOptions &&
      checkout.shipping.shippingOptions.length > 0 &&
      !checkout.shipping.selectedShippingMethodId
    ) {
      const firstOption = checkout.shipping.shippingOptions[0]
      checkout.shipping.setShipping(firstOption.id)
    }
  }, [
    checkout.shipping.shippingOptions,
    checkout.shipping.selectedShippingMethodId,
    checkout.shipping.setShipping,
  ])

  // Auto-initiate payment when shipping is set
  useEffect(() => {
    if (
      checkout.payment.canInitiatePayment &&
      !checkout.payment.hasPaymentCollection &&
      !checkout.payment.isInitiatingPayment
    ) {
      checkout.payment.initiatePayment()
    }
  }, [
    checkout.payment.canInitiatePayment,
    checkout.payment.hasPaymentCollection,
    checkout.payment.isInitiatingPayment,
    checkout.payment.initiatePayment,
  ])

  const { mutate: completeCartMutation, isPending: isCompletingCart } =
    useCompleteCart({
      onSuccess: (order) => {
        router.push(`/orders/${order.id}?success=true`)
      },
      onError: (error, _cart) => {
        let errorMsg = error.message
        if (error.type === 'validation_error') {
          errorMsg = `Validace selhala: ${error.message}`
        } else if (error.type === 'payment_error') {
          errorMsg = `Platba selhala: ${error.message}`
        }
        setErrorMessage(errorMsg)
      },
    })

  function handleCompleteCheckout() {
    if (!cart?.id) {
      return
    }
    setErrorMessage('')
    completeCartMutation({ cartId: cart.id })
  }

  function handleBack() {
    router.back()
  }

  // Loading state
  if (isCartLoading) {
    return (
      <div className="container mx-auto p-500">
        <p className="text-fg-secondary">Načítání košíku...</p>
      </div>
    )
  }

  // Empty cart redirect
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

  const selectedShipping = checkout.shipping.shippingOptions?.find(
    (opt) => opt.id === checkout.shipping.selectedShippingMethodId
  )

  return (
    <div className="container mx-auto min-h-screen p-500">
      <h1 className="mb-500 font-bold text-3xl text-fg-primary">Checkout</h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-700 lg:grid-cols-2">
        {/* LEFT COLUMN: Checkout Form */}
        <div className="[&>*+*]:mt-500">
          <ShippingAddressSection cart={cart} />
          <ShippingMethodSection shipping={checkout.shipping} />
          <PaymentFormSection />
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div>
          <OrderSummary
            cart={cart}
            selectedShipping={selectedShipping}
            errorMessage={errorMessage}
            isReady={checkout.isReady}
            isCompletingCart={isCompletingCart}
            onBack={handleBack}
            onComplete={handleCompleteCheckout}
          />

          {/* Debug info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-400 rounded border border-border-primary bg-overlay p-200 text-xs">
              <p className="font-semibold">Checkout Debug:</p>
              <p>isReady: {String(checkout.isReady)}</p>
              <p>
                Shipping: {checkout.shipping.selectedShippingMethodId || 'none'}
              </p>
              <p>
                Payment:{' '}
                {checkout.payment.hasPaymentCollection ? 'initiated' : 'none'}
              </p>
              <p>Cart ID: {cart.id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
