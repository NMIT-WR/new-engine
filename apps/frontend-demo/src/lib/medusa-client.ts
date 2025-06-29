import Medusa from '@medusajs/js-sdk'
import { STORAGE_KEYS } from './constants'

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
        // Add debug logging
        debug: process.env.NODE_ENV === 'development',
      })
    : new Medusa({
        baseUrl: BACKEND_URL,
        publishableKey: PUBLISHABLE_KEY,
        // No auth for server-side/static generation
      })

// Initialize token from localStorage if available
if (typeof window !== 'undefined') {
  const existingToken = window.localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  if (existingToken && sdk.client && sdk.client.setToken) {
    sdk.client.setToken(existingToken)
  }
}

// Export a simple client config for direct fetch calls
export const medusaClient = {
  config: {
    baseUrl: BACKEND_URL,
    publishableKey: PUBLISHABLE_KEY,
  },
}
