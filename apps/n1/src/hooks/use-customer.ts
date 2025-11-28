import { queryKeys } from '@/lib/query-keys'
import {
  type UpdateCustomerData,
  updateCustomer,
} from '@/services/customer-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  const { customer } = useAuth()

  return useMutation({
    mutationFn: (data: UpdateCustomerData) => updateCustomer(data),
    onSuccess: () => {
      // Invalidate customer cache to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.profile(),
      })
    },
  })
}
