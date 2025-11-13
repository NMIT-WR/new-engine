import type { StoreCartLineItem } from '@medusajs/types'
import { Button } from '@new-engine/ui/atoms/button'
import { Icon } from '@new-engine/ui/atoms/icon'
import Image from 'next/image'

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
  isPending = false,
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

  // Format price directly - Medusa v2 stores prices in major units (not cents)
  const formattedPrice = item.unit_price
    ? `${Math.round(item.unit_price)} Kč`
    : '0 Kč'

  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      {/* Product thumbnail */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            className="h-full w-full object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon
              icon="icon-[mdi--image-outline]"
              className="text-2xl text-gray-400"
            />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="min-w-0 flex-1">
        <h4
          className="truncate font-medium text-gray-900 text-sm"
          onClick={() => console.log(item)}
        >
          {item.product?.title || item.title}
        </h4>
        {item.variant?.title && item.variant.title !== 'Default' && (
          <p className="truncate text-gray-500 text-xs">{item.variant.title}</p>
        )}
        <p className="mt-1 font-medium text-gray-900 text-sm">
          {formattedPrice}
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
        <span className="min-w-[2rem] text-center font-medium text-sm">
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