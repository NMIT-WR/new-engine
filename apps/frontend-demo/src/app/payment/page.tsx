'use client'

import { CreditCardDialog } from '@/components/molecules/credit-card-dialog'
import { OrderSummary } from '@/components/order-summary'
import { useCart } from '@/hooks/use-cart'
import { orderHelpers } from '@/stores/order-store'
import { Steps } from '@ui/molecules/steps'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PaymentSelection } from '../../components/molecules/payment-selection'
import { ShippingSelection } from '../../components/molecules/shipping-selection'
import { AddressForm } from '../../components/organisms/address-form'
import { OrderPreview } from '../../components/organisms/order-preview'
import { Icon } from '@ui/atoms/icon'

// Import payment and shipping methods data with prices
const paymentMethods = [
  { id: 'comgate', name: 'Comgate', fee: 0 },
  { id: 'gopay', name: 'GoPay', fee: 0 },
  { id: 'paypal', name: 'PayPal', fee: 50 },
  { id: 'cash', name: 'Hotovost při převzetí', fee: 30 },
  { id: 'skippay', name: 'SkipPay', fee: 0 },
  { id: 'stripe', name: 'Stripe', fee: 0 },
  { id: 'card', name: 'Platební kartou', fee: 0 },
  { id: 'qr', name: 'QR platba', fee: 0 },
]

// Helper function to calculate delivery date
const getDeliveryDate = (daysToAdd: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysToAdd)
  return date.toLocaleDateString('cs-CZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })
}

const shippingMethods = [
  {
    id: 'ppl',
    name: 'PPL',
    price: 99,
    estimatedDays: '2-3 dny',
    deliveryDate: `${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    price: 149,
    estimatedDays: '1-2 dny',
    deliveryDate: `${getDeliveryDate(1)} - ${getDeliveryDate(2)}`,
  },
  {
    id: 'zasilkovna',
    name: 'Zásilkovna',
    price: 69,
    estimatedDays: '2-3 dny',
    deliveryDate: `${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
  },
  {
    id: 'balikovna',
    name: 'Balíkovna',
    price: 79,
    estimatedDays: '2-3 dny',
    deliveryDate: `${getDeliveryDate(2)} - ${getDeliveryDate(3)}`,
  },
  {
    id: 'personal',
    name: 'Osobní odběr',
    price: 0,
    estimatedDays: 'Ihned',
    deliveryDate: 'Dnes',
  },
]

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [selectedShipping, setSelectedShipping] = useState<string>('')
  const [addressData, setAddressData] = useState<{
    shipping: any
    billing: any
    useSameAddress: boolean
  } | null>(null)
  const [showCreditCardDialog, setShowCreditCardDialog] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isOrderComplete, setIsOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const { cart, clearCart, isLoading } = useCart()
  const router = useRouter()

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
  }, [cart, router, isLoading, isOrderComplete])

  // Show loading state while cart is loading
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-[80rem] px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2"></div>
            <p className="text-fg-secondary">Načítání...</p>
          </div>
        </div>
      </div>
    )
  }

  // Get order data (either from cart or saved completed order)
  const orderData = orderHelpers.getOrderData(cart)

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return null
  }

  const selectedShippingMethod = shippingMethods.find(
    (m) => m.id === selectedShipping
  )
  const selectedPaymentMethod = paymentMethods.find(
    (m) => m.id === selectedPayment
  )
  const shippingPrice = selectedShippingMethod?.price || 0
  const paymentFee = selectedPaymentMethod?.fee || 0

  const handleComplete = () => {
    // Check if payment method is credit card
    if (selectedPayment === 'card') {
      setShowCreditCardDialog(true)
      return
    }

    // For other payment methods, process directly
    processOrder()
  }

  const processOrder = async () => {
    setIsProcessingPayment(true)

    // Here you would normally:
    // 1. Create order in Medusa
    // 2. Process payment
    // 3. Redirect to success page

    // Generate order number
    const newOrderNumber = `CZ${Date.now().toString().slice(-8)}`
    setOrderNumber(newOrderNumber)

    // Save cart data before clearing
    if (cart) {
      orderHelpers.saveCompletedOrder(cart)
    }

    setIsProcessingPayment(false)
    setIsOrderComplete(true)

    // Clear the cart after successful order
    clearCart()

    // Move to final step
    setCurrentStep(3)
  }

  const handleCreditCardSubmit = async (_cardData: {
    cardNumber: string
    cardHolder: string
    expiryDate: string
    cvv: string
  }) => {
    // Process card payment
    // In production, you would send _cardData to payment processor
    setShowCreditCardDialog(false)
    await processOrder()
  }

  const steps = [
    {
      value: 0,
      title: 'Adresa',
      description: 'Vyplňte doručovací údaje',
      content: (
        <AddressForm
          onComplete={(data) => {
            setAddressData(data)
            setTimeout(() => setCurrentStep(1), 300)
          }}
          initialData={addressData || undefined}
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
          onSelect={(method) => {
            setSelectedShipping(method)
            // Auto-advance to next step after selection
            setTimeout(() => setCurrentStep(2), 300)
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
            // Auto-advance to summary step after selection
            setTimeout(() => setCurrentStep(3), 300)
          }}
        />
      ),
    },
    {
      value: 3,
      title: 'Souhrn',
      description: 'Zkontrolujte objednávku',
      content: (
        <OrderSummary
          addressData={addressData!}
          selectedShipping={selectedShippingMethod}
          selectedPayment={selectedPaymentMethod}
          onCompleteClick={handleComplete}
          onEditClick={() => setCurrentStep(() => currentStep -1)}
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
    if (step > currentStep) {
      if (currentStep === 0 && !addressData) {
        return
      }
      if (currentStep === 1 && !selectedShipping) {
        return
      }
      if (currentStep === 2 && !selectedPayment) {
        return
      }
    }
    setCurrentStep(step)
  }

  return (
    <div className="container mx-auto max-w-[80rem] px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/cart">
        <Icon icon="token-icon-arrow-left text-lg" className="text-fg-primary hover:text-fg-secondary" />
        </Link>
        <h1 className="font-bold text-3xl">Dokončení objednávky</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
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

        <div className="lg:pl-8">
          <OrderPreview
            shippingPrice={shippingPrice}
            paymentFee={paymentFee}
            className="order-summary--sticky"
          />
        </div>
      </div>

      <CreditCardDialog
        open={showCreditCardDialog}
        onOpenChange={(details) => setShowCreditCardDialog(details.open)}
        onSubmit={handleCreditCardSubmit}
        isLoading={isProcessingPayment}
      />
    </div>
  )
}
