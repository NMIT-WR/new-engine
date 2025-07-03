'use client'

import { Steps } from '@ui/molecules/steps'
import { useState, useEffect } from 'react'
import { PaymentSelection } from '../../components/molecules/payment-selection'
import { ShippingSelection } from '../../components/molecules/shipping-selection'
import { AddressForm } from '../../components/organisms/address-form'
import { OrderPreview } from '../../components/organisms/order-preview'
import { OrderSummary } from '@/components/order-summary'
import { Button } from '@ui/atoms/button'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

const shippingMethods = [
  { id: 'ppl', name: 'PPL', price: 99, estimatedDays: '2-3 dny' },
  { id: 'dhl', name: 'DHL Express', price: 149, estimatedDays: '1-2 dny' },
  { id: 'zasilkovna', name: 'Zásilkovna', price: 69, estimatedDays: '2-3 dny' },
  { id: 'balikovna', name: 'Balíkovna', price: 79, estimatedDays: '2-3 dny' },
  { id: 'personal', name: 'Osobní odběr', price: 0, estimatedDays: 'Ihned' },
]

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [selectedShipping, setSelectedShipping] = useState<string>('')
  const [addressData, setAddressData] = useState<any>(null)
  const { cart } = useCart()
  const router = useRouter()
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cart && cart.items && cart.items.length === 0) {
      router.push('/cart')
    }
  }, [cart, router])
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return null
  }
  
  const selectedShippingMethod = shippingMethods.find(m => m.id === selectedShipping)
  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedPayment)
  const shippingPrice = selectedShippingMethod?.price || 0
  const paymentFee = selectedPaymentMethod?.fee || 0

  const steps = [
    {
      value: 0,
      title: 'Adresa',
      description: 'Vyplňte doručovací údaje',
    },
    {
      value: 1,
      title: 'Doprava',
      description: 'Vyberte způsob doručení',
    },
    {
      value: 2,
      title: 'Platba',
      description: 'Vyberte způsob platby',
    },
    {
      value: 3,
      title: 'Souhrn',
      description: 'Zkontrolujte objednávku',
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

  const handleComplete = async () => {
    // Here you would normally:
    // 1. Create order in Medusa
    // 2. Process payment
    // 3. Redirect to success page
    console.log('Order data:', {
      address: addressData,
      shipping: selectedShipping,
      payment: selectedPayment,
      cart: cart
    })
    // For now, just show alert
    alert('Objednávka byla úspěšně odeslána!')
  }

  return (
    <div className="container mx-auto max-w-[80rem] px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/cart" className="text-fg-primary hover:text-fg-secondary">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
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

          />

          <div className="mt-8">
            {currentStep === 0 && (
              <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
                <AddressForm
                  onComplete={(data) => {
                    setAddressData(data)
                    setTimeout(() => setCurrentStep(1), 300)
                  }}
                  initialData={addressData}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
                <ShippingSelection
                  selected={selectedShipping}
                  onSelect={(method) => {
                    setSelectedShipping(method)
                    // Auto-advance to next step after selection
                    setTimeout(() => setCurrentStep(2), 300)
                  }}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
                <PaymentSelection
                  selected={selectedPayment}
                  onSelect={(method) => {
                    setSelectedPayment(method)
                    // Auto-advance to summary step after selection
                    setTimeout(() => setCurrentStep(3), 300)
                  }}
                />
              </div>
            )}
            
            {currentStep === 3 && (
              <OrderSummary
                addressData={addressData}
                selectedShipping={selectedShippingMethod}
                selectedPayment={selectedPaymentMethod}
                // onEditClick={() => setCurrentStep(0)}
                // onCompleteClick={handleComplete}
              />
            )}
          </div>
        </div>
        
        <div className="lg:pl-8">
          <OrderPreview
            shippingPrice={shippingPrice}
            paymentFee={paymentFee}
            className="order-summary--sticky"
          />
        </div>
      </div>
    </div>
  )
}