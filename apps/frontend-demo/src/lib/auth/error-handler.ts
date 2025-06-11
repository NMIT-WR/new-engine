import { AUTH_ERRORS } from './constants'

/**
 * Maps error messages to user-friendly messages
 */
export function getAuthErrorMessage(error: any): string {
  const message = error?.message || ''

  // Email validation errors
  if (message.includes('Invalid email')) {
    return AUTH_ERRORS.INVALID_EMAIL
  }

  // Credential errors
  if (message.includes('Invalid credentials')) {
    return AUTH_ERRORS.INVALID_CREDENTIALS
  }

  // User not found
  if (message.includes('not found')) {
    return AUTH_ERRORS.USER_NOT_FOUND
  }

  // User already exists
  if (message.includes('already exists')) {
    return AUTH_ERRORS.USER_EXISTS
  }

  // Return original message if it's specific enough
  if (message && !message.includes('Error:')) {
    return message
  }

  // Default error
  return AUTH_ERRORS.GENERIC_ERROR
}

/**
 * Extract field-specific errors from a general error
 */
export function extractFieldError(
  error: string,
  field: string
): string | undefined {
  const lowerError = error.toLowerCase()
  const lowerField = field.toLowerCase()

  if (lowerError.includes(lowerField)) {
    return error
  }

  return undefined
}
