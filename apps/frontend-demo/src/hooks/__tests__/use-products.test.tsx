import { ProductService } from '@/services/product-service'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHomeProducts, useProduct, useProducts } from '../use-products'

// Mock ProductService
vi.mock('@/services/product-service', () => ({
  ProductService: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    getHomePageProducts: vi.fn(),
    transformProduct: vi.fn((p) => p),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Product Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useProducts', () => {
    it('should fetch products with default parameters', async () => {
      const mockResponse = {
        products: [
          { id: '1', title: 'Product 1' },
          { id: '2', title: 'Product 2' },
        ],
        count: 2,
        limit: 20,
        offset: 0,
      }

      vi.mocked(ProductService.getProducts).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(ProductService.getProducts).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
      })

      expect(result.current.products).toHaveLength(2)
      expect(result.current.totalCount).toBe(2)
      expect(result.current.hasNextPage).toBe(false)
    })

    it('should handle pagination correctly', async () => {
      const mockResponse = {
        products: Array(20).fill({ id: '1', title: 'Product' }),
        count: 100,
        limit: 20,
        offset: 0,
      }

      vi.mocked(ProductService.getProducts).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useProducts({ page: 2, limit: 20 }), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(ProductService.getProducts).toHaveBeenCalledWith({
        limit: 20,
        offset: 20, // page 2 = offset 20
      })

      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.hasPrevPage).toBe(true)
    })

    it('should handle filters', async () => {
      vi.mocked(ProductService.getProducts).mockResolvedValue({
        products: [],
        count: 0,
      })

      const filters = {
        categories: ['cat-1'],
        priceRange: [10, 50] as [number, number],
        search: 'test',
      }

      renderHook(() => useProducts({ filters }), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(ProductService.getProducts).toHaveBeenCalledWith({
          filters,
          limit: 20,
          offset: 0,
        })
      })
    })
  })

  describe('useProduct', () => {
    it('should fetch single product by handle', async () => {
      const mockProduct = {
        id: '1',
        title: 'Test Product',
        handle: 'test-product',
      }

      vi.mocked(ProductService.getProduct).mockResolvedValue(mockProduct)

      const { result } = renderHook(() => useProduct('test-product'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(ProductService.getProduct).toHaveBeenCalledWith('test-product')
      expect(result.current.product).toEqual(mockProduct)
    })

    it('should not fetch if handle is not provided', () => {
      renderHook(() => useProduct(''), {
        wrapper: createWrapper(),
      })

      expect(ProductService.getProduct).not.toHaveBeenCalled()
    })
  })

  describe('useHomeProducts', () => {
    it('should fetch categorized products for homepage', async () => {
      const mockResponse = {
        featured: [{ id: '1', title: 'Featured 1' }],
        newArrivals: [{ id: '2', title: 'New 1' }],
        trending: [{ id: '3', title: 'Trending 1' }],
      }

      vi.mocked(ProductService.getHomePageProducts).mockResolvedValue(
        mockResponse
      )

      const { result } = renderHook(() => useHomeProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.featured).toEqual(mockResponse.featured)
      expect(result.current.newArrivals).toEqual(mockResponse.newArrivals)
      expect(result.current.trending).toEqual(mockResponse.trending)
    })
  })
})
