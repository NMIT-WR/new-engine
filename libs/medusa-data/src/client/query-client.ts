import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query'

export interface QueryClientConfig {
  /** Default stale time for all queries (default: 60s) */
  defaultStaleTime?: number
  /** Whether to include pending queries in dehydration (default: true) */
  dehydratePending?: boolean
}

/**
 * Create a QueryClient with SSR-friendly defaults
 */
export function makeQueryClient(config: QueryClientConfig = {}): QueryClient {
  const { defaultStaleTime = 60 * 1000, dehydratePending = true } = config

  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: defaultStaleTime,
      },
      dehydrate: {
        // Include pending queries in dehydration for streaming SSR
        shouldDehydrateQuery: (query) =>
          dehydratePending
            ? defaultShouldDehydrateQuery(query) ||
              query.state.status === 'pending'
            : defaultShouldDehydrateQuery(query),
        // Don't redact errors - let framework handle them
        shouldRedactErrors: () => false,
      },
    },
  })
}

// Browser singleton
let browserQueryClient: QueryClient | undefined

/**
 * Get a QueryClient instance
 * - Server: Always creates a new client (per-request isolation)
 * - Browser: Returns singleton (preserves cache across navigation)
 */
export function getQueryClient(config: QueryClientConfig = {}): QueryClient {
  if (isServer) {
    // Server: always make a new query client per request
    return makeQueryClient(config)
  }

  // Browser: make a new query client if we don't already have one
  // This is important to avoid re-creating client if React suspends
  // during the initial render
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient(config)
  }

  return browserQueryClient
}

/**
 * Reset the browser QueryClient singleton
 * Useful for testing or logout scenarios
 */
export function resetBrowserQueryClient(): void {
  browserQueryClient = undefined
}
