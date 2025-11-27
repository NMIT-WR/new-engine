'use client'

import { SkeletonLoader } from '@/app/ucet/objednavky/[id]/_components/skeleton-loader'
import {
  formatOrderDate,
  formatPrice,
  getOrderStatusLabel,
  getOrderStatusVariant,
} from '@/app/ucet/profil/_components/orders/order-utils'
import { useAuth } from '@/hooks/use-auth'
import { useOrder } from '@/hooks/use-orders'
import { Badge } from '@techsio/ui-kit/atoms/badge'
import { Button } from '@techsio/ui-kit/atoms/button'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import { ItemCard } from '../../profil/_components/orders/item-card'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const { customer, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated && !customer) {
      router.push('/prihlaseni')
    }
  }, [isAuthenticated, customer, router])

  const { data: order, isLoading: orderLoading, error } = useOrder(id)

  // Auth loading state
  if (!isAuthenticated || authLoading) {
    return (
      <div className="mx-auto max-w-max-w px-400 py-600">
        <div className="space-y-400">
          <SkeletonLoader className="h-500 w-4xl" />
          <div className="grid gap-400">
            <SkeletonLoader className="h-[160px] w-full" />
            <SkeletonLoader className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!customer) {
    return null
  }

  const statusVariant = getOrderStatusVariant(order?.status || 'pending')

  return (
    <div className="mx-auto max-w-max-w px-400">
      <div className="mb-500">
        {order && (
          <div className="flex flex-col gap-200 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-bold text-fg-primary text-xl">
                Objednávka #{order.display_id}
              </h1>
              <p className="text-fg-secondary">
                {formatOrderDate({
                  dateString: order.created_at as string,
                  monthType: 'long',
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-200">
              <Badge variant={statusVariant}>
                {getOrderStatusLabel(order.status)}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {error ? (
        <div className="rounded border border-danger bg-danger-light p-600 text-center">
          <p className="mb-200 font-semibold text-danger">
            Chyba při načítání objednávky
          </p>
          <p className="mb-400 text-fg-secondary">
            Objednávka nebyla nalezena nebo k ní nemáte přístup
          </p>
          <Button
            variant="secondary"
            theme="solid"
            onClick={() => router.push('/ucet/profil')}
          >
            Zpět na seznam objednávek
          </Button>
        </div>
      ) : orderLoading || !order ? (
        <div className="w-max-w max-w-full space-y-400">
          <SkeletonLoader className="h-[160px] w-full" />
          <SkeletonLoader className="h-[400px] w-full" />
        </div>
      ) : (
        <div className="space-y-500">
          {/* Products Grid */}
          <div>
            <h2 className="mb-300 font-bold text-fg-primary text-lg">
              Objednané produkty
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-300 sm:grid-cols-3 xl:grid-cols-4">
              {order.items?.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  currency_code={order.currency_code}
                />
              ))}
            </div>
          </div>

          {/* Bottom Info Cards */}
          <div className="grid gap-400 md:grid-cols-2">
            {/* Payment Summary */}
            <div className="rounded border border-border-secondary bg-surface-light p-400">
              <h3 className="mb-300 font-semibold text-fg-primary text-lg">
                Platební přehled
              </h3>
              <div className="space-y-200">
                <div className="flex justify-between">
                  <span className="text-fg-secondary">Mezisoučet</span>
                  <span className="font-medium text-fg-primary">
                    {formatPrice(
                      order.items?.reduce(
                        (sum, item) => sum + (item.subtotal || 0),
                        0
                      ) || 0,
                      order.currency_code
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-secondary">DPH</span>
                  <span className="font-medium text-fg-primary">
                    {formatPrice(
                      order.items?.reduce(
                        (sum, item) => sum + (item.tax_total || 0),
                        0
                      ) || 0,
                      order.currency_code
                    )}
                  </span>
                </div>
                {order.shipping_methods?.[0] && (
                  <div className="flex justify-between">
                    <span className="text-fg-secondary">
                      Doprava ({order.shipping_methods[0].name})
                    </span>
                    <span className="font-medium text-fg-primary">
                      {formatPrice(
                        order.shipping_methods[0].total || 0,
                        order.currency_code
                      )}
                    </span>
                  </div>
                )}
                <div className="border-border-secondary border-t pt-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-fg-primary text-lg">
                      Celkem
                    </span>
                    <span className="font-bold text-fg-primary text-lg">
                      {formatPrice(
                        order.summary?.original_order_total || order.total || 0,
                        order.currency_code
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="rounded border border-border-secondary bg-surface-light p-400">
              <h3 className="mb-300 font-semibold text-fg-primary text-lg">
                Detaily objednávky
              </h3>
              <div className="space-y-200">
                <div>
                  <p className="text-fg-tertiary text-sm">ID objednávky</p>
                  <p className="font-mono text-fg-primary text-sm">
                    {order.id}
                  </p>
                </div>
                <div>
                  <p className="text-fg-tertiary text-sm">Vytvořeno</p>
                  <p className="font-medium text-fg-primary">
                    {new Date(order.created_at).toLocaleString('cs-CZ')}
                  </p>
                </div>
                {order.updated_at && (
                  <div>
                    <p className="text-fg-tertiary text-sm">
                      Poslední aktualizace
                    </p>
                    <p className="font-medium text-fg-primary">
                      {new Date(order.updated_at).toLocaleString('cs-CZ')}
                    </p>
                  </div>
                )}
                {order.email && (
                  <div>
                    <p className="text-fg-tertiary text-sm">E-mail</p>
                    <p className="font-medium text-fg-primary">{order.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
