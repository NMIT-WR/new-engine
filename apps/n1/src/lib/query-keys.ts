import type { ProductQueryParams } from './product-query-params'

export const queryKeys = {
  all: ['n1'] as const,

  regions: () => [...queryKeys.all, 'regions'] as const,

  products: {
    all: () => [...queryKeys.all, 'products'] as const,
    list: (params?: ProductQueryParams) =>
      [...queryKeys.products.all(), 'list', params || {}] as const,
  },
} as const
