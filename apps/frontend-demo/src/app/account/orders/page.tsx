'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { AccountLayout } from '@/components/templates/account-layout'
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
import { Image } from '@ui/atoms/image'
import { LinkButton } from '@ui/atoms/link-button'
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
      <AccountLayout>
        <div className="space-y-4">
          <SkeletonLoader className="h-8 w-48" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card"
            >
              <div className="flex gap-4">
                <SkeletonLoader className="h-20 w-20" />
                <div className="flex-1 space-y-2">
                  <SkeletonLoader className="h-4 w-32" />
                  <SkeletonLoader className="h-6 w-48" />
                  <SkeletonLoader className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AccountLayout>
    )
  }

  if (!user) {
    return null
  }

  const orders = ordersData?.orders || []

  return (
    <AccountLayout>
      <div>
        <h1 className="mb-8 font-semibold text-2xl">Tvé objednávky</h1>

        {error ? (
          <div className="rounded-account-card bg-account-card-bg p-account-card-p text-center shadow-account-card">
            <p className="mb-4 text-red-600">Chyba při načítání objednávek</p>
            <p className="mb-4 text-account-label-fg text-sm">
              Zkontrolujte console pro více informací
            </p>
            <Button
              variant="secondary"
              theme="solid"
              onClick={() => window.location.reload()}
            >
              Zkusit znovu
            </Button>
          </div>
        ) : ordersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card"
              >
                <div className="flex gap-4">
                  <SkeletonLoader className="h-20 w-20" />
                  <div className="flex-1 space-y-2">
                    <SkeletonLoader className="h-4 w-32" />
                    <SkeletonLoader className="h-6 w-48" />
                    <SkeletonLoader className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-account-card bg-account-card-bg p-account-card-p text-center shadow-account-card">
            <p className="mb-4 text-account-value-fg">
              Zatím nemáte žádné objednávky
            </p>
            <Button
              variant="primary"
              theme="solid"
              onClick={() => router.push('/')}
            >
              Začít nakupovat
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="mb-1 font-account-subtitle text-account-subtitle-fg text-account-subtitle-size">
                      Objednávka č. {order.display_id}
                    </h2>
                    <p className="text-account-label-fg text-sm">
                      {formatOrderDate(order.created_at as string)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-2 font-semibold text-account-value-fg">
                      {formatPrice(
                        order.summary?.current_order_total || order.total || 0,
                        order.currency_code
                      )}
                    </p>
                    <Badge>{getOrderStatusLabel(order.status)}</Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    {order.items?.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                          {item.thumbnail ? (
                            <Image
                              src={item.thumbnail}
                              alt={item.product_title || ''}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <span className="text-gray-400 text-xs">
                                Bez obrázku
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.product_handle}`}
                            className="font-medium text-account-link-fg text-sm hover:text-primary"
                          >
                            {truncateProductTitle(item.product_title || '')}
                          </Link>
                          <p className="text-account-label-fg text-xs">
                            {item.variant_title} • {item.quantity}x
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items && order.items.length > 3 && (
                      <p className="text-account-label-fg text-xs">
                        +{order.items.length - 3} dalších položek
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <LinkButton
                      as={Link}
                      prefetch={true}
                      href={`/account/orders/${order.id}`}
                      size="sm"
                    >
                      Detail objednávky
                    </LinkButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
