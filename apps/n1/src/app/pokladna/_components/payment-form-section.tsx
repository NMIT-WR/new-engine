'use client'

import { useCheckout } from '@/hooks/use-checkout'
import { useRegion } from '@/hooks/use-region'
import type { Cart } from '@/services/cart-service'
import { Checkbox } from '@new-engine/ui/molecules/checkbox'
import { Button } from '@ui/atoms/button'
import { useState } from 'react'

interface PaymentFormSectionProps {
  cart: Cart
}

export function PaymentFormSection({ cart }: PaymentFormSectionProps) {
  const { regionId } = useRegion()
  const checkout = useCheckout(cart.id, regionId, cart)
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  const {
    paymentProviders,
    isLoadingProviders,
    hasPaymentSessions,
    canInitiatePayment,
    isInitiatingPayment,
    initiatePayment,
  } = checkout.payment

  function handleProviderSelect(providerId: string) {
    if (selectedProvider !== providerId) {
      setSelectedProvider(providerId)
      initiatePayment(providerId)
    }
  }

  // Loading state
  if (isLoadingProviders) {
    return (
      <section className="rounded border border-border-secondary bg-surface/70 p-400">
        <h2 className="mb-400 font-semibold text-fg-primary text-lg">Platba</h2>
        <p className="text-fg-secondary text-sm">
          Načítání platebních metod...
        </p>
      </section>
    )
  }

  return (
    <section className="rounded border border-border-secondary bg-surface/70 p-400">
      <h2 className="mb-400 font-semibold text-fg-primary text-lg">Platba</h2>
      {paymentProviders && paymentProviders.length > 0 && (
        <>
          <div className="mb-300">
            <p className="font-medium text-fg-primary text-sm">
              Vyberte způsob platby:
            </p>
          </div>
          <ul className="space-y-300">
            {paymentProviders.map((provider) => (
              <li
                key={provider.id}
                className="flex w-full items-center gap-300 rounded border border-border-secondary p-300"
              >
                <Checkbox
                  checked={selectedProvider === provider.id}
                  onCheckedChange={() => handleProviderSelect(provider.id)}
                />
                <Button
                  onClick={() => handleProviderSelect(provider.id)}
                  disabled={isInitiatingPayment}
                  theme="unstyled"
                  className="text-left"
                >
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium text-fg-primary text-sm">
                      {provider.id === 'pp_system_default'
                        ? 'Při převzetí'
                        : provider.id}
                    </span>
                    <span className="text-fg-secondary text-xs">
                      {provider.id === 'pp_system_default'
                        ? 'Zaplatíte při doručení objednávky'
                        : 'Online platba'}
                    </span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>

          {!canInitiatePayment && (
            <p className="mt-300 text-fg-tertiary text-xs">
              💡 Nejprve vyberte způsob dopravy
            </p>
          )}
        </>
      )}

      {/* Default provider fallback */}
      {!hasPaymentSessions &&
        (!paymentProviders || paymentProviders.length === 0) && (
          <div className="rounded border border-border-primary bg-surface-secondary p-300">
            <p className="font-medium text-fg-primary text-sm">Při převzetí</p>
            <p className="mt-100 text-fg-secondary text-xs">
              Zaplatíte při doručení objednávky
            </p>
          </div>
        )}
    </section>
  )
}
