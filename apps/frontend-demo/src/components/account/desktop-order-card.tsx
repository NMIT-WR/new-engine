import { formatPrice } from '@/lib/format-price'
import {
  formatOrderDate,
  getOrderStatusLabel,
  truncateProductTitle,
} from '@/lib/order-utils'
import type { StoreOrder } from '@medusajs/types'
import { Badge } from '@ui/atoms/badge'
import { LinkButton } from '@ui/atoms/link-button'
import Image from 'next/image'
import Link from 'next/link'

export function DesktopOrderCard({ order }: { order: StoreOrder }) {
  return (
    <div
      key={order.id}
      className="grid grid-cols-12 gap-orders-card border-orders-border border-b p-sm transition-colors hover:bg-orders-card-hover"
    >
      <div className="col-span-2 flex items-center">
        <div>
          <p className="font-medium text-orders-fg-primary text-orders-md">
            #{order.display_id}
          </p>
          <Badge
            variant={
              order.status === 'completed'
                ? 'success'
                : order.status === 'pending'
                  ? 'warning'
                  : order.status === 'canceled'
                    ? 'danger'
                    : 'info'
            }
            className="mt-orders-overlap inline-flex"
          >
            {getOrderStatusLabel(order.status)}
          </Badge>
        </div>
      </div>

      <div className="col-span-2 flex items-center">
        <p className="text-orders-fg-secondary text-orders-md">
          {formatOrderDate(order.created_at as string)}
        </p>
      </div>

      <div className="col-span-4 flex items-center">
        <div className="flex items-center gap-orders-sm">
          <div className="-space-x-2 flex">
            {order.items?.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="relative h-fit w-10 overflow-hidden rounded-full border-2 border-base bg-orders-overlay"
                style={{ zIndex: 3 - index }}
              >
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.product_title || ''}
                    className="aspect-square object-cover"
                    width={40}
                    height={40}
                  />
                )}
              </div>
            ))}
            {order.items && order.items.length > 3 && (
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-base bg-orders-overlay">
                <span className="font-medium text-orders-fg-secondary text-orders-sm">
                  +{order.items.length - 3}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-orders-fg-primary text-orders-md">
              {order.items?.[0] &&
                order.items.length < 2 &&
                truncateProductTitle(order.items[0].product_title || '')}
            </p>
            <p className="text-fg-tertiary text-orders-sm">
              {order.items?.length || 0} položek
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-end">
        <p className="font-semibold text-orders-fg-primary">
          {formatPrice(
            order.summary?.current_order_total || order.total || 0,
            order.currency_code
          )}
        </p>
      </div>

      <div className="col-span-2 flex items-center justify-end">
        <LinkButton
          as={Link}
          prefetch={true}
          href={`/account/orders/${order.id}`}
          size="sm"
          variant="primary"
        >
          Detail
        </LinkButton>
      </div>
    </div>
  )
}
