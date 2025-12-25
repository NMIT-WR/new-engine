import { AUTH_MESSAGES } from "./auth-messages"
import { VALIDATION_MESSAGES } from "./validation-messages"

export const addressValidators = {
  first_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.firstName.required
      }
      if (value.length < 2) {
        return VALIDATION_MESSAGES.firstName.minLength
      }
      return
    },
  },
  last_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.lastName.required
      }
      if (value.length < 2) {
        return VALIDATION_MESSAGES.lastName.minLength
      }
      return
    },
  },
  address_1: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.address.required
      }
      if (value.length < 3) {
        return VALIDATION_MESSAGES.address.minLength
      }
      return
    },
  },
  city: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.city.required
      }
      if (value.length < 2) {
        return VALIDATION_MESSAGES.city.minLength
      }
      return
    },
  },
  postal_code: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.postalCode.required
      }
      if (!/^\d{3}\s\d{2}$/.test(value)) {
        return VALIDATION_MESSAGES.postalCode.invalid
      }
      return
    },
  },
  country_code: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.country.required
      }
      return
    },
  },
  phone: {
    onChange: ({ value }: { value: string | undefined }) => {
      if (!value) {
        return
      }
      if (!/^(\+420\s)?\d{3}\s\d{3}\s\d{3}$|^$/.test(value)) {
        return VALIDATION_MESSAGES.phone.invalid
      }
      return
    },
  },
  company: {},
  address_2: {},
  province: {},
} as const

export const emailValidator = {
  onChange: ({ value }: { value: string }) => {
    if (!value?.trim()) {
      return VALIDATION_MESSAGES.email.required
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return VALIDATION_MESSAGES.email.invalid
    }
    return
  },
} as const

export const loginPasswordValidator = {
  onSubmit: ({ value }: { value: string }) => {
    if (!value?.trim()) {
      return VALIDATION_MESSAGES.password.required
    }
    // No further validation - backend will return generic error
    return
  },
} as const

export const loginValidators = {
  email: emailValidator,
  password: loginPasswordValidator,
} as const

export const PASSWORD_REQUIREMENTS = [
  {
    id: "min-length",
    label: AUTH_MESSAGES.PASSWORD_REQUIREMENT_LENGTH,
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    id: "has-number",
    label: AUTH_MESSAGES.PASSWORD_REQUIREMENT_NUMBER,
    test: (pwd: string) => /\d/.test(pwd),
  },
]

export const isPasswordValid = (password: string): boolean =>
  PASSWORD_REQUIREMENTS.every((req) => req.test(password))

export const registerValidators = {
  first_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.firstName.required
      }
      return
    },
  },
  last_name: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.lastName.required
      }
      return
    },
  },
  email: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.email.required
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return VALIDATION_MESSAGES.email.invalid
      }
      return
    },
  },
  password: {
    onChange: ({ value }: { value: string }) => {
      if (!value?.trim()) {
        return VALIDATION_MESSAGES.password.required
      }
      if (!isPasswordValid(value)) {
        return VALIDATION_MESSAGES.password.invalid
      }
      return
    },
  },
  acceptTerms: {
    onChange: ({ value }: { value: boolean }) => {
      if (!value) {
        return VALIDATION_MESSAGES.terms.required
      }
      return
    },
  },
} as const
