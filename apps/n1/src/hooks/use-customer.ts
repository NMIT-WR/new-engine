import { queryKeys } from '@/lib/query-keys'
import {
  type UpdateCustomerData,
  updateCustomer,
} from '@/services/customer-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

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
