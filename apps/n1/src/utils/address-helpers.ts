import { DEFAULT_COUNTRY_CODE } from '@/lib/constants'
import type { StoreCustomerAddress } from '@/services/customer-service'
import type { AddressFormData } from './address-validation'

/**
 * Generická konverze adresy na AddressFormData
 * Funguje pro customer address, cart address nebo jakýkoliv compatible address objekt
 */
function addressToFormData(
  address: {
    first_name?: string | null
    last_name?: string | null
    company?: string | null
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    province?: string | null
    postal_code?: string | null
    country_code?: string | null
    phone?: string | null
  } | null | undefined
): Partial<AddressFormData> {
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

/**
 * Konverze customer adresy na AddressFormData
 * @deprecated Use addressToFormData instead
 */
export function customerAddressToFormData(
  address: StoreCustomerAddress | null | undefined
): Partial<AddressFormData> {
  return addressToFormData(address)
}

/**
 * Konverze cart shipping address na AddressFormData
 * @deprecated Use addressToFormData instead
 */
export function cartAddressToFormData(
  address: {
    first_name?: string | null
    last_name?: string | null
    company?: string | null
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    province?: string | null
    postal_code?: string | null
    country_code?: string | null
    phone?: string | null
  } | null | undefined
): Partial<AddressFormData> {
  return addressToFormData(address)
}

// Export as main function
export { addressToFormData }

/**
 * Získá default adresu z customer adres
 * První adresa v seznamu je považována za default
 */
export function getDefaultAddress(
  addresses: StoreCustomerAddress[] | undefined
): StoreCustomerAddress | null {
  if (!addresses || addresses.length === 0) {
    return null
  }
  return addresses[0]
}
