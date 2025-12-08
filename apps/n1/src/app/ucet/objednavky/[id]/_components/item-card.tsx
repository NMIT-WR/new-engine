import { formatAmount } from '@/utils/format/format-product'
import { truncateText } from '@/utils/truncate-text'
import type { StoreOrderLineItem } from '@medusajs/types'
import { Badge } from '@techsio/ui-kit/atoms/badge'
import { Icon } from '@techsio/ui-kit/atoms/icon'
import { ProductCard } from '@techsio/ui-kit/molecules/product-card'
import Image from 'next/image'
import Link from 'next/link'

export const ItemCard = ({
  item,
  currency_code,
}: { item: StoreOrderLineItem; currency_code: string }) => {
  return (
    <ProductCard
      key={item.id}
      className="group overflow-hidden border border-border-secondary px-0 py-0 transition-shadow hover:shadow-md"
    >
      {/* Product Image with Quantity Badge */}
      <div className="relative">
        {item.thumbnail ? (
          <ProductCard.Image
            as={Image}
            src={item.thumbnail}
            alt={item.product_title || item.title || ''}
            width={300}
            height={300}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-surface">
            <Icon
              icon="token-icon-package"
              className="size-600 text-fg-tertiary"
            />
          </div>
        )}
        {/* Quantity badge */}
        <ProductCard.Badges className="absolute top-1 right-1">
          <Badge variant="secondary" className="h-8 w-8 rounded-full">
            {`${item.quantity}x`}
          </Badge>
        </ProductCard.Badges>
      </div>

      {/* Product Name as Link */}
      <div className="flex flex-col bg-surface-light p-200">
        <Link
          href={`/produkty/${item.product_handle}?variant=${item.subtitle?.trim()}`}
          className="block underline transition-colors hover:text-primary hover:no-underline"
        >
          <ProductCard.Name>
            {truncateText(item.product_title || item.title || '')}
          </ProductCard.Name>
        </Link>

        {/* Variant */}
        {item.variant_title && item.variant_title !== 'Default' && (
          <p className="text-fg-secondary text-sm">
            Varianta: {item.variant_title}
          </p>
        )}

        {/* Prices */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-fg-tertiary text-xs">Cena za kus</p>
            <ProductCard.Price className="text-sm">
              {formatAmount(item.total)}
            </ProductCard.Price>
          </div>
          <div className="text-right">
            <p className="text-fg-tertiary text-xs">Celkem</p>
            <ProductCard.Price>{formatAmount(item.total)}</ProductCard.Price>
          </div>
        </div>
      </div>
    </ProductCard>
  )
}
