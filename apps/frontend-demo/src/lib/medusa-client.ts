import Medusa from '@medusajs/js-sdk'
import { httpClient } from './http-client'
import { storage } from './local-storage'

// Environment validation
const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

if (!PUBLISHABLE_KEY) {
  console.warn('⚠️ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set!')
}

// SDK instance for client-side with JWT auth
export const sdk =
  typeof window !== 'undefined'
    ? new Medusa({
        baseUrl: BACKEND_URL,
        publishableKey: PUBLISHABLE_KEY,
        auth: {
          type: 'jwt',
          jwtTokenStorageKey: 'medusa_auth_token',
          jwtTokenStorageMethod: 'local',
        },
      })
    : new Medusa({
        baseUrl: BACKEND_URL,
        publishableKey: PUBLISHABLE_KEY,
        // No auth for server-side/static generation
      })

// Helper functions
export async function checkBackendHealth(): Promise<{
  healthy: boolean
  error?: string
  details?: unknown
}> {
  try {
    const data = await httpClient.get('/health')
    return { healthy: true, details: data }
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Auth headers helper for custom requests
export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return {}
  }
  const token = storage.get<string>('medusa_auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
