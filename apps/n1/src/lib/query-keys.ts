import type { ProductQueryParams } from './product-query-params'

export const queryKeys = {
  all: ['n1'] as const,

  regions: () => [...queryKeys.all, 'regions'] as const,

  products: {
    all: () => [...queryKeys.all, 'products'] as const,
    list: (params?: ProductQueryParams) =>
      [...queryKeys.products.all(), 'list', params || {}] as const,
    detail: (handle: string, regionId: string, countryCode: string) =>
      [...queryKeys.products.all(), 'detail', handle, regionId, countryCode] as const,
  },

  auth: {
    all: () => [...queryKeys.all, 'auth'] as const,
    session: () => [...queryKeys.auth.all(), 'session'] as const,
    customer: (customerId?: string) =>
      customerId
        ? ([...queryKeys.auth.all(), 'customer', customerId] as const)
        : ([...queryKeys.auth.all(), 'customer'] as const),
  },

  orders: {
    all: () => [...queryKeys.all, 'orders'] as const,
    list: () => [...queryKeys.orders.all(), 'list'] as const,
    detail: (id: string) => [...queryKeys.orders.all(), 'detail', id] as const,
  },

  cart: {
    all: () => [...queryKeys.all, 'cart'] as const,
    active: () => [...queryKeys.cart.all(), 'active'] as const,
  },

  customer: {
    all: () => [...queryKeys.all, 'customer'] as const,
    addresses: (customerId?: string) =>
      customerId
        ? ([...queryKeys.customer.all(), 'addresses', customerId] as const)
        : ([...queryKeys.customer.all(), 'addresses'] as const),
  },
} as const
