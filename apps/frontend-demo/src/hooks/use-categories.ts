'use client'

import { useQuery } from '@tanstack/react-query'
import { sdk } from '@/lib/medusa-client'
import type { Category } from '@/types/product'
import { queryKeys } from '@/lib/query-keys'

export interface CategoryWithStats extends Category {
  count: number
  description?: string
}

function transformCategory(medusaCategory: any): CategoryWithStats {
  return {
    id: medusaCategory.id,
    name: medusaCategory.name,
    handle: medusaCategory.handle,
    count: medusaCategory.product_count || 0,
    description: medusaCategory.description || undefined,
  }
}

export function useCategories() {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      const response = await sdk.admin.productCategory.list({
        include_descendants_tree: true,
        include_ancestors_tree: true,
      })
      
      return response.product_categories.map(transformCategory)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return { 
    categories, 
    isLoading, 
    error: error instanceof Error ? error.message : error ? String(error) : null 
  }
}

export function useCategory(handle: string) {
  const { data: category = null, isLoading, error } = useQuery({
    queryKey: queryKeys.category(handle),
    queryFn: async () => {
      const response = await sdk.admin.productCategory.list({
        handle,
        include_descendants_tree: true,
        include_ancestors_tree: true,
      })
      
      if (response.product_categories.length === 0) {
        throw new Error('Category not found')
      }
      
      return transformCategory(response.product_categories[0])
    },
    enabled: !!handle,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  return { 
    category, 
    isLoading, 
    error: error instanceof Error ? error.message : error ? String(error) : null 
  }
}