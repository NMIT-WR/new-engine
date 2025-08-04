import { sdk } from '@/lib/medusa-client'
import { ORDER_FIELDS } from '@/lib/order-utils'
import { queryKeys } from '@/lib/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useOrders(userId?: string) {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: async () => {
      const response = await sdk.store.order.list({
        fields: ORDER_FIELDS.join(','),
      })
      return response
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}