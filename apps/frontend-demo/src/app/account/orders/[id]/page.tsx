'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { AccountLayout } from '@/components/templates/account-layout'
import { useAuth } from '@/hooks/use-auth'
import { formatPrice } from '@/lib/format-price'
import { sdk } from '@/lib/medusa-client'
import {
  ORDER_FIELDS,
  formatOrderDate,
  getFulfillmentStatusLabel,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  truncateProductTitle,
} from '@/lib/order-utils'
import { queryKeys } from '@/lib/query-keys'
import type { Order } from '@/types/order'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Badge } from '@ui/atoms/badge'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import { Image } from '@ui/atoms/image'
import { LinkButton } from '@ui/atoms/link-button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const { user, isLoading: authLoading, isInitialized } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/auth/login')
    }
  }, [user, isInitialized, router])

  const {
    data: orderData,
    isLoading: orderLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const cachedOrdersList = queryClient.getQueryData<{ orders: Order[] }>(
        queryKeys.orders.list()
      )
      const cachedOrder = cachedOrdersList?.orders?.find((o) => o.id === id)

      if (cachedOrder) {
        const response = await sdk.store.order.retrieve(id, {
          fields: ORDER_FIELDS.join(','),
        })
        return response
      }

      const response = await sdk.store.order.retrieve(id, {
        fields: ORDER_FIELDS.join(','),
      })
      return response
    },
    enabled: !!user && !!id,
    staleTime: 5 * 60 * 1000,
  })

  if (!isInitialized || authLoading) {
    return (
      <AccountLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <SkeletonLoader className="h-6 w-6" />
            <SkeletonLoader className="h-8 w-64" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <SkeletonLoader className="h-48 w-full" />
              <SkeletonLoader className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <SkeletonLoader className="h-32 w-full" />
              <SkeletonLoader className="h-48 w-full" />
            </div>
          </div>
        </div>
      </AccountLayout>
    )
  }

  if (!user) {
    return null
  }

  const order = orderData?.order

  return (
    <AccountLayout>
      <div>
        <div className="mb-6 flex items-center gap-4">
          <LinkButton
            href="/account/orders"
            variant="secondary"
            theme="borderless"
            size="sm"
            className="gap-2"
          >
            <Icon icon="token-icon-arrow-left" className="h-4 w-4" />
            Zpět na objednávky
          </LinkButton>
        </div>

        {error ? (
          <div className="rounded-account-card bg-account-card-bg p-account-card-p text-center shadow-account-card">
            <p className="mb-4 text-red-600">Chyba při načítání objednávky</p>
            <p className="mb-4 text-account-label-fg text-sm">
              Objednávka nebyla nalezena nebo k ní nemáte přístup
            </p>
            <Button
              variant="secondary"
              theme="solid"
              onClick={() => router.push('/account/orders')}
            >
              Zpět na seznam objednávek
            </Button>
          </div>
        ) : orderLoading || !order ? (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <SkeletonLoader className="h-48 w-full" />
                <SkeletonLoader className="h-96 w-full" />
              </div>
              <div className="space-y-6">
                <SkeletonLoader className="h-32 w-full" />
                <SkeletonLoader className="h-48 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="mb-2 font-semibold text-2xl">
                Objednávka č. {order.display_id}
              </h1>
              <p className="text-account-label-fg">
                {formatOrderDate(order.created_at as string)}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main content */}
              <div className="space-y-6 lg:col-span-2">
                {/* Order status */}
                <div className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card">
                  <h2 className="mb-4 font-semibold text-lg">
                    Stav objednávky
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="mb-1 text-account-label-fg text-sm">
                        Stav objednávky
                      </p>
                      <Badge>{getOrderStatusLabel(order.status)}</Badge>
                    </div>
                    <div>
                      <p className="mb-1 text-account-label-fg text-sm">
                        Stav platby
                      </p>
                      <p className="font-medium text-account-value-fg">
                        {getPaymentStatusLabel(order.payment_status)}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-account-label-fg text-sm">
                        Stav doručení
                      </p>
                      <p className="font-medium text-account-value-fg">
                        {getFulfillmentStatusLabel(order.fulfillment_status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card">
                  <h2 className="mb-4 font-semibold text-lg">
                    Položky objednávky
                  </h2>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
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
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/products/${item.product_handle}`}
                              className="font-medium text-account-link-fg text-sm hover:text-primary"
                            >
                              {truncateProductTitle(item.product_title || '')}
                            </Link>
                            <p className="text-account-label-fg text-sm">
                              ({item.variant_title})
                            </p>
                          </div>

                          <p className="mt-2 text-account-label-fg text-sm">
                            Množství: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-account-label-fg text-sm">
                            {formatPrice(item.unit_price, order.currency_code)}{' '}
                            / ks
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Order info */}
                <div className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card">
                  <h2 className="mb-4 font-semibold text-lg">Informace</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-account-label-fg text-sm">
                        ID objednávky
                      </p>
                      <p className="font-mono text-account-value-fg text-xs">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-account-label-fg text-sm">Vytvořeno</p>
                      <p className="text-account-value-fg">
                        {new Date(order.created_at).toLocaleString('cs-CZ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-account-label-fg text-sm">
                        Naposledy upraveno
                      </p>
                      <p className="text-account-value-fg">
                        {new Date(order.updated_at).toLocaleString('cs-CZ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Order summary */}
                <div className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card">
                  <h2 className="mb-4 font-semibold text-lg">
                    Souhrn objednávky
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-account-label-fg">Mezisoučet</span>
                      <span className="text-account-value-fg">
                        {formatPrice(
                          order.items?.reduce(
                            (sum, item) => sum + item.subtotal,
                            0
                          ) || 0,
                          order.currency_code
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-account-label-fg">DPH</span>
                      <span className="text-account-value-fg">
                        {formatPrice(
                          order.items?.reduce(
                            (sum, item) => sum + item.tax_total,
                            0
                          ) || 0,
                          order.currency_code
                        )}
                      </span>
                    </div>
                    {order.shipping_methods &&
                      order.shipping_methods.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-account-label-fg">
                            Doprava ({order.shipping_methods[0].name})
                          </span>
                          <span className="text-account-value-fg">
                            {formatPrice(
                              order.shipping_methods[0].total || 0,
                              order.currency_code
                            )}
                          </span>
                        </div>
                      )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-account-value-fg">
                          Celkem
                        </span>
                        <span className="font-semibold text-account-value-fg text-lg">
                          {formatPrice(
                            order.summary?.current_order_total ||
                              order.total ||
                              0,
                            order.currency_code
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
