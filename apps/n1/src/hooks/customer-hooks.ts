import type { StoreCustomer, StoreCustomerAddress } from "@medusajs/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createCustomerHooks,
  createMedusaCustomerService,
} from "@techsio/storefront-data"
import { AddressValidationError, logError } from "@/lib/errors"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"
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

export type CreateAddressData = {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
}

export type UpdateCustomerData = {
  first_name?: string
  last_name?: string
  phone?: string
  password?: string
  metadata?: Record<string, unknown>
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

const baseCustomerService = createMedusaCustomerService(sdk)

/**
 * n1 wrapper actions over storefront-data medusa service.
 * Keeps Czech error messages and legacy fallback behavior.
 */
async function getAddressesAction() {
  try {
    return await baseCustomerService.getAddresses({}, undefined)
  } catch (err) {
    logError("CustomerService.getAddresses", err)
    // Keep legacy n1 behavior - return empty list on failure
    return { addresses: [] }
  }
}

async function createAddressAction(
  params: CreateAddressData
): Promise<StoreCustomerAddress> {
  try {
    return await baseCustomerService.createAddress(params)
  } catch (err) {
    logError("CustomerService.createAddress", err)
    throw new Error("Nepodařilo se vytvořit adresu")
  }
}

async function updateAddressAction(
  addressId: string,
  params: Partial<CreateAddressData>
): Promise<StoreCustomerAddress> {
  try {
    return await baseCustomerService.updateAddress(addressId, params)
  } catch (err) {
    logError("CustomerService.updateAddress", err)
    throw new Error("Nepodařilo se aktualizovat adresu")
  }
}

async function deleteAddressAction(addressId: string): Promise<void> {
  try {
    await baseCustomerService.deleteAddress(addressId)
  } catch (err) {
    logError("CustomerService.deleteAddress", err)
    throw new Error("Nepodařilo se smazat adresu")
  }
}

async function updateCustomerAction(
  params: CustomerUpdateInput
): Promise<StoreCustomer> {
  const { password: _password, ...safeParams } = params

  try {
    if (!baseCustomerService.updateCustomer) {
      throw new Error("updateCustomer service is not configured")
    }
    return await baseCustomerService.updateCustomer(safeParams)
  } catch (err) {
    logError("CustomerService.updateCustomer", err)
    throw new Error("Nepodařilo se aktualizovat profil")
  }
}

/**
 * Service adapters for createCustomerHooks
 */
function getAddressesAdapter(_params: AddressListInput, _signal?: AbortSignal) {
  return getAddressesAction()
}

function createAddressAdapter(
  params: CreateAddressData
): Promise<StoreCustomerAddress> {
  return createAddressAction(params)
}

function updateAddressAdapter(
  addressId: string,
  params: Partial<CreateAddressData>
): Promise<StoreCustomerAddress> {
  return updateAddressAction(addressId, params)
}

function deleteAddressAdapter(addressId: string): Promise<void> {
  return deleteAddressAction(addressId)
}

function updateCustomerAdapter(
  params: CustomerUpdateInput
): Promise<StoreCustomer> {
  return updateCustomerAction(params)
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

      return await createAddressAction(cleanedData)
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

      return await updateAddressAction(addressId, cleanedData)
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
    mutationFn: (addressId: string) => deleteAddressAction(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerQueryKeys.all(),
      })
    },
  })
}
