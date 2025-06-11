import { sdk } from '@/lib/medusa-client'
import { useQuery } from '@tanstack/react-query'

// Fetch functions
export async function fetchProducts(params: {
  limit?: number
  offset?: number
  category_id?: string[]
  q?: string
}) {
  const { products, count, limit, offset } = await sdk.store.product.list({
    ...params,
    fields: '*variants.calculated_price,*categories',
  })

  return {
    products,
    count,
    pageInfo: {
      limit,
      offset,
      hasNext: offset + limit < count,
      hasPrev: offset > 0,
    },
  }
}

// React Query hooks
export function useProducts(params: Parameters<typeof fetchProducts>[0] = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
  })
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const { products } = await sdk.store.product.list({
        handle,
        fields: '*variants.calculated_price,*categories,*images',
      })
      return products[0] || null
    },
    enabled: !!handle,
  })
}
