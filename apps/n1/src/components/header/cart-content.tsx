'use client'
import { useRemoveLineItem, useUpdateLineItem } from '@/hooks/use-cart'
import { useCartToast } from '@/hooks/use-toast'
import type { Cart } from '@/services/cart-service'
import { getOptimisticFlag } from '@/utils/cart'
import { formatAmount } from '@/utils/format/format-product'
import { Button } from '@new-engine/ui/atoms/button'
import Link from 'next/link'
import { CartEmptyState } from './cart-empty-state'
import { CartItem } from './cart-item'
import { CartSkeleton } from './cart-skeleton'

interface CartContentProps {
  cart: Cart | null | undefined
  isLoading: boolean
  onClose?: () => void
}

export const CartContent = ({ cart, isLoading, onClose }: CartContentProps) => {
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateLineItem()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveLineItem()
  const toast = useCartToast()

  const handleUpdateQuantity =
    (itemId: string, itemTitle: string) => (quantity: number) => {
      if (!cart) return

      updateQuantity(
        {
          cartId: cart.id,
          lineItemId: itemId,
          quantity,
        },
        {
          onError: (error) => {
            toast.cartError(error.message)
          },
        }
      )
    }

  const handleRemoveItem = (itemId: string, itemTitle: string) => () => {
    if (!cart) return

    removeItem(
      {
        cartId: cart.id,
        lineItemId: itemId,
      },
      {
        onSuccess: () => {
          toast.removedFromCart(itemTitle)
        },
        onError: (error) => {
          toast.cartError(error.message)
        },
      }
    )
  }

  if (isLoading) {
    return <CartSkeleton />
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <CartEmptyState onContinueShopping={onClose} />
  }

  const isPending = isUpdating || isRemoving
  const isOptimistic = getOptimisticFlag(cart)

  return (
    <div className="flex flex-col gap-4">
      <div className="max-h-[400px] divide-y divide-gray-200 overflow-y-auto">
        {cart.items.map((item) => {
          const itemTitle = item.product_title || item.title || 'Product'
          const itemOptimistic = getOptimisticFlag(item)

          return (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity(item.id, itemTitle)}
              onRemove={handleRemoveItem(item.id, itemTitle)}
              isPending={isPending}
              isOptimistic={isOptimistic || itemOptimistic}
            />
          )
        })}
      </div>

      <div className="border-gray-200 border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mezisoučet:</span>
            <span className="text-gray-900">{formatAmount(cart.subtotal)}</span>
          </div>
          {cart.shipping_total !== undefined && cart.shipping_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Doprava:</span>
              <span className="text-gray-900">
                {formatAmount(cart.shipping_total)}
              </span>
            </div>
          )}

          {cart.tax_total !== undefined && cart.tax_total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">DPH:</span>
              <span className="text-gray-900">
                {formatAmount(cart.tax_total)}
              </span>
            </div>
          )}

          {cart.discount_total !== undefined && cart.discount_total > 0 && (
            <div className="flex justify-between text-green-600 text-sm">
              <span>Sleva:</span>
              <span>-{formatAmount(cart.discount_total)}</span>
            </div>
          )}

          <div className="flex justify-between border-gray-200 border-t pt-2 font-semibold text-md">
            <span>Celkem:</span>
            <span>{formatAmount(cart.total)}</span>
          </div>

          {cart.subtotal && cart.subtotal < 1500 && (
            <p className="pt-2 text-center text-gray-500 text-xs">
              Doprava zdarma od 1 500 Kč (zbývá{' '}
              {formatAmount(1500 - cart.subtotal)})
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Link href="/pokladna" className="block" onClick={onClose}>
          <Button
            variant="primary"
            theme="solid"
            size="md"
            className="w-full justify-center"
            disabled={isPending}
          >
            Přejít k pokladně
          </Button>
        </Link>

        <Button
          variant="secondary"
          theme="outlined"
          size="sm"
          className="w-full justify-center"
          onClick={onClose}
        >
          Pokračovat v nákupu
        </Button>
      </div>
    </div>
  )
}
