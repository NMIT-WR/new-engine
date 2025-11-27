import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getOrderById, getOrders } from '@/services/order-service'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export interface UseOrdersOptions {
  limit?: number
  offset?: number
}

export function useOrders(options?: UseOrdersOptions) {
  const { isAuthenticated } = useAuth()
  const limit = options?.limit || 20
  const offset = options?.offset || 0

  return useQuery({
    queryKey: queryKeys.orders.list({ limit, offset }),
    queryFn: () => getOrders({ limit, offset }),
    enabled: isAuthenticated,
    ...cacheConfig.userData,
  })
}

export function useOrder(orderId: string | null) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.orders.detail(orderId || ''),
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order ID je povinné')
      }
      return getOrderById(orderId)
    },
    enabled: isAuthenticated && !!orderId,
    ...cacheConfig.userData,
  })
}
