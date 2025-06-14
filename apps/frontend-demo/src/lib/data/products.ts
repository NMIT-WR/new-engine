import { sdk } from '@/lib/medusa-client'

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
