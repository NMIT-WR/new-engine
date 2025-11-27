'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRegion } from '@/hooks/use-region'
import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getCart } from '@/services/cart-service'
import { getAddresses } from '@/services/customer-service'
import { getOrders } from '@/services/order-service'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, customer } = useAuth()
  const { regionId } = useRegion()
  const queryClient = useQueryClient()

  useEffect(() => {
    async function handleAuthentication() {
      if (!isAuthenticated || !customer || !regionId) return

      queryClient.prefetchQuery({
        queryKey: queryKeys.orders.list({ limit: 10, offset: 0 }),
        queryFn: () => getOrders({ limit: 10 }),
        ...cacheConfig.userData, // 5min stale, user data
      })

      // Prefetch cart (most frequently updated)
      queryClient.prefetchQuery({
        queryKey: queryKeys.cart.active(),
        queryFn: () => getCart(),
        ...cacheConfig.realtime, // 30s stale, refetch on focus
      })

      // Prefetch addresses
      queryClient.prefetchQuery({
        queryKey: queryKeys.customer.addresses(customer.id),
        queryFn: () => getAddresses(),
        ...cacheConfig.userData, // 5min stale, user data
      })
    }

    handleAuthentication()
  }, [isAuthenticated, customer, regionId, queryClient])

  return <>{children}</>
}
