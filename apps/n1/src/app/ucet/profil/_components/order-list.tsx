'use client'
import {
  DesktopOrderCard,
  MobileOrderCard,
  OrdersEmpty,
  OrdersError,
  OrdersSkeleton,
  OrdersSummary,
  OrdersTableHeader,
} from '@/app/ucet/profil/_components/orders'
import { useOrders } from '@/hooks/use-orders'
import { Pagination } from '@techsio/ui-kit/molecules/pagination'
import { useState } from 'react'

const MIN_ORDERS_COUNT = 5
const PAGE_SIZE = 5

export function OrderList() {
  const [page, setPage] = useState(1)
  const { data: ordersData, isLoading: ordersLoading, error } = useOrders()

  const orders = ordersData?.orders || []

  // Calculate summary stats (from all orders, not just current page)
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

  // Pagination
  const startIndex = (page - 1) * PAGE_SIZE
  const paginatedOrders = orders.slice(startIndex, startIndex + PAGE_SIZE)

  // Loading state
  if (ordersLoading) {
    return <OrdersSkeleton itemsCount={orders.length || MIN_ORDERS_COUNT} />
  }

  return (
    <div className="space-y-400">
      {/* Summary section */}
      <OrdersSummary
        totalAmount={totalAmount}
        completedOrders={completedOrders}
        pendingOrders={pendingOrders}
        numberOfOrders={orders.length}
      />

      {/* Content */}
      {error ? (
        <OrdersError />
      ) : orders.length === 0 ? (
        <OrdersEmpty />
      ) : (
        <>
          {/* Mobile view */}
          <div className="block space-y-200 sm:hidden">
            {paginatedOrders.map((order) => (
              <MobileOrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden overflow-hidden rounded border border-border-secondary bg-base sm:block">
            <OrdersTableHeader />
            {paginatedOrders.map((order) => (
              <DesktopOrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {orders.length > PAGE_SIZE && (
            <Pagination
              count={orders.length}
              pageSize={PAGE_SIZE}
              page={page}
              onPageChange={setPage}
              size="sm"
            />
          )}
        </>
      )}
    </div>
  )
}
