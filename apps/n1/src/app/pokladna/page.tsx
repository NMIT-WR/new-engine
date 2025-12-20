'use client'

import { useEffect, useRef } from 'react'
import { useAnalytics } from '@/providers/analytics-provider'
import { Button } from '@ui/atoms/button'
import { useRouter } from 'next/navigation'
import { OrderSummary } from './_components/order-summary'
import { PaymentFormSection } from './_components/payment-form-section'
import { PplPickupDialog } from './_components/ppl-pickup-dialog'
import { BillingAddressSection } from './_components/billing-address-section'
import { ShippingMethodSection } from './_components/shipping-method-section'
import {
  CheckoutProvider,
  useCheckoutContext,
  accessPointToShippingData,
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
    // PPL state
    selectedAccessPoint,
    openPickupDialog,
    isPickupDialogOpen,
    closePickupDialog,
    pendingOptionId,
    setSelectedAccessPoint,
  } = useCheckoutContext()
  const analytics = useAnalytics()

  // Track which cart we've already tracked to prevent duplicates
  const trackedCartId = useRef<string | null>(null)

  // Unified analytics - InitiateCheckout tracking (sends to Meta, Google, Leadhub)
  useEffect(() => {
    if (!cart || !hasItems) return
    if (trackedCartId.current === cart.id) return

    trackedCartId.current = cart.id

    const items = cart.items || []
    const currency = (cart.currency_code ?? 'CZK').toUpperCase()
    const value = cart.total ?? 0

    analytics.trackInitiateCheckout({
      value,
      currency,
      numItems: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      productIds: items.map((item) => item.variant_id || ''),
      items: items.map((item) => ({
        productId: item.variant_id || '',
        quantity: item.quantity || 1,
      })),
    })
  }, [cart?.id, hasItems, analytics])

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

  // Handle PPL access point selection
  const handleAccessPointSelect = (accessPoint: Parameters<typeof setSelectedAccessPoint>[0]) => {
    setSelectedAccessPoint(accessPoint)
    // If we have a pending option, set the shipping with the access point data
    if (pendingOptionId && accessPoint) {
      shipping.setShipping(pendingOptionId, accessPointToShippingData(accessPoint))
    }
    closePickupDialog()
  }

  return (
    <div className="container mx-auto min-h-screen p-500">
      <h1 className="mb-500 font-bold text-3xl text-fg-primary">Pokladna</h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-700 lg:grid-cols-2">
        {/* LEFT COLUMN: Checkout Form */}
        <div className="[&>*+*]:mt-500">
          <BillingAddressSection />
          <ShippingMethodSection
            onOpenPickupDialog={openPickupDialog}
            selectedAccessPoint={selectedAccessPoint}
            shipping={shipping}
          />
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

      {/* PPL Pickup Point Dialog */}
      <PplPickupDialog
        onClose={closePickupDialog}
        onSelect={handleAccessPointSelect}
        open={isPickupDialogOpen}
        selectedPoint={selectedAccessPoint}
      />
    </div>
  )
}
