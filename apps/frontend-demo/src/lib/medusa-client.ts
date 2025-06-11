import Medusa from '@medusajs/js-sdk'

// Environment validation
const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

if (!PUBLISHABLE_KEY) {
  console.warn('⚠️ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set!')
}

// SDK instance
export const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  auth: {
    type: 'jwt',
    jwtTokenStorageKey: 'medusa_jwt_token',
    jwtTokenStorageMethod: 'local',
  },
})

// Helper functions
export async function checkBackendHealth(): Promise<{
  healthy: boolean
  error?: string
  details?: unknown
}> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`)
    const data = await response.json()
    return { healthy: response.ok, details: data }
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Auth headers helper for custom requests
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('medusa_jwt_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
