import { useDebounce } from '@/hooks/use-debounce'
import type { CartLineItem } from '@/services/cart-service'
import { Button } from '@new-engine/ui/atoms/button'
import { Icon } from '@new-engine/ui/atoms/icon'
import { NumericInput } from '@new-engine/ui/atoms/numeric-input'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface CartItemProps {
  item: CartLineItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  isPending?: boolean
  isOptimistic?: boolean
}

export const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isPending = false,
  isOptimistic = false,
}: CartItemProps) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity)
  const title = item.product_title || item.title || 'Unknown Product'
  const variantTitle = item.variant_title
  const thumbnail = item.thumbnail
  const effectiveMax =
    (item.metadata?.inventory_quantity as number | undefined) ?? 10

  useEffect(() => {
    setLocalQuantity(item.quantity)
  }, [item.quantity])

  const debouncedUpdate = useDebounce((quantity: number) => {
    onUpdateQuantity(quantity)
  }, 300)

  const handleQuantityChange = (newQuantity: number) => {
    if (Number.isNaN(newQuantity) || !Number.isFinite(newQuantity)) {
      return
    }

    const validValue = Math.min(newQuantity, effectiveMax)
    setLocalQuantity(newQuantity)
    debouncedUpdate(validValue)
  }

  const formattedPrice = item.unit_price
    ? `${Math.round(item.unit_price)} Kč`
    : '0 Kč'

  return (
    <div
      className={`flex gap-3 py-3 first:pt-0 last:pb-0 ${isOptimistic ? 'opacity-60' : ''}
        ${isPending ? 'pointer-events-none' : ''}
      `}
    >
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
            width={64}
            height={64}
            quality={40}
            loading="lazy"
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

      <div className="min-w-0 flex-1">
        <Link
          href={`/produkt/${item.product_handle}?variant=${item.variant_title}`}
        >
          <h4 className="truncate font-medium text-gray-900 text-sm underline hover:no-underline">
            {title}
          </h4>
        </Link>

        {variantTitle && variantTitle !== 'Default' && (
          <p className="truncate text-gray-500 text-xs">{variantTitle}</p>
        )}

        <p className="font-medium text-gray-900 text-sm">{formattedPrice}</p>

        {effectiveMax < 3 && effectiveMax > 0 && (
          <p className="text-2xs text-danger">Zbývá pouze {effectiveMax} ks</p>
        )}
      </div>

      <div className="flex items-center">
        <NumericInput
          value={localQuantity}
          onChange={handleQuantityChange}
          min={1}
          max={effectiveMax}
          allowOverflow={false}
          className="h-8 border-collapse gap-0"
        >
          <NumericInput.DecrementTrigger
            theme="outlined"
            className="bg-base"
            disabled={localQuantity === 1}
          />
          <NumericInput.Control className="aspect-square border-border-secondary border-x-0 focus-within:border-x-1">
            <NumericInput.Input className="justify-center px-0 text-center" />
          </NumericInput.Control>
          <NumericInput.IncrementTrigger
            theme="outlined"
            className="bg-base"
            disabled={localQuantity >= effectiveMax}
          />
        </NumericInput>
      </div>

      <Button
        variant="tertiary"
        theme="unstyled"
        size="sm"
        icon="icon-[mdi--trash-can-outline]"
        onClick={onRemove}
        disabled={isPending}
        className="h-7 w-7 p-0 text-gray-400 transition-colors hover:text-gray-600"
        aria-label={`Odstranit ${title} z košíku`}
      />
    </div>
  )
}
