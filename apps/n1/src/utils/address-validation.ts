export interface AddressFormData {
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

export type AddressFieldKey = keyof AddressFormData
export type AddressErrors = Partial<Record<AddressFieldKey, string>>
export type AddressTouched = Partial<Record<AddressFieldKey, boolean>>

/**
 * Validation rules for react-hook-form Controller components
 */
export const ADDRESS_VALIDATION_RULES = {
  first_name: {
    required: 'Jméno je povinné',
    minLength: { value: 2, message: 'Jméno musí mít alespoň 2 znaky' },
  },
  last_name: {
    required: 'Příjmení je povinné',
    minLength: { value: 2, message: 'Příjmení musí mít alespoň 2 znaky' },
  },
  address_1: {
    required: 'Adresa je povinná',
    minLength: { value: 3, message: 'Adresa musí mít alespoň 3 znaky' },
  },
  city: {
    required: 'Město je povinné',
    minLength: { value: 2, message: 'Město musí mít alespoň 2 znaky' },
  },
  postal_code: {
    required: 'PSČ je povinné',
    pattern: {
      value: /^\d{3}\s\d{2}$/,
      message: 'PSČ musí být ve formátu 123 45',
    },
  },
  country_code: {
    required: 'Země je povinná',
  },
  phone: {
    pattern: {
      value: /^(\+420\s)?\d{3}\s\d{3}\s\d{3}$|^$/,
      message: 'Telefon musí mít 9 číslic',
    },
  },
} as const

export const REQUIRED_ADDRESS_FIELDS = [
  'first_name',
  'last_name',
  'address_1',
  'city',
  'postal_code',
  'country_code',
] as const satisfies readonly AddressFieldKey[]

/* used in checkout */
export const EMAIL_VALIDATION_RULES = {
  required: 'E-mail je povinný',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Zadejte platnou e-mailovou adresu',
  },
}

export function validateAddressField(
  field: AddressFieldKey,
  value: string,
  _countryCode?: string
): string | undefined {
  switch (field) {
    case 'first_name': {
      if (!value.trim()) {
        return ADDRESS_VALIDATION_RULES.first_name.required
      }
      if (value.length < ADDRESS_VALIDATION_RULES.first_name.minLength.value) {
        return ADDRESS_VALIDATION_RULES.first_name.minLength.message
      }
      break
    }
    case 'last_name': {
      if (!value.trim()) {
        return ADDRESS_VALIDATION_RULES.last_name.required
      }
      if (value.length < ADDRESS_VALIDATION_RULES.last_name.minLength.value) {
        return ADDRESS_VALIDATION_RULES.last_name.minLength.message
      }
      break
    }
    case 'address_1': {
      if (!value.trim()) {
        return ADDRESS_VALIDATION_RULES.address_1.required
      }
      if (value.length < ADDRESS_VALIDATION_RULES.address_1.minLength.value) {
        return ADDRESS_VALIDATION_RULES.address_1.minLength.message
      }
      break
    }
    case 'city': {
      if (!value.trim()) {
        return ADDRESS_VALIDATION_RULES.city.required
      }
      if (value.length < ADDRESS_VALIDATION_RULES.city.minLength.value) {
        return ADDRESS_VALIDATION_RULES.city.minLength.message
      }
      break
    }
    case 'country_code': {
      if (!value.trim()) {
        return ADDRESS_VALIDATION_RULES.country_code.required
      }
      break
    }
    case 'postal_code': {
      if (!value.trim()) {
        return ADDRESS_VALIDATION_RULES.postal_code.required
      }
      if (!ADDRESS_VALIDATION_RULES.postal_code.pattern.value.test(value)) {
        return ADDRESS_VALIDATION_RULES.postal_code.pattern.message
      }
      break
    }
    case 'phone': {
      if (value && !ADDRESS_VALIDATION_RULES.phone.pattern.value.test(value)) {
        return ADDRESS_VALIDATION_RULES.phone.pattern.message
      }
      break
    }
    // Optional fields - no validation
    case 'company':
    case 'address_2':
    case 'province':
      break

    default:
      break
  }
  return undefined
}

export function validateAddressForm(data: AddressFormData): AddressErrors {
  const errors: AddressErrors = {}

  // Validate required fields
  for (const field of REQUIRED_ADDRESS_FIELDS) {
    const fieldValue = data[field] || ''
    const error = validateAddressField(field, fieldValue, data.country_code)
    if (error) {
      errors[field] = error
    }
  }

  // Optional fields (validate only if provided)
  if (data.phone) {
    const phoneError = validateAddressField('phone', data.phone)
    if (phoneError) {
      errors.phone = phoneError
    }
  }

  return errors
}

export function isAddressFormValid(data: AddressFormData): boolean {
  const errors = validateAddressForm(data)
  return Object.keys(errors).length === 0
}
