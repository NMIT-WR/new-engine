/**
 * Centralized cache configuration for React Query
 *
 * staleTime: How long data is considered fresh (no refetch needed)
 * gcTime: How long unused data stays in cache (formerly cacheTime)
 */

export const cacheConfig = {
// categories, regions
  static: {
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  categories: {
    staleTime: Infinity, 
    gcTime: Infinity, 
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  },

  // product catalog, shipping options
  semiStatic: {
    staleTime: 60 * 60 * 1000, 
    gcTime: 24 * 60 * 60 * 1000, 
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  },

  // product detail, search
  dynamic: {
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, 
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  },

  // Real-time data (cart, inventory)
  realtime: {
    staleTime: 30 * 1000, 
    gcTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  },

  // User-specific data (profile, preferences)
  user: {
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  },

  // No cache (sensitive data)
  noCache: {
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  },
} as const

/**
 * Helper to get cache config with custom overrides
 */
export function getCacheConfig(
  type: keyof typeof cacheConfig,
  overrides?: Partial<(typeof cacheConfig)[keyof typeof cacheConfig]>
) {
  return {
    ...cacheConfig[type],
    ...overrides,
  }
}

/**
 * Network-aware cache config
 */
export function getNetworkAwareCacheConfig(type: keyof typeof cacheConfig) {
  if (typeof window === 'undefined') return cacheConfig[type]

  // Check for slow connection
  const connection = (navigator as any).connection
  if (connection) {
    const slowConnections = ['slow-2g', '2g', '3g']
    const isSlowNetwork = slowConnections.includes(connection.effectiveType)

    if (isSlowNetwork) {
      // Double cache times for slow networks
      return {
        ...cacheConfig[type],
        staleTime: cacheConfig[type].staleTime * 2,
        gcTime: cacheConfig[type].gcTime * 2,
      }
    }
  }

  return cacheConfig[type]
}
