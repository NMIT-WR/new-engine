import type { CartLineItem } from '@/services/cart-service'
import Image from 'next/image'

interface CartItemRowProps {
  item: CartLineItem
  currencyCode: string
}

export function CartItemRow({ item, currencyCode }: CartItemRowProps) {
  return (
    <div className="flex gap-200">
      {item.thumbnail && (
        <Image
          src={item.thumbnail}
          alt={item.title}
          width={64}
          height={64}
          className="h-16 w-16 rounded object-cover"
        />
      )}
      <div className="flex-1">
        <p className="font-medium text-fg-primary text-sm">{item.title}</p>
        <p className="text-fg-secondary text-xs">Qty: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-fg-primary text-sm">
          {item.total} {currencyCode}
        </p>
      </div>
    </div>
  )
}
