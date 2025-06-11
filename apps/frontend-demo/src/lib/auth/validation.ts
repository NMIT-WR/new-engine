/**
 * Email validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Password validation rules
 */
export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
}

export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check individual password requirements
 */
export const passwordRequirements = {
  minLength: (password: string) => password.length >= 8,
  hasUppercase: (password: string) => /[A-Z]/.test(password),
  hasLowercase: (password: string) => /[a-z]/.test(password),
  hasNumber: (password: string) => /[0-9]/.test(password),
}

/**
 * Validation error type
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Create field validator
 */
export const createFieldValidator = (errors: ValidationError[]) => {
  return {
    getError: (field: string): string | undefined => {
      return errors.find((e) => e.field === field)?.message
    },
    hasError: (field: string): boolean => {
      return errors.some((e) => e.field === field)
    },
    addError: (field: string, message: string) => {
      if (!errors.some((e) => e.field === field)) {
        errors.push({ field, message })
      }
    },
    clearErrors: () => {
      errors.length = 0
    },
  }
}
