import { httpClient } from '@/lib/http-client'
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
        // Convert to cents and format for Medusa
        const [min, max] = filters.priceRange
        // Note: Medusa v2 might not support price filtering via query params
        // We'll need to filter client-side for now
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
      const response = await httpClient.get<{ products: any[]; count: number }>(
        '/store/products',
        { params: queryParams }
      )

      if (!response.products) {
        console.error('[ProductService] Invalid response structure:', response)
        return { products: [], count: 0, limit, offset }
      }

      const products = response.products.map((p) => this.transformProduct(p))

      // Don't filter out products without prices - just show them
      console.log('[ProductService] Total products:', products.length)
      console.log('[ProductService] Products with prices:', products.filter(p => 
        p.variants?.some((v: any) => v.prices?.length > 0)
      ).length)

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
    const response = await httpClient.get<{ products: any[] }>(
      '/store/products',
      {
        params: {
          handle,
          fields: this.DEFAULT_FIELDS,
        },
      }
    )

    if (!response.products?.length) {
      throw new Error('Product not found')
    }

    return this.transformProduct(response.products[0])
  }

  /**
   * Get products for homepage sections
   */
  static async getHomePageProducts(): Promise<HomePageProducts> {
    // Fetch products with specific tags or latest products
    const response = await this.getProducts({ limit: 100 })

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
   * Search products
   */
  static async searchProducts(query: string, limit = 20): Promise<Product[]> {
    const response = await this.getProducts({
      filters: { search: query },
      limit,
    })

    return response.products
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(
    productId: string,
    limit = 4
  ): Promise<Product[]> {
    // For now, just get random products
    // In production, use ML or category-based recommendations
    const response = await this.getProducts({ limit })
    return response.products.filter((p) => p.id !== productId).slice(0, limit)
  }

  /**
   * Transform raw product data from API
   */
  static transformProduct(product: any): Product {
    if (!product) {
      throw new Error('Cannot transform null product')
    }

    // Fix image URLs if they're using internal MinIO URLs
    const fixImageUrl = (url?: string) => {
      if (!url) return url
      return url.replace(
        'http://minio:9000/medusa-media',
        'https://medusa-13d1-9000.prg1.zerops.app/uploads'
      )
    }

    // Get primary variant (first one)
    const primaryVariant = product.variants?.[0]

    // Get price from primary variant
    const price = primaryVariant?.prices?.[0]

    // Check stock status
    const inStock =
      product.variants?.some((v: any) => v.inventory_quantity > 0) ?? false

    return {
      ...product,
      thumbnail: fixImageUrl(product.thumbnail),
      images:
        product.images?.map((img: any) => ({
          ...img,
          url: fixImageUrl(img.url),
        })) || [],
      // Add computed properties
      inStock,
      price,
      primaryVariant,
    } as Product
  }
}
