// Centralized query keys for React Query
// This ensures consistent cache key structure across the app

export const queryKeys = {
  all: ['medusa'] as const,
  regions: () => [...queryKeys.all, 'regions'] as const,
  products: (regionId?: string, filters?: any) =>
    [...queryKeys.all, 'products', { regionId, filters }] as const,
  product: (handle: string, regionId?: string) =>
    [...queryKeys.products(regionId), handle] as const,
  categories: () => [...queryKeys.all, 'categories'] as const,
  category: (handle: string) => [...queryKeys.categories(), handle] as const,
  cart: (id?: string) => [...queryKeys.all, 'cart', id] as const,
  auth: {
    customer: () => [...queryKeys.all, 'auth', 'customer'] as const,
    session: () => [...queryKeys.all, 'auth', 'session'] as const,
  },
  collections: () => [...queryKeys.all, 'collections'] as const,
} as const
