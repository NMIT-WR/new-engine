'use client'

import { cacheConfig } from '@/lib/cache-config'
import { httpClient } from '@/lib/http-client'
import { queryKeys } from '@/lib/query-keys'
import type { Category } from '@/types/product'
import { useQuery } from '@tanstack/react-query'

export interface CategoryWithStats extends Category {
  count: number
  description?: string
}

function transformCategory(medusaCategory: any): CategoryWithStats {
  return {
    id: medusaCategory.id,
    name: medusaCategory.name,
    handle: medusaCategory.handle,
    count: medusaCategory.product_count || medusaCategory.products?.length || 0,
    description: medusaCategory.description || undefined,
  }
}

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
            fields: '*products',
            include_descendants_tree: true,
            include_ancestors_tree: true,
          },
        }
      )
      return (data.product_categories || []).map(transformCategory)
    },
    ...cacheConfig.static, // 24h stale, 7d gc - categories rarely change
  })

  return {
    categories,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

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
            fields: '*products',
            include_descendants_tree: true,
            include_ancestors_tree: true,
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
    ...cacheConfig.static, // 24h stale, 7d gc - categories rarely change
  })

  return {
    category,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}
