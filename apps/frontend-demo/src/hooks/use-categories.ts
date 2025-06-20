'use client'

import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import type { Category } from '@/types/product'
import { useQuery } from '@tanstack/react-query'

// Use constants from the top of the file to ensure they're available
const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

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
      // Use direct fetch instead of SDK client
      const response = await fetch(
        `${BACKEND_URL}/store/product-categories?fields=*products&include_descendants_tree=true&include_ancestors_tree=true`,
        {
          headers: {
            'x-publishable-api-key': PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`)
      }

      const data = await response.json()
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
      // Use direct fetch instead of SDK client
      const response = await fetch(
        `${BACKEND_URL}/store/product-categories?handle=${handle}&fields=*products&include_descendants_tree=true&include_ancestors_tree=true`,
        {
          headers: {
            'x-publishable-api-key': PUBLISHABLE_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch category: ${response.status}`)
      }

      const data = await response.json()
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
