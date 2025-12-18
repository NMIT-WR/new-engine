"use client"

import { Button } from "@ui/atoms/button"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useAnalytics } from "@/providers/analytics-provider"
import { OrderSummary } from "./_components/order-summary"
import { PaymentFormSection } from "./_components/payment-form-section"
import { ShippingAddressSection } from "./_components/shipping-address-section"
import { ShippingMethodSection } from "./_components/shipping-method-section"
import {
  CheckoutProvider,
  useCheckoutContext,
} from "./_context/checkout-context"

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
    isCustomerLoading,
    hasItems,
    shipping,
    isReady,
    isCompleting,
    error,
    completeCheckout,
  } = useCheckoutContext()
  const analytics = useAnalytics()

  // Track which cart we've already tracked to prevent duplicates
  const trackedCartId = useRef<string | null>(null)

  // Unified analytics - InitiateCheckout tracking (sends to Meta, Google, Leadhub)
  useEffect(() => {
    if (!(cart && hasItems)) {
      return
    }
    if (trackedCartId.current === cart.id) {
      return
    }

    trackedCartId.current = cart.id

    const items = cart.items || []
    const currency = (cart.currency_code ?? "CZK").toUpperCase()
    const value = cart.total ?? 0

    analytics.trackInitiateCheckout({
      value,
      currency,
      numItems: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      productIds: items.map((item) => item.variant_id || ""),
      items: items.map((item) => ({
        productId: item.variant_id || "",
        quantity: item.quantity || 1,
      })),
    })
  }, [cart, hasItems, analytics])

  // Loading state - wait for both cart and customer data to prevent form reset race condition
  if (isCartLoading || isCustomerLoading) {
    return (
      <div className="container mx-auto p-500">
        <p className="text-fg-secondary">Načítání...</p>
      </div>
    )
  }

  // Empty cart
  if (!(hasItems && cart)) {
    return (
      <div className="container mx-auto p-500">
        <h1 className="font-bold text-2xl text-fg-primary">Košík je prázdný</h1>
        <p className="mt-200 text-fg-secondary">
          Přidejte produkty do košíku před pokračováním na checkout.
        </p>
        <Button className="mt-400" onClick={() => router.push("/")}>
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
            errorMessage={error || ""}
            isCompletingCart={isCompleting}
            isReady={isReady}
            onBack={() => router.back()}
            onComplete={completeCheckout}
            selectedShipping={selectedShipping}
          />
        </div>
      </div>
    </div>
  )
}
