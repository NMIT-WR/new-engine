'use client'
import { AccountLayout } from '@/components/templates/account-layout'
import { useAuth } from '@/hooks/use-auth'
import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@ui/atoms/button'
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
      const response = await sdk.store.order.list()
      return response
    },
    enabled: !!user,
  })

  if (!isInitialized || authLoading) {
    return (
      <AccountLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
            <p className="text-fg-secondary">Načítání...</p>
          </div>
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
          <div className="text-center">
            <p className="text-lg">Načítání objednávek...</p>
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
                    <h2 className="font-account-subtitle text-account-subtitle-fg text-account-subtitle-size">
                      Objednávka z{' '}
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('cs-CZ')
                        : 'Neznámé datum'}
                    </h2>
                    <p className="text-account-label-fg text-sm">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-account-value-fg">
                      {order.total ? order.total.toFixed(0) : '0.00'}{' '}
                      {order.currency_code?.toUpperCase()}
                    </p>
                    <p className="text-account-label-fg text-sm">
                      Stav: {order.status}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="mb-2 text-account-label-fg text-sm">Položky:</p>
                  <ul className="space-y-2">
                    {order.items?.map((item) => (
                      <li
                        key={item.id}
                        className="text-account-value-fg text-sm"
                      >
                        {item.title} - {item.quantity}x
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
