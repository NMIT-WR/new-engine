import { sdk } from '@/lib/medusa-client'
import type { Product } from '@/types/product'
import { buildMedusaQuery } from '@/utils/server-filters'
import { ImageResponse } from 'next/server'

export interface ProductFilters {
  categories?: string[]
  sizes?: string[]
  search?: string
}

export interface ProductListParams {
  limit?: number
  offset?: number
  fields?: string
  filters?: ProductFilters
  category?: string | string[]
  sort?: string
  q?: string
}

export interface ProductListResponse {
  products: Product[]
  count: number
  limit: number
  offset: number
}


  const ALL_FIELDS = [
    'id',
    'title',
    'handle',
    'description',
    'subtitle',
    'status',
    'external_id',
    'thumbnail',
    'weight',
    'length',
    'height',
    'width',
    'hs_code',
    'origin_country',
    'mid_code',
    'material',
    'collection_id',
    'type_id',
    'created_at',
    'updated_at',
    'deleted_at',
    'metadata',
    'tags.*',
    'images.*',
    'options.*',
    'profiles.*',
    'categories.*',
    'collection.*',
    'type.*',
    'variants.*',
    'variants.prices.*',
    'variants.calculated_price.*',
    'variants.options.*',
    'variants.inventory_items.*',
    'sales_channels.*'
  ].join(',')

  // Fields for product list views (minimal data)
  const LIST_FIELDS = [
    'id',
    'title',
    'handle',
    'thumbnail',
    '*variants.calculated_price',
    'variants.inventory_quantity',
    'variants.manage_inventory',
  ].join(',')

  // Fields for product detail views (all data)
  const DETAIL_FIELDS = [
    'id',
    'title',
    'handle',
    'description',
    'thumbnail',
    'status',
    'collection_id',
    'created_at',
    'updated_at',
    'tags',
    'images.id',
    'images.url',
    'categories.id',
    'categories.name',
    'categories.handle',
    'variants.id',
    'variants.title',
    'variants.sku',
    'variants.manage_inventory',
    'variants.allow_backorder',
    '+variants.inventory_quantity',
    'variants.prices.amount',
    'variants.prices.currency_code',
    'variants.prices.calculated_price',
    'variants.options',
  ].join(',')

  /**
   * Fetch products with filtering, pagination and sorting
   */
  export const getProducts = async (
    params: ProductListParams = {}
  ): Promise<ProductListResponse> => {
    const { limit = 20, offset = 0, filters, category, fields = LIST_FIELDS,sort, q } = params

    // Build base query
    const baseQuery: Record<string, any> = {
      limit,
      offset,
      q,
      category_id: category,
      fields: fields,
      region_id: 'reg_01JYERR9Q8RA3MZXC0M310DDPZ'
    }

    // Add sorting
    if (sort) {
      const sortMap: Record<string, string> = {
        newest: '-created_at',
        'price-asc': 'variants.prices.amount',
        'price-desc': '-variants.prices.amount',
        'name-asc': 'title',
        'name-desc': '-title',
      }
      baseQuery.order = sortMap[sort] || sort
    }

    // Build query with server-side filters
    const queryParams = buildMedusaQuery(filters, baseQuery)

    try {
      const response = await sdk.store.product.list(queryParams)

      if (!response.products) {
        console.error('[ProductService] Invalid response structure:', response)
        return { products: [], count: 0, limit, offset }
      }

      const products = response.products.map((p) => transformProduct(p))

      return {
        products,
        count: response.count || products.length,
        limit,
        offset,
      }
    } catch (error) {
      console.error('[ProductService] Error fetching products:', error)
      throw error
    }
  }


  /**
   * Transform raw product data from API
   */
const transformProduct =(product: any, withVariants?: boolean): Product => {
    if (!product) {
      throw new Error('Cannot transform null product')
    }

    // Get primary variant (first one)
    const primaryVariant = product.variants?.[0]

    // Get price from primary variant
    const price = primaryVariant?.calculated_price?.calculated_amount

    // Since Store API doesn't provide real inventory data, we can't determine stock status
    // We'll default to true and let the detailed product page handle variant-specific availability
    const inStock = true

    const reducedImages = product.images && product.images.length > 2 && product.images.slice(0,2)

    // Remove variants array from the result to reduce payload size
    const { variants, ...productWithoutVariants } = product

    const result = withVariants ? product : productWithoutVariants

    return {
      ...result,
      thumbnail: product.thumbnail,
      images: reducedImages || product.images,
      inStock,
      price,
      primaryVariant,
    } as Product
}


export async function getProduct(handle: string): Promise<Product> {
  const response = await sdk.store.product.list({
    handle,
    fields: DETAIL_FIELDS, // Use full fields for detail views
    limit: 1,
  })

  if (!response.products?.length) {
    throw new Error('Product not found')
  }

  return transformProduct(response.products[0], true)
}
