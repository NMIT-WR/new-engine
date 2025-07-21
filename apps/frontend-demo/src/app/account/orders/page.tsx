'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { useAuth } from '@/hooks/use-auth'
import { formatPrice } from '@/lib/format-price'
import { sdk } from '@/lib/medusa-client'
import {
  ORDER_FIELDS,
  formatOrderDate,
  getOrderStatusLabel,
  truncateProductTitle,
} from '@/lib/order-utils'
import { queryKeys } from '@/lib/query-keys'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@ui/atoms/badge'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import { LinkButton } from '@ui/atoms/link-button'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OrdersPage() {
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/auth/login')
    }
  }, [user, isInitialized, router])

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: async () => {
      const response = await sdk.store.order.list({
        fields: ORDER_FIELDS.join(','),
      })
      return response
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  if (!isInitialized || authLoading) {
    return (
      <div className="mx-auto max-w-layout-max px-sm py-lg">
        <SkeletonLoader className="mb-lg h-8 w-48" />
        <div className="space-y-3xs">
          <div className="rounded-sm bg-surface">
            <div className="grid grid-cols-12 gap-sm border-border-subtle border-b p-sm">
              <SkeletonLoader className="col-span-2 h-4" />
              <SkeletonLoader className="col-span-2 h-4" />
              <SkeletonLoader className="col-span-4 h-4" />
              <SkeletonLoader className="col-span-2 h-4" />
              <SkeletonLoader className="col-span-2 h-4" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-sm border-border-subtle border-b p-sm"
              >
                <SkeletonLoader className="col-span-2 h-5" />
                <SkeletonLoader className="col-span-2 h-5" />
                <SkeletonLoader className="col-span-4 h-12" />
                <SkeletonLoader className="col-span-2 h-5" />
                <SkeletonLoader className="col-span-2 h-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const orders = ordersData?.orders || []
  const totalAmount = orders.reduce(
    (sum, order) =>
      sum + (order.summary?.current_order_total || order.total || 0),
    0
  )
  const completedOrders = orders.filter(
    (order) => order.status === 'completed'
  ).length
  const pendingOrders = orders.filter(
    (order) => order.status === 'pending'
  ).length

  return (
    <div className="mx-auto max-w-layout-max px-sm py-lg">
      <div className="mb-xl">
        <div className="mb-md flex items-end justify-between">
          <div>
            <h1 className="mb-xs font-semibold text-3xl text-fg-primary">
              Přehled objednávek
            </h1>
            <p className="text-fg-secondary">
              Kompletní historie vašich nákupů
            </p>
          </div>
          <div className="text-right">
            <p className="mb-3xs text-fg-secondary text-sm">Celková útrata</p>
            <p className="font-bold text-2xl text-primary">
              {formatPrice(totalAmount, 'CZK')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-md border-t pt-md">
          <div className="flex items-center gap-xs">
            <Icon
              icon="icon-[mdi--shopping-outline]"
              className="text-fg-secondary"
            />
            <span className="text-sm">
              <strong className="text-fg-primary">{orders.length}</strong>
              <span className="ml-3xs text-fg-secondary">
                objednávek celkem
              </span>
            </span>
          </div>
          <div className="text-fg-secondary">•</div>
          <div className="flex items-center gap-xs">
            <Icon
              icon="icon-[mdi--check-circle-outline]"
              className="text-success"
            />
            <span className="text-sm">
              <strong className="text-success">{completedOrders}</strong>
              <span className="ml-3xs text-fg-secondary">dokončených</span>
            </span>
          </div>
          <div className="text-fg-secondary">•</div>
          <div className="flex items-center gap-xs">
            <Icon icon="icon-[mdi--clock-outline]" className="text-warning" />
            <span className="text-sm">
              <strong className="text-warning">{pendingOrders}</strong>
              <span className="ml-3xs text-fg-secondary">zpracovávaných</span>
            </span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-sm border border-danger bg-surface p-lg text-center">
          <p className="mb-xs font-medium text-danger">
            Chyba při načítání objednávek
          </p>
          <p className="mb-sm text-fg-secondary text-sm">
            Zkontrolujte console pro více informací
          </p>
          <Button
            variant="secondary"
            theme="solid"
            onClick={() => window.location.reload()}
            size="sm"
          >
            Zkusit znovu
          </Button>
        </div>
      ) : ordersLoading ? (
        <div className="space-y-3xs">
          <div className="rounded-sm bg-surface">
            <div className="grid grid-cols-12 gap-sm border-border-subtle border-b p-sm">
              <SkeletonLoader className="col-span-2 h-4" />
              <SkeletonLoader className="col-span-2 h-4" />
              <SkeletonLoader className="col-span-4 h-4" />
              <SkeletonLoader className="col-span-2 h-4" />
              <SkeletonLoader className="col-span-2 h-4" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-sm border-border-subtle border-b p-sm"
              >
                <SkeletonLoader className="col-span-2 h-5" />
                <SkeletonLoader className="col-span-2 h-5" />
                <SkeletonLoader className="col-span-4 h-12" />
                <SkeletonLoader className="col-span-2 h-5" />
                <SkeletonLoader className="col-span-2 h-8" />
              </div>
            ))}
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-sm border border-border-subtle bg-surface p-2xl text-center">
          <Icon
            icon="icon-[mdi--archive-outline]"
            className="mx-auto mb-md h-16 w-16 text-fg-tertiary"
          />
          <p className="mb-xs font-medium text-fg-primary">Žádné objednávky</p>
          <p className="mb-md text-fg-secondary text-sm">
            Zatím jste nevytvořili žádnou objednávku
          </p>
          <Button
            variant="primary"
            theme="solid"
            onClick={() => router.push('/')}
            size="sm"
          >
            Začít nakupovat
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border-subtle bg-surface">
          <div className="grid grid-cols-12 gap-sm border-border-subtle border-b bg-fill-base p-sm font-medium text-fg-secondary text-xs uppercase tracking-wider">
            <div className="col-span-2">Číslo</div>
            <div className="col-span-2">Datum</div>
            <div className="col-span-4">Položky</div>
            <div className="col-span-2 text-right">Celkem</div>
            <div className="col-span-2 text-right">Akce</div>
          </div>

          {orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-12 gap-sm border-border-subtle border-b p-sm transition-colors hover:bg-fill-base"
            >
              <div className="col-span-2 flex items-center">
                <div>
                  <p className="font-medium text-fg-primary text-sm">
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
                    className="mt-3xs inline-flex"
                  >
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
              </div>

              <div className="col-span-2 flex items-center">
                <p className="text-fg-secondary text-sm">
                  {formatOrderDate(order.created_at as string)}
                </p>
              </div>

              <div className="col-span-4 flex items-center">
                <div className="flex items-center gap-xs">
                  <div className="-space-x-2 flex">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div
                        key={item.id}
                        className="relative h-fit w-10 overflow-hidden rounded-full border-2 border-base bg-fill-base"
                        style={{ zIndex: 3 - index }}
                      >
                        {item.thumbnail && (
                          <Image
                            src={item.thumbnail}
                            alt={item.product_title || ''}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                          />
                        )}
                      </div>
                    ))}
                    {order.items && order.items.length > 3 && (
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-base bg-fill-base">
                        <span className="font-medium text-fg-secondary text-xs">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-fg-primary text-sm">
                      {order.items?.[0] &&
                        order.items.length < 2 &&
                        truncateProductTitle(
                          order.items[0].product_title || ''
                        )}
                    </p>
                    <p className="text-fg-tertiary text-xs">
                      {order.items?.length || 0} položek
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-end">
                <p className="font-semibold text-fg-primary">
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
          ))}
        </div>
      )}
    </div>
  )
}
