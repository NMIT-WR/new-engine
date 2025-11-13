import { Button } from '@new-engine/ui/atoms/button'
import { Icon } from '@new-engine/ui/atoms/icon'
import type { StoreCartLineItem } from '@medusajs/types'

interface CartItemProps {
  item: StoreCartLineItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  isPending?: boolean
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isPending = false
}: CartItemProps) => {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1)
    }
  }

  const handleIncrement = () => {
    // Max quantity check can be added here if we have inventory data
    const maxQuantity = item.variant?.inventory_quantity || 99
    if (item.quantity < maxQuantity) {
      onUpdateQuantity(item.quantity + 1)
    }
  }

  // Format price helper
  const formatPrice = (amount?: number | null, currencyCode?: string) => {
    if (!amount) return '0 Kč'
    
    const formatted = new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: currencyCode || 'CZK',
    }).format(amount / 100) // Medusa stores prices in cents

    return formatted
  }

  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      {/* Product thumbnail */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {item.product?.thumbnail ? (
          <img
            src={item.product.thumbnail}
            alt={item.product.title || item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon icon="icon-[mdi--image-outline]" className="text-2xl text-gray-400" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.product?.title || item.title}
        </h4>
        {item.variant?.title && item.variant.title !== 'Default' && (
          <p className="text-xs text-gray-500 truncate">{item.variant.title}</p>
        )}
        <p className="mt-1 text-sm font-medium text-gray-900">
          {formatPrice(item.subtotal, item.cart?.currency_code)}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="tertiary"
          theme="outlined"
          size="sm"
          icon="icon-[mdi--minus]"
          onClick={handleDecrement}
          disabled={isPending || item.quantity <= 1}
          className="h-7 w-7 p-0"
        />
        <span className="min-w-[2rem] text-center text-sm font-medium">
          {item.quantity}
        </span>
        <Button
          variant="tertiary"
          theme="outlined"
          size="sm"
          icon="icon-[mdi--plus]"
          onClick={handleIncrement}
          disabled={isPending}
          className="h-7 w-7 p-0"
        />
      </div>

      {/* Remove button */}
      <Button
        variant="tertiary"
        theme="unstyled"
        size="sm"
        icon="icon-[mdi--close]"
        onClick={onRemove}
        disabled={isPending}
        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
        aria-label="Odstranit z košíku"
      />
    </div>
  )
}