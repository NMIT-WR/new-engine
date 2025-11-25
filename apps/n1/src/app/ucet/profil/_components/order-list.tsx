'use client'

import { useOrders } from '@/hooks/use-orders'

export function OrderList() {
  const { data, isLoading } = useOrders()

  if (isLoading) {
    return <div className="text-fg-muted">Načítám objednávky...</div>
  }

  const orders = data?.orders || []

  if (orders.length === 0) {
    return (
      <div className="py-lg text-center text-fg-muted">
        Zatím nemáte žádné objednávky.
      </div>
    )
  }

  return (
    <div className="space-y-md">
      <h3 className="font-semibold text-heading-sm">Historie objednávek</h3>
      <div className="space-y-sm">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded border border-border p-md"
          >
            <div>
              <div className="font-medium">Objednávka #{order.display_id}</div>
              <div className="text-body-sm text-fg-muted">
                {new Date(order.created_at).toLocaleDateString('cs-CZ')} •{' '}
                {order.status} • {order.payment_status}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {(order.total / 100).toLocaleString('cs-CZ', {
                  style: 'currency',
                  currency: order.currency_code.toUpperCase(),
                })}
              </div>
              {/* Future: Add link to detail */}
              {/* <Button variant="link" size="sm" className="px-0">
                Detail
              </Button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
