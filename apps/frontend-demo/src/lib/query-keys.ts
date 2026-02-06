// Centralized query keys for React Query
// This ensures consistent cache key structure across the app

export const queryKeys = {
  all: ["medusa"] as const,

  // Product-related queries with hierarchical structure
  // Params match storefront-data service params for direct usage
  products: {
    all: () => [...queryKeys.all, "products"] as const,
    lists: () => [...queryKeys.products.all(), "list"] as const,
    list: (params?: {
      offset?: number
      limit?: number
      filters?: any // Flexible to accommodate various filter types
      sort?: string
      fields?: string
      q?: string
      category_id?: string[]
      region_id?: string
    }) => [...queryKeys.products.lists(), params || {}] as const,
    infinite: (params?: {
      offset?: number
      limit?: number
      filters?: any
      sort?: string
      q?: string
      category_id?: string[]
      region_id?: string
    }) => [...queryKeys.products.all(), "infinite", params || {}] as const,
    detail: (params: { handle: string; region_id?: string }) =>
      [
        ...queryKeys.products.all(),
        "detail",
        params.handle,
        params.region_id,
      ] as const,
  },

  // Region queries
  regions: () => [...queryKeys.all, "regions"] as const,

  // Cart queries with hierarchical structure
  cart: {
    all: () => [...queryKeys.all, "cart"] as const,
    active: (params: { cartId?: string | null; regionId?: string | null }) =>
      [
        ...queryKeys.all,
        "cart",
        "active",
        params.cartId,
        params.regionId,
      ] as const,
    detail: (cartId: string) =>
      [...queryKeys.all, "cart", "detail", cartId] as const,
  },

  // Authentication queries
  auth: {
    all: () => [...queryKeys.all, "auth"] as const,
    customer: () => [...queryKeys.all, "auth", "customer"] as const,
    session: () => [...queryKeys.all, "auth", "session"] as const,
  },

  // Category queries
  categories: () => [...queryKeys.all, "categories"] as const,
  category: (handle: string) => [...queryKeys.categories(), handle] as const,
  allCategories: () => [...queryKeys.all, "all-categories"] as const,

  // Order queries - params match storefront-data
  orders: {
    all: () => [...queryKeys.all, "orders"] as const,
    list: (_params?: { page?: number; limit?: number; status?: string[] }) =>
      [...queryKeys.orders.all(), "list"] as const,
    detail: (params: { id?: string }) =>
      [...queryKeys.orders.all(), "detail", params.id ?? ""] as const,
  },

  // Customer queries
  customer: {
    all: () => [...queryKeys.all, "customer"] as const,
    // Profile points to auth.customer - that's where customer data is stored
    profile: () => queryKeys.auth.customer(),
    addresses: (params?: { enabled?: boolean } & Record<string, unknown>) => {
      const { enabled: _enabled, ...queryParams } = params ?? {}
      return [...queryKeys.all, "customer", "addresses", queryParams] as const
    },
  },

  // Fulfillment queries
  fulfillment: {
    cartOptions: (cartId: string) =>
      [...queryKeys.all, "fulfillment", "cart-options", cartId] as const,
  },

  // Checkout queries
  checkout: {
    all: () => [...queryKeys.all, "checkout"] as const,
    shippingOptions: (cartId: string, cacheKey?: string) =>
      cacheKey
        ? [
            ...queryKeys.checkout.all(),
            "shipping-options",
            cartId,
            cacheKey,
          ]
        : [...queryKeys.checkout.all(), "shipping-options", cartId],
    shippingOptionPrice: (params: {
      cartId: string
      optionId: string
      data?: Record<string, unknown>
    }) => [...queryKeys.checkout.all(), "shipping-option", params] as const,
    paymentProviders: (regionId: string) =>
      [...queryKeys.checkout.all(), "payment-providers", regionId] as const,
  },

  // Legacy aliases for backward compatibility
  product: (handle: string, region_id?: string) =>
    queryKeys.products.detail({ handle, region_id }),
} as const
