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
      value: /^\d{3}\s?\d{2}$/,
      message: 'PSČ musí být ve formátu 123 45',
    },
  },
  country_code: {
    required: 'Země je povinná',
  },
  phone: {
    pattern: {
      value: /^(\+420|\+421)?\s?\d{3}\s?\d{3}\s?\d{3}$|^$/,
      message: 'Neplatný formát telefonu',
    },
  },
} as const

/**
 * Centralizovaná definice povinných polí adresy
 */
export const REQUIRED_ADDRESS_FIELDS = [
  'first_name',
  'last_name',
  'address_1',
  'city',
  'postal_code',
  'country_code',
] as const satisfies readonly AddressFieldKey[]

/**
 * Validuje jednotlivé pole adresy
 * @param field - Název pole
 * @param value - Hodnota pole
 * @param countryCode - Kód země (pro validaci PSČ)
 * @returns Chybová zpráva nebo undefined
 */
export function validateAddressField(
  field: AddressFieldKey,
  value: string,
  countryCode?: string
): string | undefined {
  switch (field) {
    case 'first_name': {
      if (!value.trim()) {
        return 'Jméno je povinné'
      }
      if (value.length < 2) {
        return 'Jméno musí mít alespoň 2 znaky'
      }
      break
    }
    case 'last_name': {
      if (!value.trim()) {
        return 'Příjmení je povinné'
      }
      if (value.length < 2) {
        return 'Příjmení musí mít alespoň 2 znaky'
      }
      break
    }
    case 'address_1': {
      if (!value.trim()) {
        return 'Adresa je povinná'
      }
      if (value.length < 5) {
        return 'Zadejte platnou adresu'
      }
      break
    }
    case 'city': {
      if (!value.trim()) {
        return 'Město je povinné'
      }
      if (value.length < 2) {
        return 'Zadejte platné město'
      }
      break
    }
    case 'postal_code': {
      if (!value.trim()) {
        return 'PSČ je povinné'
      }
      // Czech postal code format: XXX XX
      if (
        countryCode === 'cz' &&
        !/^\d{3}\s?\d{2}$/.test(value.replace(/\s/g, ''))
      ) {
        return 'Zadejte platné české PSČ (např. 110 00)'
      }
      // Slovak postal code format: XXX XX
      if (
        countryCode === 'sk' &&
        !/^\d{3}\s?\d{2}$/.test(value.replace(/\s/g, ''))
      ) {
        return 'Zadejte platné slovenské PSČ (např. 811 01)'
      }
      break
    }
    case 'phone': {
      if (value && !/^\+?[\d\s()-]+$/.test(value)) {
        return 'Zadejte platné telefonní číslo'
      }
      break
    }
    // Optional fields - no validation
    case 'company':
    case 'address_2':
    case 'province':
      break
  }
  return undefined
}



/**
 * Validuje celý formulář adresy
 * @returns Objekt s chybami nebo prázdný objekt
 */
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

/**
 * Kontrola, zda je formulář validní
 */
export function isAddressFormValid(data: AddressFormData): boolean {
  const errors = validateAddressForm(data)
  return Object.keys(errors).length === 0
}
