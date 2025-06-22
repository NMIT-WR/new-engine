'use client'

import { DEFAULT_FILTER_STATE } from '@/hooks/use-product-listing'
import type { FilterState, SortOption } from '@/utils/product-filters'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type ExtendedSortOption = SortOption | 'relevance'

export function useUrlFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Parse filters from URL
  const filters: FilterState = useMemo(() => {
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const categories = searchParams.get('categories')
    const sizes = searchParams.get('sizes')
    const colors = searchParams.get('colors')

    return {
      priceRange: [
        priceMin
          ? Number.parseInt(priceMin)
          : DEFAULT_FILTER_STATE.priceRange[0],
        priceMax
          ? Number.parseInt(priceMax)
          : DEFAULT_FILTER_STATE.priceRange[1],
      ],
      categories: new Set(
        categories ? categories.split(',').filter(Boolean) : []
      ),
      sizes: new Set(sizes ? sizes.split(',').filter(Boolean) : []),
      colors: new Set(colors ? colors.split(',').filter(Boolean) : []),
    }
  }, [searchParams])

  // Update filters in URL
  const setFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString())

      // Update price range
      params.set('priceMin', newFilters.priceRange[0].toString())
      params.set('priceMax', newFilters.priceRange[1].toString())

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

      // Update colors
      const colorsArray = Array.from(newFilters.colors)
      if (colorsArray.length > 0) {
        params.set('colors', colorsArray.join(','))
      } else {
        params.delete('colors')
      }

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
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
  }
}
