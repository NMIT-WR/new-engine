/**
 * TanStack Form validators
 * Centralized validation logic for all forms
 */

// ============================================================================
// Validation Messages (Czech)
// ============================================================================

export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} je povinné`,
  minLength: (field: string, min: number) =>
    `${field} musí mít alespoň ${min} znaky`,
  email: 'Zadejte platnou e-mailovou adresu',
  postalCode: 'PSČ musí být ve formátu 123 45',
  phone: 'Telefon musí mít 9 číslic',
  passwordMin: 'Heslo musí mít alespoň 8 znaků',
  passwordsMatch: 'Hesla se musí shodovat',
} as const

// ============================================================================
// Field Validators
// ============================================================================

export const validators = {
  required:
    (fieldName: string) =>
    ({ value }: { value: string }) =>
      !value?.trim() ? VALIDATION_MESSAGES.required(fieldName) : undefined,

  minLength:
    (fieldName: string, min: number) =>
    ({ value }: { value: string }) =>
      value && value.length < min
        ? VALIDATION_MESSAGES.minLength(fieldName, min)
        : undefined,

  email: ({ value }: { value: string }) => {
    if (!value?.trim()) return VALIDATION_MESSAGES.required('E-mail')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(value) ? VALIDATION_MESSAGES.email : undefined
  },

  postalCode: ({ value }: { value: string }) => {
    if (!value?.trim()) return VALIDATION_MESSAGES.required('PSČ')
    const postalRegex = /^\d{3}\s\d{2}$/
    return !postalRegex.test(value) ? VALIDATION_MESSAGES.postalCode : undefined
  },

  phone: ({ value }: { value: string }) => {
    if (!value) return undefined // Optional field
    const phoneRegex = /^(\+420\s)?\d{3}\s\d{3}\s\d{3}$|^$/
    return !phoneRegex.test(value) ? VALIDATION_MESSAGES.phone : undefined
  },

  password: ({ value }: { value: string }) => {
    if (!value?.trim()) return VALIDATION_MESSAGES.required('Heslo')
    return value.length < 8 ? VALIDATION_MESSAGES.passwordMin : undefined
  },
} as const

// ============================================================================
// Composed Validators for Address Fields
// ============================================================================

export const addressValidators = {
  first_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Jméno je povinné'
      if (value.length < 2) return 'Jméno musí mít alespoň 2 znaky'
      return undefined
    },
  },
  last_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Příjmení je povinné'
      if (value.length < 2) return 'Příjmení musí mít alespoň 2 znaky'
      return undefined
    },
  },
  address_1: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Adresa je povinná'
      if (value.length < 3) return 'Adresa musí mít alespoň 3 znaky'
      return undefined
    },
  },
  city: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Město je povinné'
      if (value.length < 2) return 'Město musí mít alespoň 2 znaky'
      return undefined
    },
  },
  postal_code: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'PSČ je povinné'
      if (!/^\d{3}\s\d{2}$/.test(value)) return 'PSČ musí být ve formátu 123 45'
      return undefined
    },
  },
  country_code: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Země je povinná'
      return undefined
    },
  },
  phone: {
    onChange: ({ value }: { value: string | undefined }) => {
      if (!value) return undefined // Optional
      if (!/^(\+420\s)?\d{3}\s\d{3}\s\d{3}$|^$/.test(value)) {
        return 'Telefon musí mít 9 číslic'
      }
      return undefined
    },
  },
  company: {}, // Optional, no validation
  address_2: {}, // Optional, no validation
  province: {}, // Optional, no validation
} as const

// ============================================================================
// Email validator for checkout
// ============================================================================

export const emailValidator = {
  onChange: ({ value }: { value: string }) => {
    if (!value?.trim()) return 'E-mail je povinný'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Zadejte platnou e-mailovou adresu'
    }
    return undefined
  },
} as const

// ============================================================================
// Password Requirements (for PasswordValidator component)
// ============================================================================

export const PASSWORD_REQUIREMENTS = [
  {
    id: 'min-length',
    label: 'Alespoň 8 znaků',
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    id: 'has-number',
    label: 'Alespoň 1 číslice',
    test: (pwd: string) => /\d/.test(pwd),
  },
] as const

export const isPasswordValid = (password: string): boolean =>
  PASSWORD_REQUIREMENTS.every((req) => req.test(password))

// ============================================================================
// Register Form Validators
// ============================================================================

export const registerValidators = {
  first_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Jméno je povinné'
      return undefined
    },
  },
  last_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Příjmení je povinné'
      return undefined
    },
  },
  email: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'E-mail je povinný'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Zadejte platnou e-mailovou adresu'
      }
      return undefined
    },
  },
  password: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) return 'Heslo je povinné'
      if (!isPasswordValid(value)) return 'Heslo nesplňuje požadavky'
      return undefined
    },
  },
  acceptTerms: {
    onChange: ({ value }: { value: boolean }) => {
      if (!value) return 'Musíte souhlasit s podmínkami'
      return undefined
    },
  },
} as const
