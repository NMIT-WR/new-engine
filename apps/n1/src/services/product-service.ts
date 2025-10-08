import { PRODUCT_DETAILED_FIELDS } from '@/lib/constants'
import { sdk } from '@/lib/medusa-client'
import type { ProductQueryParams } from '@/lib/product-query-params'
import type { StoreProduct } from '@medusajs/types'

export interface ProductListResponse {
  products: StoreProduct[]
  count: number
  limit: number
  offset: number
}

export interface ProductDetailParams {
  handle: string
  region_id?: string
  country_code?: string
  fields?: string
}

export async function getProducts(
  params: ProductQueryParams
): Promise<ProductListResponse> {
  const { category_id, region_id, country_code, limit, offset, fields } = params

  try {
    const response = await sdk.store.product.list({
      limit,
      offset,
      fields,
      country_code,
      region_id,
      category_id,
    })

    return {
      products: response.products || [],
      count: response.count || 0,
      limit: limit || 0,
      offset: offset || 0,
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ProductService] Failed to fetch products:', err)
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Failed to fetch products: ${message}`)
  }
}

export async function getProductByHandle(
  params: ProductDetailParams
): Promise<StoreProduct | null> {
  const { handle, region_id, country_code } = params

  try {
    const response = await sdk.store.product.list({
      handle,
      limit: 1,
      fields: PRODUCT_DETAILED_FIELDS,
      country_code,
      region_id,
    })

    return response.products?.[0] || null
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ProductService] Failed to fetch product by handle:', err)
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Failed to fetch product: ${message}`)
  }
}
