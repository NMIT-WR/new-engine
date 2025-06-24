import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProductService } from '../product-service'

// Mock httpClient
vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}))

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should fetch products with default parameters', async () => {
      const mockProducts = [
        { id: '1', title: 'Product 1', handle: 'product-1' },
        { id: '2', title: 'Product 2', handle: 'product-2' },
      ]

      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        products: mockProducts,
        count: 2,
        limit: 20,
        offset: 0,
      })

      const result = await ProductService.getProducts()

      expect(httpClient.get).toHaveBeenCalledWith('/store/products', {
        params: {
          limit: 20,
          offset: 0,
          include: 'categories,variants.prices,images',
          fields: ProductService.DEFAULT_FIELDS,
        },
      })

      expect(result.products).toHaveLength(2)
      expect(result.products[0]).toHaveProperty('title', 'Product 1')
    })

    it('should apply filters when provided', async () => {
      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        products: [],
        count: 0,
      })

      await ProductService.getProducts({
        filters: {
          categories: ['cat-1', 'cat-2'],
          priceRange: [10, 100],
        },
        limit: 50,
      })

      expect(httpClient.get).toHaveBeenCalledWith('/store/products', {
        params: expect.objectContaining({
          limit: 50,
          category_id: ['cat-1', 'cat-2'],
          'variants.prices.amount': 'gte:1000,lte:10000', // cents
        }),
      })
    })
  })

  describe('getProduct', () => {
    it('should fetch a single product by handle', async () => {
      const mockProduct = {
        id: '1',
        title: 'Test Product',
        handle: 'test-product',
        variants: [{ id: 'var-1', prices: [{ amount: 1000 }] }],
      }

      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        products: [mockProduct],
      })

      const result = await ProductService.getProduct('test-product')

      expect(httpClient.get).toHaveBeenCalledWith('/store/products', {
        params: {
          handle: 'test-product',
          include: 'categories,variants.prices,images',
          fields: ProductService.DEFAULT_FIELDS,
        },
      })

      expect(result).toEqual(mockProduct)
    })

    it('should throw error if product not found', async () => {
      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        products: [],
      })

      await expect(ProductService.getProduct('non-existent')).rejects.toThrow(
        'Product not found'
      )
    })
  })

  describe('transformProduct', () => {
    it('should transform product data correctly', () => {
      const rawProduct = {
        id: 'prod-1',
        title: 'Test Product',
        handle: 'test-product',
        thumbnail: 'http://minio.example.com/image.jpg',
        variants: [
          {
            id: 'var-1',
            prices: [
              {
                amount: 1000,
                currency_code: 'USD',
                calculated_price: 900,
              },
            ],
            inventory_quantity: 10,
          },
        ],
        categories: [],
      }

      const transformed = ProductService.transformProduct(rawProduct as any)

      expect(transformed).toMatchObject({
        id: 'prod-1',
        title: 'Test Product',
        thumbnail: expect.stringContaining('medusa-13d1-9000'), // URL fixed
        inStock: true,
        price: {
          amount: 1000,
          calculated_price: 900,
          currency_code: 'USD',
        },
      })
    })

    it('should handle products without categories', () => {
      const productWithoutCategory = {
        id: 'prod-1',
        title: 'No Category Product',
        categories: [],
      }

      const transformed = ProductService.transformProduct(
        productWithoutCategory as any
      )

      // Should not add fallback category anymore
      expect(transformed.categories).toEqual([])
    })
  })

  describe('getHomePageProducts', () => {
    it('should return categorized products for homepage', async () => {
      const mockProducts = Array.from({ length: 20 }, (_, i) => ({
        id: `prod-${i}`,
        title: `Product ${i}`,
        handle: `product-${i}`,
      }))

      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        products: mockProducts,
      })

      const result = await ProductService.getHomePageProducts()

      expect(result.featured).toHaveLength(4)
      expect(result.newArrivals).toHaveLength(4)
      expect(result.trending).toHaveLength(4)

      // Should be different products in each section
      const allIds = [
        ...result.featured.map((p) => p.id),
        ...result.newArrivals.map((p) => p.id),
        ...result.trending.map((p) => p.id),
      ]
      const uniqueIds = new Set(allIds)
      expect(uniqueIds.size).toBe(12)
    })
  })

  describe('searchProducts', () => {
    it('should search products by query', async () => {
      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        products: [],
        count: 0,
      })

      await ProductService.searchProducts('test query')

      expect(httpClient.get).toHaveBeenCalledWith('/store/products', {
        params: expect.objectContaining({
          q: 'test query',
        }),
      })
    })
  })
})
