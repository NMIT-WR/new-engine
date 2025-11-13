'use client'

import { useRemoveLineItem, useUpdateLineItem } from '@/hooks/use-cart'
import type { StoreCart } from '@medusajs/types'
import { Button } from '@new-engine/ui/atoms/button'
import Link from 'next/link'
import { CartEmptyState } from './cart-empty-state'
import { CartItem } from './cart-item'
import { CartSkeleton } from './cart-skeleton'

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
  onClose,
}: CartContentProps) => {
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateLineItem()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveLineItem()

  // Helper to format prices - Medusa v2 stores prices in major units (not cents)
  const formatAmount = (amount?: number | null) => {
    if (!amount) return '0 Kč'
    return `${Math.round(amount)} Kč`
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
                quantity,
              })
            }}
            onRemove={() => {
              removeItem({
                cartId: cart.id,
                lineItemId: item.id,
              })
            }}
            isPending={isPending}
          />
        ))}
      </div>

      {/* Totals section */}
      <div className="border-gray-200 border-t pt-4">
        <div className="space-y-2">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mezisoučet:</span>
            <span className="text-gray-900">
              {formatAmount(cart.subtotal)}
            </span>
          </div>

          {/* Shipping */}
          {cart.shipping_total !== undefined && cart.shipping_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Doprava:</span>
              <span className="text-gray-900">
                {formatAmount(cart.shipping_total)}
              </span>
            </div>
          )}

          {/* Tax */}
          {cart.tax_total !== undefined && cart.tax_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">DPH:</span>
              <span className="text-gray-900">
                {formatAmount(cart.tax_total)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between border-gray-200 border-t pt-2 font-semibold text-base">
            <span>Celkem:</span>
            <span>{formatAmount(cart.total)}</span>
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
        <Button
          variant="secondary"
          theme="outlined"
          size="sm"
          className="w-full justify-center"
          onClick={() => console.log('View cart: ', cart)}
        >
          Zobrazit košík
        </Button>
      </div>
    </div>
  )
}