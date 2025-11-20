import type { CartLineItem } from '@/services/cart-service'
import { formatToTaxIncluded } from '@/utils/format/format-product'
import Image from 'next/image'

interface CartItemRowProps {
  item: CartLineItem
  currencyCode: string
}

export function CartItemRow({ item, currencyCode }: CartItemRowProps) {
  const tax = item.tax_lines?.[0].rate ? item.tax_lines?.[0].rate * 0.01 : 0
  const price = formatToTaxIncluded({
    amount: item.unit_price,
    tax,
    currency: currencyCode,
  })
  return (
    <div className="flex gap-200">
      {item.thumbnail && (
        <Image
          src={item.thumbnail}
          alt={item.title}
          width={64}
          height={64}
          className="h-16 w-16 rounded object-cover"
          onClick={() => console.log({ item: item, tax: tax })}
        />
      )}
      <div className="flex-1">
        <p className="font-medium text-fg-primary text-sm">{item.title}</p>
        <p className="text-fg-secondary text-xs">Qty: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-fg-primary text-sm">{price}</p>
      </div>
    </div>
  )
}
