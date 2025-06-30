import { sdk } from '@/lib/medusa-client'
import type { Product } from '@/types/product'

export interface ProductFilters {
  categories?: string[]
  priceRange?: [number, number]
  sizes?: string[]
  colors?: string[]
  onSale?: boolean
  search?: string
}

export interface ProductListParams {
  limit?: number
  offset?: number
  filters?: ProductFilters
  sort?: string
}

export interface ProductListResponse {
  products: Product[]
  count: number
  limit: number
  offset: number
}

export interface HomePageProducts {
  featured: Product[]
  newArrivals: Product[]
  trending: Product[]
}

export class ProductService {
  static readonly DEFAULT_FIELDS = [
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
  static async getProducts(
    params: ProductListParams = {}
  ): Promise<ProductListResponse> {
    const { limit = 20, offset = 0, filters, sort } = params

    const queryParams: Record<string, any> = {
      limit,
      offset,
      fields: this.DEFAULT_FIELDS,
    }

    // Apply filters
    if (filters) {
      if (filters.categories?.length) {
        queryParams.category_id = filters.categories
      }

      if (filters.priceRange) {
        // Note: Medusa v2 might not support price filtering via query params
        // We'll need to filter client-side for now
        // const [min, max] = filters.priceRange
        // queryParams['variants.prices.amount'] = `gte:${min * 100},lte:${max * 100}`
      }

      if (filters.search) {
        queryParams.q = filters.search
      }

      if (filters.onSale) {
        queryParams.tags = 'sale'
      }

      // Note: Size and color filtering might need to be done client-side
      // as Medusa doesn't have built-in variant option filtering
    }

    if (sort) {
      // Map our sort values to Medusa API format
      const sortMap: Record<string, string> = {
        newest: '-created_at',
        'price-asc': 'variants.prices.amount',
        'price-desc': '-variants.prices.amount',
        'name-asc': 'title',
        'name-desc': '-title',
      }
      queryParams.order = sortMap[sort] || sort
    }

    try {
      const response = await sdk.store.product.list(queryParams)

      if (!response.products) {
        console.error('[ProductService] Invalid response structure:', response)
        return { products: [], count: 0, limit, offset }
      }

      const products = response.products.map((p) => this.transformProduct(p))

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
   * Fetch a single product by handle
   */
  static async getProduct(handle: string): Promise<Product> {
    const response = await sdk.store.product.list({
      handle,
      fields: this.DEFAULT_FIELDS,
      limit: 1,
    })

    if (!response.products?.length) {
      throw new Error('Product not found')
    }

    return this.transformProduct(response.products[0])
  }

  /**
   * Get products for homepage sections
   */
  static async getHomePageProducts(): Promise<HomePageProducts> {
    const response = await this.getProducts({ limit: 12 })

    const allProducts = response.products

    // For now, simple split logic
    // In production, you might want to use tags, collections, or metadata
    const featured = allProducts.slice(0, 4)
    const newArrivals = allProducts.slice(4, 8)
    const trending = allProducts.slice(8, 12)

    return {
      featured,
      newArrivals,
      trending,
    }
  }

  /**
   * Transform raw product data from API
   */
  static transformProduct(product: any): Product {
    if (!product) {
      throw new Error('Cannot transform null product')
    }

    // Get primary variant (first one)
    const primaryVariant = product.variants?.[0]

    // Get price from primary variant
    const price = primaryVariant?.prices?.[0]

    // Since Store API doesn't provide real inventory data, we can't determine stock status
    // We'll default to true and let the detailed product page handle variant-specific availability
    const inStock = true

    return {
      ...product,
      thumbnail: product.thumbnail,
      images:
        product.images?.map((img: any) => ({
          ...img,
          url: img.url,
        })) || [],
      // Add computed properties
      inStock,
      price,
      primaryVariant,
    } as Product
  }
}
