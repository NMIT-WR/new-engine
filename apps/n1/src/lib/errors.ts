/**
 * Pragmatic error handling utilities
 * Simple, type-safe, and just enough for our needs
 */

/**
 * Helper types for type-safe error property access
 */
type ErrorWithMessage = {
  message: unknown
}

type ErrorWithStatus = {
  status: unknown
}

type ErrorWithResponse = {
  response: unknown
}

/**
 * Type guard to check if value is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Safely extract error message from unknown error
 * Handles Error instances, strings, and objects with message property
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  // Check for objects with message property (Medusa SDK errors)
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as ErrorWithMessage
    if (typeof errorWithMessage.message === 'string') {
      return errorWithMessage.message
    }
  }

  return 'An unknown error occurred'
}

/**
 * Extract HTTP status from error if available
 */
export function getErrorStatus(error: unknown): number | null {
  // Check for direct status property (Medusa SDK)
  if (error && typeof error === 'object' && 'status' in error) {
    const errorWithStatus = error as ErrorWithStatus
    if (typeof errorWithStatus.status === 'number') {
      return errorWithStatus.status
    }
  }

  // Check for response.status (fetch errors)
  if (error && typeof error === 'object' && 'response' in error) {
    const errorWithResponse = error as ErrorWithResponse
    if (
      errorWithResponse.response &&
      typeof errorWithResponse.response === 'object' &&
      'status' in errorWithResponse.response
    ) {
      const response = errorWithResponse.response as { status: unknown }
      if (typeof response.status === 'number') {
        return response.status
      }
    }
  }

  return null
}

/**
 * Check if error is a 404 (not found)
 * Used in cart service when cart doesn't exist
 */
export function isNotFoundError(error: unknown): boolean {
  const status = getErrorStatus(error)
  return status === 404
}

/**
 * Development-only error logging
 * Only logs in development environment
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}

/**
 * Standard error shape for React Query mutations
 * Simple and compatible with our hooks
 */
export type MutationError = {
  message: string
  status?: number
  code?: string
}

/**
 * Convert any error to MutationError format
 * Used in mutation error handlers
 */
export function toMutationError(error: unknown): MutationError {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error) ?? undefined,
  }
}