import { DEFAULT_COUNTRY_CODE } from '@/lib/constants'
import type { StoreCustomerAddress } from '@/services/customer-service'
import type { AddressFormData } from './address-validation'
import type { HttpTypes } from '@medusajs/types'

export const DEFAULT_ADDRESS: AddressFormData = {
  first_name: '',
  last_name: '',
  company: '',
  address_1: '',
  address_2: '',
  city: '',
  province: '',
  postal_code: '',
  country_code: DEFAULT_COUNTRY_CODE,
  phone: '',
}

/**
 * generic conversion of address to AddressFormData
 * works for customer address, cart address or any compatible address object
*/
function addressToFormData(
  address?:
    | Partial<HttpTypes.StoreCartAddress>
    | StoreCustomerAddress
    | null
): AddressFormData {
  // Return empty form if no address provided
  if (!address) {
    return {
      first_name: '',
      last_name: '',
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      province: '',
      postal_code: '',
      country_code: DEFAULT_COUNTRY_CODE,
      phone: '',
    }
  }

  // Convert address to form data
  return {
    first_name: address.first_name || '',
    last_name: address.last_name || '',
    company: address.company || '',
    address_1: address.address_1 || '',
    address_2: address.address_2 || '',
    city: address.city || '',
    province: address.province || '',
    postal_code: address.postal_code || '',
    country_code: address.country_code || DEFAULT_COUNTRY_CODE,
    phone: address.phone || '',
  }
}

export { addressToFormData }

/**
 * get default address from customer addresses
 * The first address in the list is considered the default
 */
export function getDefaultAddress(
  addresses: StoreCustomerAddress[] | undefined
): StoreCustomerAddress | null {
  if (!addresses || addresses.length === 0) {
    return null
  }
  return addresses[0]
}
