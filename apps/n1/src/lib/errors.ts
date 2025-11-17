type ErrorWithMessage = {
  message: unknown
}

type ErrorWithStatus = {
  status: unknown
}

type ErrorWithResponse = {
  response: unknown
}

export function isError(error: unknown): error is Error {
  return error instanceof Error
}

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

export function getErrorStatus(error: unknown): number | null {
  // Check for direct status property (Medusa SDK)
  if (error && typeof error === 'object' && 'status' in error) {
    const errorWithStatus = error as ErrorWithStatus
    if (typeof errorWithStatus.status === 'number') {
      return errorWithStatus.status
    }
  }

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

export function isNotFoundError(error: unknown): boolean {
  const status = getErrorStatus(error)
  return status === 404
}

export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}

export type MutationError = {
  message: string
  status?: number
  code?: string
}

export function toMutationError(error: unknown): MutationError {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error) ?? undefined,
  }
}