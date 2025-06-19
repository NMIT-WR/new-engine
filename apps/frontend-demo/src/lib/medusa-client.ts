import Medusa from '@medusajs/js-sdk'

// Environment configuration
const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

// Create unified SDK instance
export const sdk = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  auth: {
    type: 'session',
  },
})

