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
} as const
