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

export default function OrdersPageUI2() {
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
      <div className="bg-overlay min-h-screen p-6">
        <div className="mx-auto max-w-6xl">
          <SkeletonLoader className="mb-8 h-10 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-base rounded-lg p-6 shadow-md">
                <SkeletonLoader className="mb-4 h-6 w-32" />
                <SkeletonLoader className="h-32 w-full" />
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
    <div className="bg-overlay min-h-screen">
      <div className="bg-base border-b border-stroke-primary">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-3xl text-fg-primary">Historie objednávek</h1>
              <p className="mt-1 text-fg-secondary-light">
                Celkem objednávek: {orders.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                theme="borderless"
                className="text-fg-secondary hover:text-fg-primary"
              >
                <Icon icon="icon-[mdi--filter-outline]" className="mr-2" />
                Filtrovat
              </Button>
              <Button
                variant="secondary"
                theme="borderless"
                className="text-fg-secondary hover:text-fg-primary"
              >
                <Icon icon="icon-[mdi--sort]" className="mr-2" />
                Seřadit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6">
        {error ? (
          <div className="bg-danger-light rounded-lg p-8 text-center">
            <Icon icon="icon-[mdi--cloud-off-outline]" className="mx-auto mb-4 h-12 w-12 text-danger" />
            <p className="mb-2 font-semibold text-danger">
              Nepodařilo se načíst objednávky
            </p>
            <p className="mb-4 text-fg-secondary text-sm">
              Zkontrolujte připojení k internetu
            </p>
            <Button
              variant="secondary"
              theme="solid"
              onClick={() => window.location.reload()}
              className="text-danger hover:bg-danger hover:text-fg-reverse"
            >
              Obnovit stránku
            </Button>
          </div>
        ) : ordersLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-base rounded-lg p-6 shadow-md">
                <SkeletonLoader className="mb-4 h-6 w-32" />
                <SkeletonLoader className="h-32 w-full" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-base rounded-lg p-12 text-center shadow-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-tertiary-light">
              <Icon icon="icon-[mdi--package-variant]" className="h-10 w-10 text-tertiary" />
            </div>
            <h2 className="mb-2 font-semibold text-fg-primary text-xl">
              Žádné objednávky
            </h2>
            <p className="mb-6 text-fg-secondary">
              Vypadá to, že jste ještě nic neobjednali
            </p>
            <Button
              variant="primary"
              theme="solid"
              onClick={() => router.push('/')}
              className="bg-tertiary hover:bg-tertiary-hover"
            >
              Prozkoumat produkty
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-base group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-fg-secondary text-sm">
                      #{order.display_id}
                    </span>
                    <Badge 
                      className={
                        order.status === 'completed' 
                          ? 'bg-success-light text-success' 
                          : 'bg-warning-light text-warning'
                      }
                    >
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="font-bold text-2xl text-fg-primary">
                      {formatPrice(
                        order.summary?.current_order_total || order.total || 0,
                        order.currency_code
                      )}
                    </p>
                    <p className="text-fg-secondary-light text-xs">
                      {formatOrderDate(order.created_at as string)}
                    </p>
                  </div>

                  <div className="mb-4 flex -space-x-2">
                    {order.items?.slice(0, 4).map((item, index) => (
                      <div
                        key={item.id}
                        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-base bg-fill-base"
                        style={{ zIndex: 4 - index }}
                      >
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.product_title || ''}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-fill-hover">
                            <Icon icon="icon-[mdi--cube-outline]" className="h-4 w-4 text-fg-secondary-light" />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items && order.items.length > 4 && (
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-base bg-fill-active">
                        <span className="text-fg-secondary text-xs">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mb-4 text-fg-secondary text-sm">
                    {order.items?.length || 0} položek
                  </p>

                  <LinkButton
                    as={Link}
                    prefetch={true}
                    href={`/account/orders/${order.id}`}
                    className="w-full justify-center bg-fg-primary text-base hover:bg-fg-primary-light"
                    size="sm"
                  >
                    Zobrazit detail
                  </LinkButton>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}