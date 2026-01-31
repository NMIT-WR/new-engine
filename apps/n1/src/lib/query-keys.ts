import type { ProductQueryParams } from "./product-query-params"

export const queryKeys = {
  all: ["n1"] as const,

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
    shippingOptions: (cartId: string) =>
      [...queryKeys.cart.all(), "shipping-options", cartId] as const,
  },

  payment: {
    all: () => [...queryKeys.all, "payment"] as const,
    providers: (regionId: string) =>
      [...queryKeys.payment.all(), "providers", regionId] as const,
  },

  customer: {
    all: () => [...queryKeys.all, "customer"] as const,
    profile: () => [...queryKeys.all, "customer", "profile"] as const,
  },
} as const
