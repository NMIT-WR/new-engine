/**
 * JWT Token Utilities
 * Utilities for working with Medusa JWT tokens stored in localStorage
 */

interface JWTPayload {
  exp?: number
  [key: string]: unknown
}

/**
 * Parse JWT token and extract payload
 * @param token - JWT token string
 * @returns Parsed payload or null if invalid
 * @private Internal helper function
 */
function parseJWT(token: string): JWTPayload | null {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null // Invalid token format
    }

    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1])) as JWTPayload

    return payload
  } catch {
    // Any parsing error = invalid token
    return null
  }
}

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
  const payload = parseJWT(token)
  if (!payload?.exp) {
    return true // No valid payload or expiration = treat as expired
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()

  return currentTime >= expirationTime
}

/**
 * Get token expiration date
 * @param token - JWT token string
 * @returns Date object or null if invalid
 */
export function getTokenExpiration(token: string): Date | null {
  const payload = parseJWT(token)
  if (!payload?.exp) return null

  return new Date(payload.exp * 1000)
}

/**
 * Get time until token expires
 * @param token - JWT token string
 * @returns Milliseconds until expiration, or 0 if expired/invalid
 */
export function getTimeUntilExpiration(token: string): number {
  const payload = parseJWT(token)
  if (!payload?.exp) return 0

  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  const timeLeft = expirationTime - currentTime

  return timeLeft > 0 ? timeLeft : 0
}

/**
 * Clear authentication token from localStorage
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('medusa_auth_token')
}
