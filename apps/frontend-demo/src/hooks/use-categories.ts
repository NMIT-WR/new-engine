'use client'

import { cacheConfig } from '@/lib/cache-config'
import { httpClient } from '@/lib/http-client'
import { queryKeys } from '@/lib/query-keys'
import type { Category } from '@/types/product'
import { ROOT_CATEGORY_ORDER } from '@/utils/category-utils'
import { useQuery } from '@tanstack/react-query'

export interface CategoryWithStats extends Category {
  count: number
  description?: string
  parent_category_id?: string
  category_children?: any[]
}

export interface CategoryTreeNode {
  id: string
  name: string
  handle: string
  description?: string
  children?: CategoryTreeNode[]
}

function transformCategory(medusaCategory: any): CategoryWithStats {
  return {
    id: medusaCategory.id,
    name: medusaCategory.name,
    handle: medusaCategory.handle,
    count: medusaCategory.product_count || 0,
    description: medusaCategory.description || undefined,
    parent_category_id: medusaCategory.parent_category_id,
    category_children: medusaCategory.category_children,
  }
}

/**
 * Hook for fetching all categories (lightweight version - only essential fields)
 */
export function useCategories() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      const data = await httpClient.get<{ product_categories: any[] }>(
        '/store/product-categories',
        {
          params: {
            limit: 1000, // Get all categories at once
            fields: 'id,name,handle,parent_category_id,description', // Only essential fields
          },
        }
      )
      return (data.product_categories || []).map(transformCategory)
    },
    staleTime: cacheConfig.static.staleTime,
    gcTime: cacheConfig.static.gcTime,
  })

  return {
    categories,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

/**
 * Hook for fetching all categories with full details (includes metadata, children, etc.)
 */
export function useDetailedCategories() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.categories(), 'detailed'],
    queryFn: async () => {
      const data = await httpClient.get<{ product_categories: any[] }>(
        '/store/product-categories',
        {
          params: {
            limit: 1000, // Get all categories at once
            // No field selection - get all data
          },
        }
      )
      return (data.product_categories || []).map(transformCategory)
    },
    staleTime: cacheConfig.static.staleTime,
    gcTime: cacheConfig.static.gcTime,
  })

  return {
    categories,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

/**
 * Hook for fetching root categories in correct order
 */
export function useRootCategories() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.categories(), 'root'],
    queryFn: async () => {
      const data = await httpClient.get<{ product_categories: any[] }>(
        '/store/product-categories',
        {
          params: {
            limit: 1000, // Get all categories at once
            fields: 'id,name,handle,parent_category_id,description', // Only essential fields
          },
        }
      )
      const allCategories = (data.product_categories || []).map(transformCategory)
      
      // Filter root categories
      const rootCategories = allCategories.filter(
        (cat) => !cat.parent_category_id
      )

      // Sort according to preferred order
      return rootCategories.sort((a, b) => {
        const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
        const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB
        }

        if (indexA !== -1) return -1
        if (indexB !== -1) return 1

        return a.name.localeCompare(b.name)
      })
    },
    staleTime: cacheConfig.static.staleTime,
    gcTime: cacheConfig.static.gcTime,
  })

  return {
    categories,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

/**
 * Hook for fetching single category by handle
 */
export function useCategory(handle: string) {
  const {
    data: category = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.category(handle),
    queryFn: async () => {
      const data = await httpClient.get<{ product_categories: any[] }>(
        '/store/product-categories',
        {
          params: {
            handle,
          },
        }
      )
      const categories = data.product_categories || []

      if (categories.length === 0) {
        throw new Error('Category not found')
      }

      return transformCategory(categories[0])
    },
    enabled: !!handle,
    staleTime: cacheConfig.static.staleTime,
    gcTime: cacheConfig.static.gcTime,
  })

  return {
    category,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

/**
 * Build hierarchical tree structure from flat category list
 */
function buildCategoryTree(categories: CategoryWithStats[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>()
  const rootNodes: CategoryTreeNode[] = []

  // First pass: create all nodes
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      children: [],
    })
  })

  // Second pass: build tree structure
  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id)!

    if (cat.parent_category_id) {
      const parent = categoryMap.get(cat.parent_category_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    } else {
      rootNodes.push(node)
    }
  })

  // Sort root nodes according to preferred order
  return rootNodes.sort((a, b) => {
    const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
    const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    return a.name.localeCompare(b.name)
  })
}

/**
 * Hook for building category tree
 */
export function useCategoryTree() {
  const {
    data: tree = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.categories(), 'tree'],
    queryFn: async () => {
      const data = await httpClient.get<{ product_categories: any[] }>(
        '/store/product-categories',
        {
          params: {
            limit: 1000, // Get all categories at once
            fields: 'id,name,handle,parent_category_id,description', // Only essential fields
          },
        }
      )
      const categories = (data.product_categories || []).map(transformCategory)
      return buildCategoryTree(categories)
    },
    staleTime: cacheConfig.static.staleTime,
    gcTime: cacheConfig.static.gcTime,
  })

  return {
    tree,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

/**
 * Hook for getting category breadcrumb path
 */
export function useCategoryPath(handle: string) {
  const {
    data: path = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.category(handle), 'path'],
    queryFn: async () => {
      // First get all categories
      const allData = await httpClient.get<{ product_categories: any[] }>(
        '/store/product-categories',
        {
          params: {
            limit: 1000, // Get all categories at once
            fields: 'id,name,handle,parent_category_id,description', // Only essential fields
          },
        }
      )
      const allCategories = allData.product_categories || []
      
      // Find the target category
      const targetCategory = allCategories.find(c => c.handle === handle)
      if (!targetCategory) {
        throw new Error('Category not found')
      }

      // Build path
      const path: CategoryWithStats[] = []
      let current = targetCategory

      while (current) {
        path.unshift(transformCategory(current))
        current = current.parent_category_id
          ? allCategories.find((c) => c.id === current.parent_category_id)
          : null
      }

      return path
    },
    enabled: !!handle,
    staleTime: cacheConfig.static.staleTime,
    gcTime: cacheConfig.static.gcTime,
  })

  return {
    path,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

/**
 * Hook for getting product count in category (lazy loaded)
 */
export function useCategoryProductCount(categoryId: string) {
  const {
    data: count = 0,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['category-product-count', categoryId],
    queryFn: async () => {
      const data = await httpClient.get<{ count: number }>(
        '/store/products',
        {
          params: {
            category_id: [categoryId],
            limit: 1,
          },
        }
      )
      return data.count || 0
    },
    enabled: !!categoryId,
    staleTime: cacheConfig.dynamic.staleTime,
    gcTime: cacheConfig.dynamic.gcTime,
  })

  return {
    count,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}