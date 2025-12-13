import { cacheConfig } from '@/lib/cache-config'
import { AddressValidationError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import {
  type CreateAddressData,
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from '@/services/customer-service'
import type { AddressFormData } from '@/utils/address-validation'
import { validateAddressForm } from '@/utils/address-validation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export function useAddresses() {
  const { customer } = useAuth()

  return useQuery({
    queryKey: queryKeys.customer.profile(),
    queryFn: getAddresses,
    enabled: !!customer,
    ...cacheConfig.userData,
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAddressData) => {
      // Safety net validation before API call
      const errors = validateAddressForm(data as AddressFormData)
      if (Object.keys(errors).length > 0) {
        throw new AddressValidationError(errors)
      }
      return await createAddress(data)
    },
    onSuccess: () => {
      // Invalidate addresses cache to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.profile(),
      })
    },
  })
}

/**
 * Check if data contains enough fields to be considered complete address data
 * (used to decide whether to validate before API call)
 */
function isCompleteAddressData(data: Partial<CreateAddressData>): boolean {
  return 'first_name' in data && 'last_name' in data && 'address_1' in data
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      addressId,
      data,
    }: { addressId: string; data: Partial<CreateAddressData> }) => {
      // Safety net validation (only for complete address data, not partial updates)
      if (isCompleteAddressData(data)) {
        const errors = validateAddressForm(data as AddressFormData)
        if (Object.keys(errors).length > 0) {
          throw new AddressValidationError(errors)
        }
      }
      return await updateAddress(addressId, data)
    },
    onSuccess: () => {
      // Invalidate addresses cache to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.profile(),
      })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      // Invalidate addresses cache to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer.profile(),
      })
    },
  })
}
