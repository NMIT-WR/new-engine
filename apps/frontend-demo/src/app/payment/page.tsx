'use client'

import { Steps } from '@ui/molecules/steps'
import { useState } from 'react'
import { PaymentSelection } from '../../components/molecules/payment-selection'
import { ShippingSelection } from '../../components/molecules/shipping-selection'

// Import payment and shipping methods data
const paymentMethods = [
  { id: 'comgate', name: 'Comgate' },
  { id: 'gopay', name: 'GoPay' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'cash', name: 'Hotovost' },
  { id: 'skippay', name: 'SkipPay' },
  { id: 'stripe', name: 'Stripe' },
  { id: 'card', name: 'Platební kartou' },
  { id: 'qr', name: 'QR platba' },
]

const shippingMethods = [
  { id: 'ppl', name: 'PPL' },
  { id: 'dhl', name: 'DHL' },
  { id: 'zasilkovna', name: 'Zásilkovna' },
  { id: 'balikovna', name: 'Balíkovna' },
  { id: 'personal', name: 'Osobní odběr' },
]

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [selectedShipping, setSelectedShipping] = useState<string>('')

  const steps = [
    {
      value: 0,
      title: 'Doprava',
      description: 'Vyberte způsob doručení',
    },
    {
      value: 1,
      title: 'Platba',
      description: 'Vyberte způsob platby',
    },
  ]

  const handleStepChange = (step: number) => {
    // Only allow forward movement if current step is completed
    if (step > currentStep) {
      if (currentStep === 0 && !selectedShipping) {
        return
      }
      if (currentStep === 1 && !selectedPayment) {
        return
      }
    }
    setCurrentStep(step)
  }

  const handleComplete = () => {
    // Handle order completion
  }

  return (
    <div className="container mx-auto max-w-[80rem] px-4 py-8">
      <h1 className="mb-8 text-center font-bold text-3xl">Platba a doprava</h1>

      <div className="mx-auto max-w-[64rem]">
        <Steps
          items={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          onStepComplete={handleComplete}
          orientation="horizontal"
          linear={false}
          completeText={
            <div className="py-8 text-center">
              <div className="mb-8">
                <svg
                  className="mx-auto mb-4 h-20 w-20 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Objednávka dokončena"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="mb-4 font-bold text-2xl">Souhrn objednávky</h2>
              </div>
              <div className="mx-auto max-w-[28rem] space-y-4 rounded-lg bg-gray-50 p-6 text-left dark:bg-gray-800">
                <div className="flex items-center justify-between border-gray-200 border-b py-2 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    Doprava:
                  </span>
                  <span className="font-medium">
                    {selectedShipping
                      ? shippingMethods.find((m) => m.id === selectedShipping)
                          ?.name
                      : 'Nevybráno'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Platba:
                  </span>
                  <span className="font-medium">
                    {selectedPayment
                      ? paymentMethods.find((m) => m.id === selectedPayment)
                          ?.name
                      : 'Nevybráno'}
                  </span>
                </div>
              </div>
              <button type="button" className="mt-6 rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary/90">
                Dokončit objednávku
              </button>
            </div>
          }
        />

        <div className="mt-8">
          {currentStep === 0 && (
            <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
              <ShippingSelection
                selected={selectedShipping}
                onSelect={(method) => {
                  setSelectedShipping(method)
                  // Auto-advance to next step after selection
                  setTimeout(() => setCurrentStep(1), 300)
                }}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="fade-in slide-in-from-bottom-2 animate-in duration-300">
              <PaymentSelection
                selected={selectedPayment}
                onSelect={(method) => {
                  setSelectedPayment(method)
                  // Auto-advance to complete step after selection
                  setTimeout(() => setCurrentStep(2), 300)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

