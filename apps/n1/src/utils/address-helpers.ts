import type { PplAccessPointData } from "@/app/pokladna/_components/ppl-widget"
import { DEFAULT_COUNTRY_CODE } from "@/lib/constants"
import type { ShippingMethodData } from "@/services/cart-service"
import type { StoreCustomerAddress } from "@/services/customer-service"
import type { AddressFormData } from "./address-validation"

/**
 * Default empty address for form initialization
 */
export const DEFAULT_ADDRESS: AddressFormData = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: DEFAULT_COUNTRY_CODE,
  phone: "",
}

/**
 * Generická konverze adresy na AddressFormData
 * Funguje pro customer address, cart address nebo jakýkoliv compatible address objekt
 */
function addressToFormData(
  address:
    | {
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
      }
    | null
    | undefined
): Partial<AddressFormData> {
  // Return empty form if no address provided
  if (!address) {
    return {
      first_name: "",
      last_name: "",
      company: "",
      address_1: "",
      address_2: "",
      city: "",
      province: "",
      postal_code: "",
      country_code: DEFAULT_COUNTRY_CODE,
      phone: "",
    }
  }

  // Convert address to form data
  return {
    first_name: address.first_name || "",
    last_name: address.last_name || "",
    company: address.company || "",
    address_1: address.address_1 || "",
    address_2: address.address_2 || "",
    city: address.city || "",
    province: address.province || "",
    postal_code: address.postal_code || "",
    country_code: address.country_code || DEFAULT_COUNTRY_CODE,
    phone: address.phone || "",
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
  address:
    | {
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
      }
    | null
    | undefined
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

// =============================================================================
// PPL Access Point Helpers
// =============================================================================

/** Re-export PplAccessPointData for convenience */
export type { PplAccessPointData }

/** Check if shipping option requires PPL Parcel access point selection */
export function isPPLParcelOption(optionName: string): boolean {
  const name = optionName.toLowerCase()
  return name.includes("parcel smart") || name.includes("parcelsmart")
}

/** Convert PPL access point to shipping method data */
export function accessPointToShippingData(
  accessPoint: PplAccessPointData
): ShippingMethodData {
  return {
    access_point_id: accessPoint.code,
    access_point_name: accessPoint.name,
    access_point_type: accessPoint.type,
    access_point_street: accessPoint.address?.street,
    access_point_city: accessPoint.address?.city,
    access_point_zip: accessPoint.address?.zipCode,
    access_point_country: accessPoint.address?.country,
  }
}

/** Convert PPL access point to Medusa address format for shipping_address */
export function accessPointToAddress(
  accessPoint: PplAccessPointData,
  billingAddress: AddressFormData
): AddressFormData {
  return {
    first_name: billingAddress.first_name,
    last_name: billingAddress.last_name,
    company: accessPoint.name,
    address_1: accessPoint.address?.street || "",
    address_2: "",
    city: accessPoint.address?.city || "",
    postal_code: accessPoint.address?.zipCode || "",
    country_code: accessPoint.address?.country?.toLowerCase() || "cz",
    province: "",
    phone: billingAddress.phone,
  }
}
