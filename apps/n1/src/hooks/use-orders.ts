import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getOrderById, getOrders } from '@/services/order-service'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useAuth, useSuspenseAuth } from './use-auth'

export interface UseOrdersOptions {
  limit?: number
  offset?: number
}

function useOrders(options?: UseOrdersOptions) {
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

function useOrder(orderId: string | null) {
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

export function useSuspenseOrders(options?: UseOrdersOptions) {
  const { isAuthenticated } = useSuspenseAuth()
  const limit = options?.limit || 20
  const offset = options?.offset || 0

  if (!isAuthenticated) {
    throw new Error('Uživatel není přihlášen')
  }

  return useSuspenseQuery({
    queryKey: queryKeys.orders.list({ limit, offset }),
    queryFn: () => getOrders({ limit, offset }),
    ...cacheConfig.userData,
  })
}

export function useSuspenseOrder(orderId: string | null) {
  const { isAuthenticated } = useSuspenseAuth()

  if (!isAuthenticated) {
    throw new Error('Uživatel není přihlášen')
  }

  if (!orderId) {
    throw new Error('Order ID je povinné')
  }

  return useSuspenseQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => getOrderById(orderId),
    ...cacheConfig.userData,
  })
}
