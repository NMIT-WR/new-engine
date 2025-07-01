'use client'

// Default filter state
const DEFAULT_FILTER_STATE = {
  categories: new Set<string>(),
  sizes: new Set<string>(),
}
import type { SortOption } from '@/utils/product-filters'
import type { FilterState } from '@/components/organisms/product-filters'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type ExtendedSortOption = SortOption | 'relevance'

export function useUrlFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Parse page from URL
  const page = Number.parseInt(searchParams.get('page') || '1', 10)

  // Parse search query from URL
  const searchQuery = searchParams.get('q') || ''

  // Parse filters from URL
  const filters: FilterState = useMemo(() => {
    const categories = searchParams.get('categories')
    const sizes = searchParams.get('sizes')

    return {
      categories: new Set(
        categories ? categories.split(',').filter(Boolean) : []
      ),
      sizes: new Set(sizes ? sizes.split(',').filter(Boolean) : []),
    }
  }, [searchParams])

  // Update filters in URL
  const setFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString())

      // Update categories
      const categoriesArray = Array.from(newFilters.categories)
      if (categoriesArray.length > 0) {
        params.set('categories', categoriesArray.join(','))
      } else {
        params.delete('categories')
      }

      // Update sizes
      const sizesArray = Array.from(newFilters.sizes)
      if (sizesArray.length > 0) {
        params.set('sizes', sizesArray.join(','))
      } else {
        params.delete('sizes')
      }

      // Reset to page 1 when filters change
      params.delete('page')

      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Sort state
  const sortBy = (searchParams.get('sort') || 'newest') as ExtendedSortOption

  const setSortBy = useCallback(
    (sort: ExtendedSortOption) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', sort)
      // Reset to page 1 when sort changes
      params.delete('page')
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Page state
  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (newPage > 1) {
        params.set('page', newPage.toString())
      } else {
        params.delete('page')
      }
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Update search query in URL
  const setSearchQuery = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      // Reset to first page when searching
      params.set('page', '1')
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
  }
}
