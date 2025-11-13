'use client'

import { Button } from '@new-engine/ui/atoms/button'
import Link from 'next/link'
import { useUpdateLineItem, useRemoveLineItem } from '@/hooks/use-cart'
import { CartEmptyState } from './cart-empty-state'
import { CartItem } from './cart-item'
import { CartSkeleton } from './cart-skeleton'
import type { StoreCart } from '@medusajs/types'

interface CartContentProps {
  cart: StoreCart | null | undefined
  isLoading: boolean
  isAuthenticated: boolean
  onClose?: () => void
}

export const CartContent = ({
  cart,
  isLoading,
  isAuthenticated,
  onClose
}: CartContentProps) => {
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateLineItem()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveLineItem()

  // Format price helper
  const formatPrice = (amount?: number | null, currencyCode?: string) => {
    if (!amount) return '0 Kč'
    
    const formatted = new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: currencyCode || 'CZK',
    }).format(amount / 100) // Medusa stores prices in cents

    return formatted
  }

  // Cart now works for both authenticated and guest users

  // Loading state
  if (isLoading) {
    return <CartSkeleton />
  }

  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return <CartEmptyState onContinueShopping={onClose} />
  }

  const isPending = isUpdating || isRemoving

  return (
    <div className="flex flex-col gap-4">
      {/* Cart items list */}
      <div className="max-h-[400px] divide-y divide-gray-200 overflow-y-auto">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={(quantity) => {
              updateQuantity({
                cartId: cart.id,
                lineItemId: item.id,
                quantity
              })
            }}
            onRemove={() => {
              removeItem({
                cartId: cart.id,
                lineItemId: item.id
              })
            }}
            isPending={isPending}
          />
        ))}
      </div>

      {/* Totals section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mezisoučet:</span>
            <span className="text-gray-900">
              {formatPrice(cart.subtotal, cart.currency_code)}
            </span>
          </div>

          {/* Shipping */}
          {cart.shipping_total !== undefined && cart.shipping_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Doprava:</span>
              <span className="text-gray-900">
                {formatPrice(cart.shipping_total, cart.currency_code)}
              </span>
            </div>
          )}

          {/* Tax */}
          {cart.tax_total !== undefined && cart.tax_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">DPH:</span>
              <span className="text-gray-900">
                {formatPrice(cart.tax_total, cart.currency_code)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
            <span>Celkem:</span>
            <span>{formatPrice(cart.total, cart.currency_code)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        {/* Checkout button */}
        <Link href="/pokladna" className="block">
          <Button
            variant="primary"
            theme="solid"
            size="md"
            className="w-full justify-center"
            onClick={onClose}
          >
            Přejít k pokladně
          </Button>
        </Link>

        {/* View cart button */}
        <Link href="/kosik" className="block">
          <Button
            variant="secondary"
            theme="outlined"
            size="sm"
            className="w-full justify-center"
            onClick={onClose}
          >
            Zobrazit košík
          </Button>
        </Link>
      </div>
    </div>
  )
}