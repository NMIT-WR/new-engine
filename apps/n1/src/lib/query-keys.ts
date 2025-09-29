export const queryKeys = {
  all: ['n1'] as const,

  regions: () => [...queryKeys.all, 'regions'] as const,

  products: {
    all: () => [...queryKeys.all, 'products'] as const,
    list: (params?: {
      category_id?: string[]
      region_id?: string
      country_code?: string
      limit?: number
      offset?: number
      fields?: string
    }) => [...queryKeys.products.all(), 'list', params || {}] as const,
  },
} as const
