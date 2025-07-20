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

export default function OrdersPageUI1() {
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
      <div className="min-h-screen bg-base p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <SkeletonLoader className="h-12 w-64" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-surface p-8 shadow-lg">
              <SkeletonLoader className="mb-4 h-6 w-48" />
              <SkeletonLoader className="h-24 w-full" />
            </div>
          ))}
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
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-bold text-4xl text-fg-primary">Moje objednávky</h1>
          <p className="mt-2 text-fg-secondary">
            Zde najdete přehled všech vašich objednávek
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-8 py-12">
        {error ? (
          <div className="rounded-2xl bg-danger/10 p-8 text-center">
            <Icon icon="icon-[mdi--alert-circle]" className="mx-auto mb-4 h-16 w-16 text-danger" />
            <p className="mb-4 font-semibold text-danger text-xl">
              Chyba při načítání objednávek
            </p>
            <Button
              variant="primary"
              theme="solid"
              onClick={() => window.location.reload()}
              className="bg-danger hover:bg-danger-hover"
            >
              Zkusit znovu
            </Button>
          </div>
        ) : ordersLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-surface p-8 shadow-lg">
                <SkeletonLoader className="mb-4 h-6 w-48" />
                <SkeletonLoader className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-surface p-16 text-center shadow-lg">
            <Icon icon="icon-[mdi--shopping-outline]" className="mx-auto mb-6 h-24 w-24 text-primary" />
            <h2 className="mb-4 font-semibold text-2xl text-fg-primary">
              Zatím nemáte žádné objednávky
            </h2>
            <p className="mb-8 text-fg-secondary">
              Začněte nakupovat a vaše objednávky se zde zobrazí
            </p>
            <Button
              variant="primary"
              theme="solid"
              onClick={() => router.push('/')}
              className="bg-primary hover:bg-primary-hover"
            >
              Začít nakupovat
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group rounded-2xl bg-surface p-8 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="mb-1 font-semibold text-fg-primary text-xl">
                      Objednávka #{order.display_id}
                    </h2>
                    <p className="text-fg-secondary-light text-sm">
                      {formatOrderDate(order.created_at as string)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-2 font-bold text-2xl text-primary">
                      {formatPrice(
                        order.summary?.current_order_total || order.total || 0,
                        order.currency_code
                      )}
                    </p>
                    <Badge className="bg-primary/10 text-primary">
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 border-t border-stroke-primary/30 pt-6">
                  {order.items?.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-fill-base">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.product_title || ''}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Icon icon="icon-[mdi--image-outline]" className="h-8 w-8 text-fg-secondary-light" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product_handle}`}
                          className="font-medium text-fg-primary hover:text-primary"
                        >
                          {truncateProductTitle(item.product_title || '')}
                        </Link>
                        <p className="text-fg-secondary-light text-sm">
                          {item.variant_title} • Množství: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <p className="text-center text-fg-secondary-light text-sm">
                      + {order.items.length - 3} dalších položek
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <LinkButton
                    as={Link}
                    prefetch={true}
                    href={`/account/orders/${order.id}`}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    <Icon icon="icon-[mdi--arrow-right]" className="mr-2" />
                    Detail objednávky
                  </LinkButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}