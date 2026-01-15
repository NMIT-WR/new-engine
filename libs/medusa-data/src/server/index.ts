export { getQueryClient } from './get-query-client'
export {
  createServerPrefetch,
  type ServerPrefetchConfig,
  type ServerPrefetch,
} from './prefetch'

// Re-export dehydrate and HydrationBoundary for convenience
export { dehydrate, HydrationBoundary } from '@tanstack/react-query'
