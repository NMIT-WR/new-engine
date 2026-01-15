import { cache } from 'react'
import { makeQueryClient, type QueryClientConfig } from '../client/query-client'

/**
 * Get a per-request QueryClient for Server Components
 * Uses React's cache() to ensure the same client is used throughout a request
 */
export const getQueryClient = cache((config?: QueryClientConfig) =>
  makeQueryClient(config)
)
