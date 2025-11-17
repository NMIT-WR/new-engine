interface JWTPayload {
  exp?: number
  [key: string]: unknown
}

function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    const payload = JSON.parse(atob(parts[1])) as JWTPayload
    return payload
  } catch {
    return null
  }
}

export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('medusa_auth_token')
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload?.exp) {
    return true // No valid payload or expiration = treat as expired
  }

  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()

  return currentTime >= expirationTime
}

export function getTokenExpiration(token: string): Date | null {
  const payload = parseJWT(token)
  if (!payload?.exp) return null

  return new Date(payload.exp * 1000)
}

export function getTimeUntilExpiration(token: string): number {
  const payload = parseJWT(token)
  if (!payload?.exp) return 0

  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  const timeLeft = expirationTime - currentTime

  return timeLeft > 0 ? timeLeft : 0
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('medusa_auth_token')
}
