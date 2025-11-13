/**
 * JWT Token Utilities
 * Utilities for working with Medusa JWT tokens stored in localStorage
 */

/**
 * Get JWT token from localStorage
 * @returns Token string or null if not found
 */
export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('medusa_auth_token')
}

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid
 */
export function isTokenExpired(token: string): boolean {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return true // Invalid token format
    }

    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1]))

    // Check expiration timestamp
    if (!payload.exp) {
      return true // No expiration = treat as expired
    }

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = payload.exp * 1000
    const currentTime = Date.now()

    return currentTime >= expirationTime
  } catch {
    // Any parsing error = treat as expired
    return true
  }
}

/**
 * Get token expiration date
 * @param token - JWT token string
 * @returns Date object or null if invalid
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return null

    return new Date(payload.exp * 1000)
  } catch {
    return null
  }
}

/**
 * Get time until token expires
 * @param token - JWT token string
 * @returns Milliseconds until expiration, or 0 if expired/invalid
 */
export function getTimeUntilExpiration(token: string): number {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return 0

    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return 0

    const expirationTime = payload.exp * 1000
    const currentTime = Date.now()
    const timeLeft = expirationTime - currentTime

    return timeLeft > 0 ? timeLeft : 0
  } catch {
    return 0
  }
}

/**
 * Clear authentication token from localStorage
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('medusa_auth_token')
}
