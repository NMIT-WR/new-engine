// Centralized query keys for React Query
// This ensures consistent cache key structure across the app

export const queryKeys = {
  all: ['medusa'] as const,
  
  // Product-related queries with hierarchical structure
  products: {
    all: () => [...queryKeys.all, 'products'] as const,
    lists: () => [...queryKeys.products.all(), 'list'] as const,
    list: (params?: {
      page?: number
      limit?: number
      filters?: any  // Flexible to accommodate various filter types
      sort?: string
    }) => [...queryKeys.products.lists(), params || {}] as const,
    detail: (handle: string) => 
      [...queryKeys.products.all(), 'detail', handle] as const,
  },
  
  // Region queries
  regions: () => [...queryKeys.all, 'regions'] as const,
  
  // Cart queries
  cart: (id?: string) => [...queryKeys.all, 'cart', id] as const,
  
  // Authentication queries
  auth: {
    customer: () => [...queryKeys.all, 'auth', 'customer'] as const,
    session: () => [...queryKeys.all, 'auth', 'session'] as const,
  },
  
  // Category queries
  categories: () => [...queryKeys.all, 'categories'] as const,
  category: (handle: string) => [...queryKeys.categories(), handle] as const,
  allCategories: () => [...queryKeys.all, 'all-categories'] as const,
  
  // Collection queries
  collections: () => [...queryKeys.all, 'collections'] as const,
  
  // Home page specific queries
  homeProducts: () => [...queryKeys.all, 'home-products'] as const,
  
  // Order queries
  orders: {
    all: () => [...queryKeys.all, 'orders'] as const,
    list: (params?: {
      page?: number
      limit?: number
      status?: string[]
    }) => [...queryKeys.orders.all(), 'list', params || {}] as const,
    detail: (id: string) => [...queryKeys.orders.all(), 'detail', id] as const,
  },
  
  // Customer queries
  customer: {
    addresses: () => [...queryKeys.all, 'customer', 'addresses'] as const,
  },
  
  // Legacy aliases for backward compatibility
  product: (handle: string) => queryKeys.products.detail(handle),
} as const
