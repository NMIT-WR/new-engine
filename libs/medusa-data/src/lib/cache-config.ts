export interface CacheStrategy {
  staleTime: number
  gcTime: number
  refetchOnWindowFocus: boolean
  refetchOnMount: boolean | 'always'
}

/**
 * Base cache strategies for common data patterns
 */
export const baseCacheConfig = {
  /**
   * Semi-static data (product catalogs, categories)
   * Changes infrequently, safe to cache for extended periods
   */
  semiStatic: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  /**
   * Realtime data (cart, inventory)
   * Must reflect server state quickly
   */
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: 'always' as const,
  },

  /**
   * User-specific data (auth, orders, addresses)
   * Balance between freshness and performance
   */
  userData: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },

  /**
   * Static data (regions, configuration)
   * Rarely changes, cache indefinitely
   */
  static: {
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
} as const

export type CacheConfigKey = keyof typeof baseCacheConfig

/**
 * Create cache config with optional overrides
 */
export function createCacheConfig<
  T extends Record<string, Partial<CacheStrategy>>,
>(overrides?: T): typeof baseCacheConfig & T {
  if (!overrides) {
    return baseCacheConfig as typeof baseCacheConfig & T
  }

  return {
    ...baseCacheConfig,
    ...overrides,
  } as typeof baseCacheConfig & T
}

/**
 * Get cache config with optional per-query overrides
 */
export function getCacheConfig(
  strategy: CacheConfigKey,
  overrides?: Partial<CacheStrategy>
): CacheStrategy {
  const base = baseCacheConfig[strategy]
  if (!overrides) {
    return base
  }
  return { ...base, ...overrides }
}
