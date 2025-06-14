/**
 * Centralized cache configuration for React Query
 *
 * staleTime: How long data is considered fresh (no refetch needed)
 * gcTime: How long unused data stays in cache (formerly cacheTime)
 */

export const cacheConfig = {
  // Dlouhodobě stabilní data (categories, regions)
  static: {
    staleTime: 24 * 60 * 60 * 1000, // 24 hodin
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 dní
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  // Občas se měnící data (product catalog, shipping options)
  semiStatic: {
    staleTime: 60 * 60 * 1000, // 1 hodina
    gcTime: 24 * 60 * 60 * 1000, // 24 hodin
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  },

  // Často se měnící data (product detail, search)
  dynamic: {
    staleTime: 5 * 60 * 1000, // 5 minut
    gcTime: 30 * 60 * 1000, // 30 minut
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  },

  // Real-time data (cart, inventory)
  realtime: {
    staleTime: 30 * 1000, // 30 sekund
    gcTime: 5 * 60 * 1000, // 5 minut
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  },

  // User-specific data (profile, preferences)
  user: {
    staleTime: 0, // Vždy stale
    gcTime: 10 * 60 * 1000, // 10 minut
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
