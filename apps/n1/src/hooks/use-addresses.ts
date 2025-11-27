import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import {
  type CreateAddressData,
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from '@/services/customer-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export function useAddresses() {
  const { customer } = useAuth()

  return useQuery({
    queryKey: queryKeys.customer.addresses(customer?.id),
    queryFn: getAddresses,
    enabled: !!customer,
    ...cacheConfig.userData,
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  const { customer } = useAuth()

  return useMutation({
    mutationFn: (data: CreateAddressData) => createAddress(data),
    onSuccess: () => {
      // Invalidate addresses cache to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.addresses(customer?.id),
      })
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  const { customer } = useAuth()

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: { addressId: string; data: Partial<CreateAddressData> }) =>
      updateAddress(addressId, data),
    onSuccess: () => {
      // Invalidate addresses cache to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.addresses(customer?.id),
      })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  const { customer } = useAuth()

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      // Invalidate addresses cache to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.addresses(customer?.id),
      })
    },
  })
}
