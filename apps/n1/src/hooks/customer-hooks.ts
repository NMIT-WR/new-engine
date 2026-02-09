import type { StoreCustomer, StoreCustomerAddress } from "@medusajs/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCustomerHooks } from "@techsio/storefront-data"
import { AddressValidationError } from "@/lib/errors"
import { queryKeys } from "@/lib/query-keys"
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  updateCustomer,
  type CreateAddressData,
  type UpdateCustomerData,
} from "@/services/customer-service"
import type { AddressFormData } from "@/utils/address-validation"
import { validateAddressForm } from "@/utils/address-validation"
import { cleanPhoneNumber } from "@/utils/format/format-phone-number"
import { cleanPostalCode } from "@/utils/format/format-postal-code"

/**
 * Input types
 */
export type AddressListInput = {
  enabled?: boolean
}

export type CustomerUpdateInput = UpdateCustomerData

/**
 * Clean address data before sending to API
 * Removes formatting (spaces, etc.) from postal code and phone number
 */
function cleanAddressData<T extends Partial<CreateAddressData>>(data: T): T {
  return {
    ...data,
    postal_code: data.postal_code
      ? cleanPostalCode(data.postal_code)
      : data.postal_code,
    phone: data.phone ? cleanPhoneNumber(data.phone) : data.phone,
  }
}

/**
 * Check if data contains enough fields to be considered complete address data
 */
function isCompleteAddressData(data: Partial<CreateAddressData>): boolean {
  return "first_name" in data && "last_name" in data && "address_1" in data
}

/**
 * Service adapters
 */
function getAddressesAdapter(_params: AddressListInput, _signal?: AbortSignal) {
  return getAddresses()
}

function createAddressAdapter(
  params: CreateAddressData
): Promise<StoreCustomerAddress> {
  return createAddress(params)
}

function updateAddressAdapter(
  addressId: string,
  params: Partial<CreateAddressData>
): Promise<StoreCustomerAddress> {
  return updateAddress(addressId, params)
}

function deleteAddressAdapter(addressId: string): Promise<void> {
  return deleteAddress(addressId)
}

function updateCustomerAdapter(
  params: CustomerUpdateInput
): Promise<StoreCustomer> {
  return updateCustomer(params)
}

/**
 * Create base customer hooks using storefront-data factory
 * (for useCustomerAddresses, useSuspenseCustomerAddresses, useUpdateCustomer)
 */
const baseHooks = createCustomerHooks<
  StoreCustomer,
  StoreCustomerAddress,
  AddressListInput,
  AddressListInput,
  CreateAddressData,
  CreateAddressData,
  Partial<CreateAddressData> & { addressId?: string },
  Partial<CreateAddressData>,
  CustomerUpdateInput,
  CustomerUpdateInput
>({
  service: {
    getAddresses: getAddressesAdapter,
    createAddress: createAddressAdapter,
    updateAddress: updateAddressAdapter,
    deleteAddress: deleteAddressAdapter,
    updateCustomer: updateCustomerAdapter,
  },
  authQueryKeys: {
    customer: () => queryKeys.customer.profile(),
  },
  queryKeyNamespace: "n1",
})

// Re-export hooks that match the expected API
export const {
  useCustomerAddresses,
  useSuspenseCustomerAddresses,
  useUpdateCustomer,
} = baseHooks

/**
 * Query keys for cache invalidation (matches n1 namespace)
 */
const customerQueryKeys = {
  all: () => queryKeys.customer.all(),
  profile: () => queryKeys.customer.profile(),
}

/**
 * useCreateAddress - maintains existing API: mutate(data)
 * Includes validation and data cleaning
 */
export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAddressData) => {
      // Safety net validation before API call
      const errors = validateAddressForm(data as AddressFormData)
      if (Object.keys(errors).length > 0) {
        throw new AddressValidationError(errors)
      }

      // Clean data before API call
      const cleanedData = cleanAddressData(data)

      return await createAddress(cleanedData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerQueryKeys.all(),
      })
    },
  })
}

/**
 * useUpdateAddress - maintains existing API: mutate({ addressId, data })
 * Includes validation and data cleaning
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      addressId,
      data,
    }: {
      addressId: string
      data: Partial<CreateAddressData>
    }) => {
      // Safety net validation (only for complete address data)
      if (isCompleteAddressData(data)) {
        const errors = validateAddressForm(data as AddressFormData)
        if (Object.keys(errors).length > 0) {
          throw new AddressValidationError(errors)
        }
      }

      // Clean data before API call
      const cleanedData = cleanAddressData(data)

      return await updateAddress(addressId, cleanedData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerQueryKeys.all(),
      })
    },
  })
}

/**
 * useDeleteAddress - maintains existing API: mutate(addressId)
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerQueryKeys.all(),
      })
    },
  })
}
