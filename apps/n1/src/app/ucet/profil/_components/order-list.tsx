"use client"
import { Pagination } from "@techsio/ui-kit/molecules/pagination"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  ACCOUNT_ORDERS_PAGE_SIZE,
  useSuspenseOrders,
} from "@/hooks/order-hooks"
import { DesktopOrderCard } from "./orders/desktop-order-card"
import { MobileOrderCard } from "./orders/mobile-order-card"
import { OrdersEmpty } from "./orders/orders-empty"
import { OrdersError } from "./orders/orders-error"
import { OrdersSkeleton } from "./orders/orders-skeleton"
import { OrdersSummary } from "./orders/orders-summary"

const MIN_ORDERS_COUNT = 5

export function OrderList() {
  return (
    <ErrorBoundary fallback={<OrdersError />}>
      <Suspense fallback={<OrdersSkeleton itemsCount={MIN_ORDERS_COUNT} />}>
        <OrderListContent />
      </Suspense>
    </ErrorBoundary>
  )
}

function OrderListContent() {
  const [page, setPage] = useState(1)
  const { orders, totalCount } = useSuspenseOrders({
    page,
    limit: ACCOUNT_ORDERS_PAGE_SIZE,
  })

  return (
    <div className="space-y-400">
      {/* Summary section */}
      <OrdersSummary numberOfOrders={totalCount} />

      {/* Content */}
      {totalCount === 0 ? (
        <OrdersEmpty />
      ) : (
        <>
          {/* Mobile view */}
          <div className="block space-y-200 sm:hidden">
            {orders.map((order) => (
              <MobileOrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden overflow-hidden rounded border border-border-secondary bg-base sm:block">
            <div className="grid grid-cols-12 gap-300 border-border-secondary border-b bg-surface p-300 font-medium text-fg-secondary text-sm uppercase tracking-wider">
              <div className="col-span-2">Číslo</div>
              <div className="col-span-2">Datum</div>
              <div className="col-span-4">Položky</div>
              <div className="col-span-2 text-right">Celkem</div>
              <div className="col-span-2 text-right">Akce</div>
            </div>
            {orders.map((order) => (
              <DesktopOrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {totalCount > ACCOUNT_ORDERS_PAGE_SIZE && (
            <Pagination
              count={totalCount}
              onPageChange={setPage}
              page={page}
              pageSize={ACCOUNT_ORDERS_PAGE_SIZE}
              size="sm"
            />
          )}
        </>
      )}
    </div>
  )
}
