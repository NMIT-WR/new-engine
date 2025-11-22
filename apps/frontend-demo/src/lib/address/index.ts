import type { HttpTypes } from "@medusajs/types"
import type { ChangeEvent } from "react"
import type { AddressData } from "@/types/checkout"

export { COUNTRIES } from "@/lib/checkout-data"

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Formatters
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length === 0) {
    return ""
  }

  // For Czech phone numbers without country code
  if (cleaned.length <= 9) {
    if (cleaned.length <= 3) {
      return cleaned
    }
    if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    }
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`
  }

  // For international numbers with country code
  const country = cleaned.slice(0, 3)
  const firstPart = cleaned.slice(3, 6)
  const secondPart = cleaned.slice(6, 9)
  const thirdPart = cleaned.slice(9, 12)

  let formatted = "+"
  if (country) {
    formatted += country
  }
  if (firstPart) {
    formatted += ` ${firstPart}`
  }
  if (secondPart) {
    formatted += ` ${secondPart}`
  }
  if (thirdPart) {
    formatted += ` ${thirdPart}`
  }

  return formatted
}

export const formatPostalCode = (value: string): string => {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length <= 3) {
    return cleaned
  }
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)}`
}

// Validators
export const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email)

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 9
}

export const validatePostalCode = (postalCode: string): boolean => {
  const cleaned = postalCode.replace(/\D/g, "")
  return cleaned.length === 5
}

// Type for address in metadata
export type AddressMetadata = {
  street?: string
  city?: string
  postal_code?: string
  country?: string
}

// Metadata helpers
export const getAddressFromMetadata = (
  user: HttpTypes.StoreCustomer | null
): AddressMetadata => {
  if (!user?.metadata?.address) {
    return {}
  }
  return user.metadata.address as AddressMetadata
}

export const createAddressMetadata = (
  street: string,
  city: string,
  postalCode: string,
  country: string
): AddressMetadata => ({
  street,
  city,
  postal_code: postalCode,
  country,
})

// Type for form field props
type FormFieldProps = Record<string, any>

// Form field helpers (similar to authFormFields pattern)
export const addressFormFields = {
  firstName: (props: FormFieldProps = {}) => ({
    id: "firstName",
    label: "Jméno",
    required: true,
    ...props,
  }),

  lastName: (props: FormFieldProps = {}) => ({
    id: "lastName",
    label: "Příjmení",
    required: true,
    ...props,
  }),

  email: (props: FormFieldProps = {}) => ({
    id: "email",
    label: "Email",
    type: "email",
    required: true,
    ...props,
  }),

  phone: (props: FormFieldProps = {}) => ({
    id: "phone",
    label: "Telefon",
    type: "tel",
    placeholder: "777 666 555",
    ...props,
  }),

  company: (props: FormFieldProps = {}) => ({
    id: "company",
    label: "Firma",
    ...props,
  }),

  street: (props: FormFieldProps = {}) => ({
    id: "street",
    label: "Ulice a číslo popisné",
    placeholder: "Hlavní 123",
    ...props,
  }),

  city: (props: FormFieldProps = {}) => ({
    id: "city",
    label: "Město",
    placeholder: "Praha",
    ...props,
  }),

  postalCode: (props: FormFieldProps = {}) => ({
    id: "postalCode",
    label: "PSČ",
    placeholder: "100 00",
    ...props,
  }),
}

// Helper for creating phone onChange handler
export const createPhoneChangeHandler =
  (setValue: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue(formatted)
  }

// Helper for creating postal code onChange handler
export const createPostalCodeChangeHandler =
  (setValue: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCode(e.target.value)
    setValue(formatted)
  }

// Validation error messages
export const ADDRESS_ERRORS = {
  firstName: "Jméno je povinné",
  lastName: "Příjmení je povinné",
  email: "Email je povinný",
  emailInvalid: "Neplatný formát emailu",
  phone: "Telefon je povinný",
  phoneInvalid: "Telefon musí mít alespoň 9 číslic",
  street: "Ulice je povinná",
  city: "Město je povinné",
  postalCode: "PSČ je povinné",
  postalCodeInvalid: "PSČ musí mít 5 číslic",
} as const

// Address validation options
export type AddressValidationOptions = {
  requireEmail?: boolean
  requirePhone?: boolean
  prefix?: string // prefix for error keys (e.g., 'shipping' or 'billing')
}

// Universal address validation function
export const validateAddress = (
  address: Partial<AddressData>,
  options: AddressValidationOptions = { requireEmail: true, requirePhone: true }
): Record<string, string> => {
  const errors: Record<string, string> = {}
  const prefix = options.prefix ? `${options.prefix}` : ""

  // Required fields for all addresses
  if (!address.firstName) {
    errors[`${prefix}FirstName`] = ADDRESS_ERRORS.firstName
  }
  if (!address.lastName) {
    errors[`${prefix}LastName`] = ADDRESS_ERRORS.lastName
  }
  if (!address.street) {
    errors[`${prefix}Street`] = ADDRESS_ERRORS.street
  }
  if (!address.city) {
    errors[`${prefix}City`] = ADDRESS_ERRORS.city
  }

  // Postal code validation
  if (!address.postalCode) {
    errors[`${prefix}PostalCode`] = ADDRESS_ERRORS.postalCode
  } else if (!validatePostalCode(address.postalCode)) {
    errors[`${prefix}PostalCode`] = ADDRESS_ERRORS.postalCodeInvalid
  }

  // Optional email validation (typically for shipping address)
  if (options.requireEmail) {
    if (!address.email) {
      errors[`${prefix}Email`] = ADDRESS_ERRORS.email
    } else if (!validateEmail(address.email)) {
      errors[`${prefix}Email`] = ADDRESS_ERRORS.emailInvalid
    }
  }

  // Optional phone validation (typically for shipping address)
  if (options.requirePhone) {
    if (!address.phone) {
      errors[`${prefix}Phone`] = ADDRESS_ERRORS.phone
    } else if (!validatePhone(address.phone)) {
      errors[`${prefix}Phone`] = ADDRESS_ERRORS.phoneInvalid
    }
  }

  return errors
}
