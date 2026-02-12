// Centralized query keys for React Query
// This ensures consistent cache key structure across the app

import { normalizeQueryKeyParams as sdNormalizeQueryKeyParams } from "@techsio/storefront-data"
import type { ProductFilters } from "@/services/product-service"

type NormalizeQueryKeyOptions = {
  omitKeys?: readonly string[]
}

const normalizeQueryKeyParams = (
  params?: Record<string, unknown>,
  options?: NormalizeQueryKeyOptions
) => {
  return sdNormalizeQueryKeyParams(
    (params ?? {}) as Record<string, unknown>,
    options
  )
}

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
      filters?: ProductFilters
      sort?: string
      fields?: string
      q?: string
      category_id?: string[]
      region_id?: string
      country_code?: string
    }) =>
      [
        ...queryKeys.products.lists(),
        normalizeQueryKeyParams(
          (params ?? {}) as Record<string, unknown>,
          { omitKeys: ["enabled"] }
        ),
      ] as const,
    infinite: (params?: {
      offset?: number
      limit?: number
      filters?: ProductFilters
      sort?: string
      q?: string
      category_id?: string[]
      region_id?: string
      country_code?: string
    }) =>
      [
        ...queryKeys.products.all(),
        "infinite",
        normalizeQueryKeyParams(
          (params ?? {}) as Record<string, unknown>,
          { omitKeys: ["enabled"] }
        ),
      ] as const,
    detail: (params: {
      handle: string
      region_id?: string
      country_code?: string
    }) =>
      [
        ...queryKeys.products.all(),
        "detail",
        params.handle,
        params.region_id,
        params.country_code,
      ] as const,
  },

  // Region queries
  regions: {
    all: () => [...queryKeys.all, "regions"] as const,
    list: (params?: { enabled?: boolean } & Record<string, unknown>) =>
      [
        ...queryKeys.regions.all(),
        "list",
        normalizeQueryKeyParams(
          (params ?? {}) as Record<string, unknown>,
          { omitKeys: ["enabled"] }
        ),
      ] as const,
    detail: (params: { id?: string; enabled?: boolean } & Record<string, unknown>) =>
      [
        ...queryKeys.regions.all(),
        "detail",
        normalizeQueryKeyParams(
          (params ?? {}) as Record<string, unknown>,
          { omitKeys: ["enabled"] }
        ),
      ] as const,
  },

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

  // Order queries - params match storefront-data
  orders: {
    all: () => [...queryKeys.all, "orders"] as const,
    list: (
      params?: {
        page?: number
        limit?: number
        status?: string[]
        enabled?: boolean
      } & Record<string, unknown>
    ) =>
      [
        ...queryKeys.orders.all(),
        "list",
        normalizeQueryKeyParams(
          (params ?? {}) as Record<string, unknown>,
          { omitKeys: ["enabled"] }
        ),
      ] as const,
    detail: (params: { id?: string }) =>
      [...queryKeys.orders.all(), "detail", params.id ?? ""] as const,
  },

  // Customer queries
  customer: {
    all: () => [...queryKeys.all, "customer"] as const,
    // Profile points to auth.customer - that's where customer data is stored
    profile: () => queryKeys.auth.customer(),
    addresses: (params?: { enabled?: boolean } & Record<string, unknown>) =>
      [
        ...queryKeys.all,
        "customer",
        "addresses",
        normalizeQueryKeyParams(
          (params ?? {}) as Record<string, unknown>,
          { omitKeys: ["enabled"] }
        ),
      ] as const,
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
    }) =>
      [
        ...queryKeys.checkout.all(),
        "shipping-option",
        normalizeQueryKeyParams(params, { omitKeys: ["enabled"] }),
      ] as const,
    paymentProviders: (regionId: string) =>
      [...queryKeys.checkout.all(), "payment-providers", regionId] as const,
  },

  // Legacy aliases for backward compatibility
  product: (handle: string, region_id?: string, country_code?: string) =>
    queryKeys.products.detail({ handle, region_id, country_code }),
} as const
