import type { StoreOrder } from '@medusajs/types'
import { Badge } from '@techsio/ui-kit/atoms/badge'
import { LinkButton } from '@techsio/ui-kit/atoms/link-button'
import { Icon } from '@ui/atoms/icon'
import Image from 'next/image'
import Link from 'next/link'
import {
  formatOrderDate,
  formatPrice,
  getOrderStatusLabel,
  getOrderStatusVariant,
  truncateProductTitle,
} from './order-utils'

export function MobileOrderCard({ order }: { order: StoreOrder }) {
  const statusVariant = getOrderStatusVariant(order.status)
  const itemCount = order.items?.length || 0
  const firstItem = order.items?.[0]
  const hasMultipleItems = itemCount > 1

  return (
    <div className="rounded border border-border-secondary bg-base p-300">
      {/* Header with order number and status */}
      <div className="mb-200 flex items-start justify-between">
        <div>
          <p className="font-medium text-fg-primary">
            Objednávka #{order.display_id}
          </p>
          <p className="mt-50 text-fg-secondary text-sm">
            {formatOrderDate({ dateString: order.created_at as string })}
          </p>
        </div>
        <Badge variant={statusVariant}>
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Items preview */}
      <div className="mb-300">
        <div className="flex items-center gap-200">
          {/* Product images */}
          <div className="-space-x-100 flex">
            {order.items?.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="relative size-[48px] overflow-hidden rounded-full border-2 border-border-secondary bg-surface"
                style={{ zIndex: 3 - index }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.product_title || ''}
                    className="size-full object-cover"
                    width={48}
                    height={48}
                  />
                )}
              </div>
            ))}
            {itemCount > 3 && (
              <div className="relative flex size-[48px] items-center justify-center overflow-hidden rounded-full border-2 border-border-secondary bg-secondary">
                <span className="font-medium text-fg-reverse">
                  +{itemCount - 3}
                </span>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="min-w-0 flex-1">
            {hasMultipleItems ? (
              <p className="text-fg-primary">{itemCount} položek</p>
            ) : firstItem ? (
              <p className="line-clamp-1 text-fg-primary">
                {truncateProductTitle(firstItem.product_title || '')}
              </p>
            ) : null}
            <p className="text-fg-secondary text-sm">
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
      <div className="flex items-center justify-between border-border-tertiary border-t pt-200">
        <div className="flex items-center gap-100">
          <Icon icon="token-icon-cash" className="text-fg-secondary" />
          <span className="font-semibold text-fg-primary">
            {formatPrice(
              order.summary?.current_order_total || order.total || 0,
              order.currency_code
            )}
          </span>
        </div>
        <LinkButton
          as={Link}
          href={`/ucet/objednavky/${order.id}`}
          prefetch
          variant="primary"
          theme="solid"
          size="sm"
        >
          Zobrazit detail
        </LinkButton>
      </div>
    </div>
  )
}
