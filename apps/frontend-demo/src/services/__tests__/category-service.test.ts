import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CategoryService } from '../category-service'

vi.mock('@/lib/http-client', () => ({
  httpClient: {
    get: vi.fn(),
  },
}))

describe('CategoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCategories', () => {
    it('should fetch all categories with tree structure', async () => {
      const mockCategories = [
        {
          id: 'cat-1',
          name: 'Pánské',
          handle: 'panske',
          parent_category_id: null,
          category_children: [],
        },
        {
          id: 'cat-2',
          name: 'Dámské',
          handle: 'damske',
          parent_category_id: null,
          category_children: [],
        },
      ]

      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        product_categories: mockCategories,
      })

      const result = await CategoryService.getCategories()

      expect(httpClient.get).toHaveBeenCalledWith('/store/product-categories', {
        params: {
          include_descendants_tree: true,
          limit: 1000,
        },
      })

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Pánské')
    })
  })

  describe('getCategory', () => {
    it('should fetch single category by handle', async () => {
      const mockCategory = {
        id: 'cat-1',
        name: 'Pánské',
        handle: 'panske',
        product_count: 42,
      }

      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        product_categories: [mockCategory],
      })

      const result = await CategoryService.getCategory('panske')

      expect(httpClient.get).toHaveBeenCalledWith('/store/product-categories', {
        params: {
          handle: 'panske',
          include_descendants_tree: true,
        },
      })

      expect(result).toEqual(mockCategory)
    })

    it('should throw error if category not found', async () => {
      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        product_categories: [],
      })

      await expect(CategoryService.getCategory('non-existent')).rejects.toThrow(
        'Category not found'
      )
    })
  })

  describe('getRootCategories', () => {
    it('should return only root categories in correct order', async () => {
      const mockCategories = [
        { id: '1', name: 'Oblečení', parent_category_id: null },
        { id: '2', name: 'Pánské', parent_category_id: null },
        { id: '3', name: 'Dámské', parent_category_id: null },
        { id: '4', name: 'Trička', parent_category_id: '1' }, // child
        { id: '5', name: 'Random', parent_category_id: null },
      ]

      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        product_categories: mockCategories,
      })

      const result = await CategoryService.getRootCategories()

      // Should only include root categories
      expect(result).toHaveLength(4)

      // Should be in correct order
      expect(result[0].name).toBe('Pánské')
      expect(result[1].name).toBe('Dámské')
      expect(result[2].name).toBe('Oblečení')
      expect(result[3].name).toBe('Random') // others at the end
    })
  })

  describe('buildCategoryTree', () => {
    it('should build hierarchical tree from flat list', () => {
      const flatCategories = [
        { id: '1', name: 'Pánské', parent_category_id: null },
        { id: '2', name: 'Oblečení', parent_category_id: '1' },
        { id: '3', name: 'Trička', parent_category_id: '2' },
        { id: '4', name: 'Kalhoty', parent_category_id: '2' },
      ]

      const tree = CategoryService.buildCategoryTree(flatCategories as any)

      expect(tree).toHaveLength(1) // Only one root
      expect(tree[0].name).toBe('Pánské')
      expect(tree[0].children).toHaveLength(1)
      expect(tree[0].children![0].name).toBe('Oblečení')
      expect(tree[0].children![0].children).toHaveLength(2)
    })
  })

  describe('getCategoryPath', () => {
    it('should return breadcrumb path for category', async () => {
      const mockCategories = [
        { id: '1', name: 'Pánské', parent_category_id: null, handle: 'panske' },
        {
          id: '2',
          name: 'Oblečení',
          parent_category_id: '1',
          handle: 'obleceni',
        },
        { id: '3', name: 'Trička', parent_category_id: '2', handle: 'tricka' },
      ]

      const { httpClient } = await import('@/lib/http-client')
      vi.mocked(httpClient.get).mockResolvedValue({
        product_categories: mockCategories,
      })

      const path = await CategoryService.getCategoryPath('tricka')

      expect(path).toEqual([
        { id: '1', name: 'Pánské', handle: 'panske' },
        { id: '2', name: 'Oblečení', handle: 'obleceni' },
        { id: '3', name: 'Trička', handle: 'tricka' },
      ])
    })
  })
})
