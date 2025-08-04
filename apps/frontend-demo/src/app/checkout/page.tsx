'use client'

import { LoadingPage } from '@/components/loading-page'
import { OrderSummary } from '@/components/order-summary'
import { useCart } from '@/hooks/use-cart'
import { useCheckout } from '@/hooks/use-checkout'
import { PAYMENT_METHODS } from '@/lib/checkout-data'
import { formatPrice } from '@/lib/format-price'
import { orderHelpers } from '@/stores/order-store'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import { Steps } from '@ui/molecules/steps'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PaymentSelection } from '../../components/molecules/payment-selection'
import { ShippingSelection } from '../../components/molecules/shipping-selection'
import { AddressForm } from '../../components/organisms/address-form'
import { OrderPreview } from '../../components/organisms/order-preview'

export default function CheckoutPage() {
  const { cart, isLoading } = useCart()

  const {
    currentStep,
    selectedPayment,
    selectedShipping,
    addressData,
    isProcessingPayment,
    setCurrentStep,
    setSelectedPayment,
    setSelectedShipping,
    updateAddresses,
    addShippingMethod,
    processOrder,
    canProceedToStep,
    shippingMethods,
    isLoadingShipping,
  } = useCheckout()

  const [isOrderComplete, setIsOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  // Redirect if cart is empty and no completed order
  useEffect(() => {
    // Wait for cart to load before checking
    if (!isLoading) {
      const hasCompletedOrder = orderHelpers.getOrderData(null) !== null

      // Only redirect if cart is empty AND no completed order exists
      if (
        (!cart || cart.items?.length === 0) &&
        !hasCompletedOrder &&
        !isOrderComplete
      ) {
        //  router.push('/cart')
      }
    }
  }, [cart, isLoading, isOrderComplete])

  // Show loading state while cart is loading
  if (isLoading) return <LoadingPage />

  // Get order data (either from cart or saved completed order)
  const orderData = orderHelpers.getOrderData(cart)

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return null
  }

  const selectedShippingMethod = shippingMethods?.find(
    (m) => m.id === selectedShipping
  )
  const selectedPaymentMethod = PAYMENT_METHODS.find(
    (m) => m.id === selectedPayment
  )
  const shippingPrice =
    selectedShippingMethod?.calculated_price.calculated_amount || 0

  const paymentFee = selectedPaymentMethod?.fee || 0

  const handleComplete = async () => {
    // For other payment methods, process directly
    try {
      const order = await processOrder()
      if (order) {
        setOrderNumber(
          String(order.display_id) || `CZ${Date.now().toString().slice(-8)}`
        )
        setIsOrderComplete(true)
        setCurrentStep(3)
      }
    } catch (error) {
      // Error already handled in hook
    }
  }

  const steps = [
    {
      value: 0,
      title: 'Adresa',
      description: 'Vyplňte doručovací údaje',
      content: (
        <AddressForm
          onComplete={async (data) => {
            try {
              await updateAddresses(data)
              setCurrentStep(1)
            } catch (err) {
              // Error already handled in hook
            }
          }}
        />
      ),
    },
    {
      value: 1,
      title: 'Doprava',
      description: 'Vyberte způsob doručení',
      content: (
        <ShippingSelection
          selected={selectedShipping}
          shippingMethods={shippingMethods}
          isLoading={isLoadingShipping}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onSelect={async (method) => {
            setSelectedShipping(method)
            try {
              await addShippingMethod(method)
            } catch (error) {
              // Error already handled in hook
            }
          }}
        />
      ),
    },
    {
      value: 2,
      title: 'Platba',
      description: 'Vyberte způsob platby',
      content: (
        <PaymentSelection
          selected={selectedPayment}
          onSelect={(method) => {
            setSelectedPayment(method)
            setCurrentStep(3)
          }}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ),
    },
    {
      value: 3,
      title: 'Souhrn',
      description: 'Zkontrolujte objednávku',
      content: (
        <OrderSummary
          addressData={addressData || undefined}
          selectedShipping={selectedShippingMethod}
          selectedPayment={selectedPaymentMethod}
          onCompleteClick={handleComplete}
          onEditClick={() => setCurrentStep(currentStep - 1)}
          isOrderComplete={isOrderComplete}
          orderNumber={orderNumber}
          isLoading={isProcessingPayment}
        />
      ),
    },
  ]

  const handleStepChange = (step: number) => {
    // Allow backward navigation
    if (step < currentStep) {
      setCurrentStep(step)
      return
    }

    // Only allow forward movement if current step is completed
    if (step > currentStep && !canProceedToStep(step)) {
      return
    }

    setCurrentStep(step)
  }

  return (
    <div className="container mx-auto max-w-[80rem] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Mobile/Tablet: Sticky progress bar */}
      <div
        id="payment-header"
        className="-mx-4 sm:-mx-6 sticky top-0 z-2 mb-4 border-border border-b-2 bg-base px-4 pb-4 shadow-sm sm:px-6 lg:relative lg:mx-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:shadow-none"
      >
        <div className="mb-4 flex items-center gap-3 pt-4 lg:mb-6 lg:pt-0">
          <Link
            href="/cart"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface-hover lg:h-auto lg:w-auto"
          >
            <Icon
              icon="token-icon-arrow-left"
              className="text-fg-primary text-lg hover:text-fg-secondary"
            />
          </Link>
          <h1 className="font-bold text-2xl sm:text-3xl">
            Dokončení objednávky
          </h1>
        </div>

        {/* Mobile: Collapsible order summary */}
        <Button
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          className="bg-surface text-fg-primary hover:bg-surface-hover active:bg-surface-hover lg:hidden"
          icon={
            showOrderSummary
              ? 'token-icon-chevron-up'
              : 'token-icon-chevron-down'
          }
          iconPosition="left"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {showOrderSummary ? 'Skrýt' : 'Zobrazit'} souhrn objednávky
            </span>
          </div>
          <span className="font-bold">
            {formatPrice(orderData?.total || 0 + shippingPrice + paymentFee)}
          </span>
        </Button>
        {/* Mobile: Collapsible order summary content */}
        {showOrderSummary && (
          <div className="-mx-4 sm:-mx-6 mb-6 py-4 sm:px-6 lg:hidden">
            <OrderPreview
              shippingPrice={shippingPrice}
              paymentFee={paymentFee}
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
        <div className="hidden sm:block">
          <Steps
            items={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onStepComplete={handleComplete}
            orientation="horizontal"
            linear={false}
            showControls={false}
          />
        </div>
        <div className="sm:hidden">
          <Steps
            items={steps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onStepComplete={handleComplete}
            orientation="vertical"
            linear={false}
            showControls={false}
          />
        </div>

        {/* Desktop: Sticky sidebar */}
        <div className="hidden lg:block lg:pl-8">
          <div className="sticky top-8">
            <OrderPreview
              shippingPrice={shippingPrice}
              paymentFee={paymentFee}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
