import type { ProductQueryParams } from './product-query-params'

export interface QueryKeysConfig {
  prefix: string
}

export function createQueryKeys(config: QueryKeysConfig) {
  const { prefix } = config

  return {
    all: [prefix] as const,

    regions: () => [prefix, 'regions'] as const,

    products: {
      all: () => [prefix, 'products'] as const,
      list: (params?: ProductQueryParams) =>
        [prefix, 'products', 'list', params || {}] as const,
      detail: (handle: string, regionId: string, countryCode: string) =>
        [prefix, 'products', 'detail', handle, regionId, countryCode] as const,
    },

    auth: {
      all: () => [prefix, 'auth'] as const,
      session: () => [prefix, 'auth', 'session'] as const,
    },

    orders: {
      all: () => [prefix, 'orders'] as const,
      list: (params?: { limit?: number; offset?: number }) =>
        [prefix, 'orders', 'list', params || {}] as const,
      detail: (id: string) => [prefix, 'orders', 'detail', id] as const,
    },

    cart: {
      all: () => [prefix, 'cart'] as const,
      active: () => [prefix, 'cart', 'active'] as const,
      shippingOptions: (cartId: string) =>
        [prefix, 'cart', 'shipping-options', cartId] as const,
    },

    payment: {
      all: () => [prefix, 'payment'] as const,
      providers: (regionId: string) =>
        [prefix, 'payment', 'providers', regionId] as const,
    },

    customer: {
      all: () => [prefix, 'customer'] as const,
      profile: () => [prefix, 'customer', 'profile'] as const,
    },
  } as const
}

export type QueryKeys = ReturnType<typeof createQueryKeys>
