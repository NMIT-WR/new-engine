import type { StoreCustomer, StoreCustomerAddress } from "@medusajs/types"
import { createCustomerHooks } from "@techsio/storefront-data"
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  updateCustomer,
  type CreateAddressData,
  type UpdateCustomerData,
} from "@/services/customer-service"

/**
 * Input types
 */
export type AddressListInput = {
  enabled?: boolean
}

export type AddressCreateInput = CreateAddressData

export type AddressUpdateInput = Partial<CreateAddressData> & {
  addressId?: string
}

export type CustomerUpdateInput = UpdateCustomerData

/**
 * Service adapters (no async - just forwarding promises)
 */
function getAddressesAdapter(_params: AddressListInput, _signal?: AbortSignal) {
  return getAddresses()
}

function createAddressAdapter(
  params: AddressCreateInput
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
 * Create customer hooks using storefront-data factory
 */
export const {
  useCustomerAddresses,
  useSuspenseCustomerAddresses,
  useCreateCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
  useUpdateCustomer,
} = createCustomerHooks<
  StoreCustomer,
  StoreCustomerAddress,
  AddressListInput,
  AddressListInput,
  AddressCreateInput,
  AddressCreateInput,
  AddressUpdateInput,
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
  queryKeyNamespace: "n1",
})
