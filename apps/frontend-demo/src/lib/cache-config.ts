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
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
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
    refetchOnMount: "always",
  },

  // User-specific data (profile, preferences)
  userData: {
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  },

  // No cache (sensitive data)
  noCache: {
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  },
} as const
