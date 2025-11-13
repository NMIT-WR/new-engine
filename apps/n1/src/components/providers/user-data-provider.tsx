'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRegion } from '@/hooks/use-region'
import { cacheConfig } from '@/lib/cache-config'
import { clearGuestCartId, getGuestCartId } from '@/lib/guest-cart-utils'
import { queryKeys } from '@/lib/query-keys'
import { getAddresses } from '@/services/customer-service'
import { getCart, mergeGuestCart } from '@/services/cart-service'
import { getOrders } from '@/services/order-service'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

/**
 * UserDataProvider
 *
 * Automatically prefetches user data when authenticated:
 * - Merges guest cart if exists (before prefetch)
 * - Order history (realtime: 30s stale, 5min persist)
 * - Active cart (realtime: 30s stale, 5min persist)
 * - Customer addresses (realtime: 30s stale, 5min persist)
 *
 * Benefits:
 * - Components using useOrders(), useCart(), useAddresses() get instant data
 * - Centralized prefetch logic
 * - Automatic cart merge on login
 * - Consistent cache strategy with hooks
 *
 * Usage:
 * Wrap app in root layout:
 * <UserDataProvider>
 *   <App />
 * </UserDataProvider>
 */
export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, customer } = useAuth()
  const { regionId } = useRegion()
  const queryClient = useQueryClient()
  const hasMergedRef = useRef(false)

  useEffect(() => {
    async function handleAuthentication() {
      if (!isAuthenticated || !customer || !regionId) return

      // Check for guest cart to merge (only once per session)
      if (!hasMergedRef.current) {
        const guestCartId = getGuestCartId()

        if (guestCartId) {
          // Merge guest cart into customer cart
          await mergeGuestCart(guestCartId, regionId)
          clearGuestCartId()
          hasMergedRef.current = true
        }
      }

      // Prefetch orders (background, won't block rendering)
      queryClient.prefetchQuery({
        queryKey: queryKeys.orders.list(),
        queryFn: () => getOrders(),
        ...cacheConfig.realtime, // 30s stale, refetch on focus
      })

      // Prefetch cart (most frequently updated, now includes merged items)
      queryClient.prefetchQuery({
        queryKey: queryKeys.cart.active(),
        queryFn: () => getCart(),
        ...cacheConfig.realtime, // 30s stale, refetch on focus
      })

      // Prefetch addresses
      queryClient.prefetchQuery({
        queryKey: queryKeys.customer.addresses(customer.id),
        queryFn: () => getAddresses(),
        ...cacheConfig.realtime, // 30s stale, refetch on focus
      })
    }

    handleAuthentication()
  }, [isAuthenticated, customer, regionId, queryClient])

  // Provider is purely for side effects, renders children as-is
  return <>{children}</>
}
