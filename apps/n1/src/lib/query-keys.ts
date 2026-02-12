import type { ProductQueryParams } from "./product-query-params"

export const QUERY_KEY_NAMESPACE = "n1" as const

export const queryKeys = {
  all: [QUERY_KEY_NAMESPACE] as const,

  regions: () => [...queryKeys.all, "regions"] as const,

  products: {
    all: () => [...queryKeys.all, "products"] as const,
    list: (params?: ProductQueryParams) =>
      [...queryKeys.products.all(), "list", params || {}] as const,
    detail: (handle: string, regionId: string, countryCode: string) =>
      [
        ...queryKeys.products.all(),
        "detail",
        handle,
        regionId,
        countryCode,
      ] as const,
  },

  auth: {
    all: () => [...queryKeys.all, "auth"] as const,
    customer: () => [...queryKeys.auth.all(), "customer"] as const,
    session: () => [...queryKeys.auth.all(), "session"] as const,
  },

  orders: {
    all: () => [...queryKeys.all, "orders"] as const,
    list: (params?: { limit?: number; offset?: number }) =>
      [...queryKeys.orders.all(), "list", params || {}] as const,
    detail: (id: string) => [...queryKeys.orders.all(), "detail", id] as const,
  },

  cart: {
    all: () => [...queryKeys.all, "cart"] as const,
    active: (params?: { cartId?: string | null; regionId?: string | null }) =>
      params
        ? ([
            ...queryKeys.cart.all(),
            "active",
            params.cartId ?? null,
            params.regionId ?? null,
          ] as const)
        : ([...queryKeys.cart.all(), "active"] as const),
    detail: (cartId: string) => [...queryKeys.cart.all(), "detail", cartId] as const,
    shippingOptions: (cartId: string, cacheKey?: string) =>
      cacheKey
        ? ([
            ...queryKeys.checkout.all(),
            "shipping-options",
            cartId,
            cacheKey,
          ] as const)
        : ([...queryKeys.checkout.all(), "shipping-options", cartId] as const),
  },

  checkout: {
    all: () => [...queryKeys.all, "checkout"] as const,
    shippingOptions: (cartId: string, cacheKey?: string) =>
      queryKeys.cart.shippingOptions(cartId, cacheKey),
    paymentProviders: (regionId: string) =>
      [...queryKeys.checkout.all(), "payment-providers", regionId] as const,
  },

  // Backward-compatible alias
  payment: {
    all: () => queryKeys.checkout.all(),
    providers: (regionId: string) =>
      queryKeys.checkout.paymentProviders(regionId),
  },

  customer: {
    all: () => [...queryKeys.all, "customer"] as const,
    profile: () => [...queryKeys.all, "customer", "profile"] as const,
  },
} as const
