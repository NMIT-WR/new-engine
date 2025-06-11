'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@/lib/medusa-client'
import type { Category } from '@/types/product'

interface CategoryWithStats extends Category {
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
  const [categories, setCategories] = useState<CategoryWithStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await sdk.store.productCategory.list({
          include_descendants_tree: true,
          include_ancestors_tree: true,
        })
        
        const transformedCategories = response.product_categories.map(transformCategory)
        setCategories(transformedCategories)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading, error }
}

export function useCategory(handle: string) {
  const [category, setCategory] = useState<CategoryWithStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategory() {
      if (!handle) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await sdk.store.productCategory.list({
          handle,
          include_descendants_tree: true,
          include_ancestors_tree: true,
        })
        
        if (response.product_categories.length === 0) {
          throw new Error('Category not found')
        }
        
        const transformedCategory = transformCategory(response.product_categories[0])
        setCategory(transformedCategory)
      } catch (err) {
        console.error('Failed to fetch category:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch category')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [handle])

  return { category, isLoading, error }
}