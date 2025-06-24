import Medusa from '@medusajs/js-sdk'
import { STORAGE_KEYS } from './constants'
import { httpClient } from './http-client'

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
          jwtTokenStorageKey: STORAGE_KEYS.AUTH_TOKEN,
          jwtTokenStorageMethod: 'local',
        },
      })
    : new Medusa({
        baseUrl: BACKEND_URL,
        publishableKey: PUBLISHABLE_KEY,
        // No auth for server-side/static generation
      })

// Export a simple client config for direct fetch calls
export const medusaClient = {
  config: {
    baseUrl: BACKEND_URL,
    publishableKey: PUBLISHABLE_KEY,
  },
}

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
