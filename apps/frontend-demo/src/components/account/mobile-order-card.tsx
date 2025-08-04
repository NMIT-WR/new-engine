import { formatPrice } from '@/lib/format-price'
import {
  formatOrderDate,
  getOrderStatusLabel,
  truncateProductTitle,
} from '@/lib/order-utils'
import type { StoreOrder } from '@medusajs/types'
import { Badge } from '@ui/atoms/badge'
import { Icon } from '@ui/atoms/icon'
import { LinkButton } from '@ui/atoms/link-button'
import Image from 'next/image'
import Link from 'next/link'

export function MobileOrderCard({ order }: { order: StoreOrder }) {
  const statusVariant =
    order.status === 'completed'
      ? 'success'
      : order.status === 'pending'
        ? 'warning'
        : order.status === 'canceled'
          ? 'danger'
          : 'info'

  const itemCount = order.items?.length || 0
  const firstItem = order.items?.[0]
  const hasMultipleItems = itemCount > 1

  return (
    <div className="rounded-md border border-orders-border bg-orders-card-bg p-4">
      {/* Header with order number and status */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-medium text-orders-fg-primary">
            Objednávka #{order.display_id}
          </p>
          <p className="mt-1 text-orders-fg-secondary text-orders-md">
            {formatOrderDate(order.created_at as string)}
          </p>
        </div>
        <Badge variant={statusVariant}>
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Items preview */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          {/* Product images */}
          <div className="-space-x-2 flex">
            {order.items?.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-orders-border bg-orders-overlay"
                style={{ zIndex: 3 - index }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.product_title || ''}
                    className="h-full w-full object-cover"
                    width={48}
                    height={48}
                  />
                )}
              </div>
            ))}
            {itemCount > 3 && (
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-orders-border bg-orders-overlay">
                <span className="font-medium text-orders-fg-secondary text-orders-md">
                  +{itemCount - 3}
                </span>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="min-w-0 flex-1">
            {hasMultipleItems ? (
              <p className="text-orders-fg-primary text-orders-md">
                {itemCount} položek
              </p>
            ) : firstItem ? (
              <p className="line-clamp-1 text-orders-fg-primary text-orders-md">
                {truncateProductTitle(firstItem.product_title || '')}
              </p>
            ) : null}
            <p className="text-orders-fg-secondary text-xs">
              {hasMultipleItems && firstItem && (
                <span className="line-clamp-1">
                  {truncateProductTitle(firstItem.product_title || '')}
                  {itemCount > 2 && ' a další'}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Footer with price and action */}
      <div className="flex items-center justify-between border-orders-border border-t pt-3">
        <div className="flex items-center gap-2">
          <Icon
            icon="icon-[mdi--cash]"
            className="text-orders-fg-secondary"
            size="sm"
          />
          <span className="font-semibold text-orders-fg-primary">
            {formatPrice(
              order.summary?.current_order_total || order.total || 0,
              order.currency_code
            )}
          </span>
        </div>
        <LinkButton
          as={Link}
          href={`/account/orders/${order.id}`}
          size="sm"
          variant="primary"
          prefetch={true}
        >
          Zobrazit detail
        </LinkButton>
      </div>
    </div>
  )
}
