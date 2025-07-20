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
import { Image } from '@ui/atoms/image'
import { LinkButton } from '@ui/atoms/link-button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OrdersPageUI3() {
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
      <div className="min-h-screen bg-base">
        <div className="mx-auto max-w-7xl p-4">
          <SkeletonLoader className="mb-12 h-12 w-64" />
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-stroke-primary/20 py-6">
                <SkeletonLoader className="mb-2 h-6 w-48" />
                <SkeletonLoader className="h-20 w-full" />
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

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-12 border-b border-stroke-primary pb-8">
          <h1 className="mb-2 font-light text-5xl text-fg-primary">
            Objednávky
          </h1>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Icon icon="icon-[mdi--package-variant]" className="text-primary" />
              <span className="text-fg-secondary">{orders.length} celkem</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="icon-[mdi--check-circle]" className="text-success" />
              <span className="text-fg-secondary">
                {orders.filter(o => o.status === 'completed').length} dokončeno
              </span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
              <Icon icon="icon-[mdi--wifi-off]" className="h-8 w-8 text-danger" />
            </div>
            <h2 className="mb-2 font-medium text-fg-primary text-xl">
              Něco se pokazilo
            </h2>
            <p className="mb-6 text-fg-secondary-light">
              Nemůžeme načíst vaše objednávky
            </p>
            <Button
              variant="primary"
              theme="borderless"
              onClick={() => window.location.reload()}
              className="text-danger hover:bg-danger/10"
            >
              Zkusit znovu
            </Button>
          </div>
        ) : ordersLoading ? (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-stroke-primary/20 py-6">
                <SkeletonLoader className="mb-2 h-6 w-48" />
                <SkeletonLoader className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-fill-base">
              <Icon icon="icon-[mdi--receipt-text-outline]" className="h-8 w-8 text-fg-secondary" />
            </div>
            <h2 className="mb-2 font-medium text-fg-primary text-xl">
              Historie je prázdná
            </h2>
            <p className="mb-6 text-fg-secondary-light">
              Jakmile něco objednáte, zobrazí se to zde
            </p>
            <Button
              variant="primary"
              theme="solid"
              onClick={() => router.push('/')}
              className="bg-fg-primary hover:bg-fg-primary-light text-base"
            >
              Jít nakupovat
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="group border-b border-stroke-primary/20 py-6 transition-colors hover:bg-fill-base"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <span className="font-mono text-fg-secondary-light text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-medium text-fg-primary text-lg">
                        Objednávka #{order.display_id}
                      </h2>
                      <Badge 
                        className={`
                          ${order.status === 'completed' 
                            ? 'border-success text-success' 
                            : order.status === 'pending'
                            ? 'border-warning text-warning'
                            : 'border-info text-info'
                          } 
                          border bg-transparent
                        `}
                      >
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="text-fg-secondary-light text-sm">
                      {formatOrderDate(order.created_at as string)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-light text-3xl text-fg-primary">
                      {formatPrice(
                        order.summary?.current_order_total || order.total || 0,
                        order.currency_code
                      )}
                    </p>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {order.items?.slice(0, 5).map((item) => (
                      <div key={item.id} className="group/item">
                        <div className="relative h-12 w-12 overflow-hidden rounded bg-fill-base">
                          {item.thumbnail ? (
                            <Image
                              src={item.thumbnail}
                              alt={item.product_title || ''}
                              className="h-full w-full object-cover transition-transform group-hover/item:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Icon icon="icon-[mdi--image]" className="h-6 w-6 text-fg-secondary-light" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.items && order.items.length > 5 && (
                      <span className="text-fg-secondary-light text-sm">
                        +{order.items.length - 5}
                      </span>
                    )}
                  </div>

                  <LinkButton
                    as={Link}
                    prefetch={true}
                    href={`/account/orders/${order.id}`}
                    variant="secondary"
                    theme="borderless"
                    size="sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Zobrazit vše
                    <Icon icon="icon-[mdi--chevron-right]" className="ml-1" />
                  </LinkButton>
                </div>

                <div className="flex items-center gap-4 text-fg-secondary-light text-sm">
                  <span className="flex items-center gap-1">
                    <Icon icon="icon-[mdi--cube-outline]" className="h-4 w-4" />
                    {order.items?.length || 0} položek
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="icon-[mdi--truck-outline]" className="h-4 w-4" />
                    {order.shipping_address?.city || 'Město není uvedeno'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="icon-[mdi--credit-card-outline]" className="h-4 w-4" />
                    {order.payment_status === 'captured' ? 'Zaplaceno' : 'Čeká na platbu'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}