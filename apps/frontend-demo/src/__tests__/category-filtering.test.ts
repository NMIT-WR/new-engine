import { CategoryService } from '@/services/category-service'
import { ProductService } from '@/services/product-service'
import { describe, expect, it, vi } from 'vitest'

// Mock the http client
vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}))

describe('Category Filtering', () => {
  it('should filter products by category ID', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Product 1',
        categories: [{ id: 'cat1', name: 'Category 1' }],
        variants: [{ prices: [{ amount: 100, currency_code: 'USD' }] }],
      },
      {
        id: '2',
        title: 'Product 2',
        categories: [{ id: 'cat2', name: 'Category 2' }],
        variants: [{ prices: [{ amount: 200, currency_code: 'USD' }] }],
      },
    ]

    const { httpClient } = await import('@/lib/http-client')
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      products: mockProducts,
      count: 1,
    })

    const result = await ProductService.getProducts({
      filters: { categories: ['cat1'] },
    })

    expect(httpClient.get).toHaveBeenCalledWith('/store/products', {
      params: expect.objectContaining({
        category_id: ['cat1'],
      }),
    })
  })

  it('should build category tree correctly', async () => {
    const mockCategories = [
      {
        id: 'root1',
        name: 'Root Category',
        handle: 'root',
        parent_category_id: null,
      },
      {
        id: 'child1',
        name: 'Child Category',
        handle: 'child',
        parent_category_id: 'root1',
      },
    ]

    const tree = CategoryService.buildCategoryTree(mockCategories)

    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe('root1')
    expect(tree[0].children).toHaveLength(1)
    expect(tree[0].children![0].id).toBe('child1')
  })

  it('should handle multiple category selection', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Product 1',
        categories: [{ id: 'cat1', name: 'Category 1' }],
        variants: [{ prices: [{ amount: 100, currency_code: 'USD' }] }],
      },
      {
        id: '2',
        title: 'Product 2',
        categories: [{ id: 'cat2', name: 'Category 2' }],
        variants: [{ prices: [{ amount: 200, currency_code: 'USD' }] }],
      },
      {
        id: '3',
        title: 'Product 3',
        categories: [{ id: 'cat1', name: 'Category 1' }],
        variants: [{ prices: [{ amount: 300, currency_code: 'USD' }] }],
      },
    ]

    const { httpClient } = await import('@/lib/http-client')
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      products: mockProducts,
      count: 3,
    })

    const result = await ProductService.getProducts({
      filters: { categories: ['cat1', 'cat2'] },
    })

    expect(httpClient.get).toHaveBeenCalledWith('/store/products', {
      params: expect.objectContaining({
        category_id: ['cat1', 'cat2'],
      }),
    })
  })

  it('should filter out products without prices', async () => {
    const mockProducts = [
      {
        id: '1',
        title: 'Product with price',
        variants: [{ prices: [{ amount: 100, currency_code: 'USD' }] }],
      },
      {
        id: '2',
        title: 'Product without price',
        variants: [{ prices: [] }],
      },
      {
        id: '3',
        title: 'Product without variants',
        variants: [],
      },
    ]

    const { httpClient } = await import('@/lib/http-client')
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      products: mockProducts,
      count: 3,
    })

    const result = await ProductService.getProducts()

    // Should only return product with price
    expect(result.products).toHaveLength(1)
    expect(result.products[0].id).toBe('1')
  })
})
