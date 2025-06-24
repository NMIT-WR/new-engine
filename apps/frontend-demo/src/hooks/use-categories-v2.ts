'use client'

import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { CategoryService } from '@/services/category-service'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook for fetching all categories
 */
export function useCategories() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => CategoryService.getCategories(),
    ...cacheConfig.static,
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
    queryFn: () => CategoryService.getRootCategories(),
    ...cacheConfig.static,
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
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.category(handle),
    queryFn: () => CategoryService.getCategory(handle),
    enabled: !!handle,
    ...cacheConfig.static,
  })

  return {
    category,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

/**
 * Hook for building category tree
 */
export function useCategoryTree() {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKeys.categories(), 'tree'],
    queryFn: async () => {
      const categories = await CategoryService.getCategories()
      return CategoryService.buildCategoryTree(categories)
    },
    ...cacheConfig.static,
  })

  return {
    tree: categories,
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
    queryFn: () => CategoryService.getCategoryPath(handle),
    enabled: !!handle,
    ...cacheConfig.static,
  })

  return {
    path,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}
