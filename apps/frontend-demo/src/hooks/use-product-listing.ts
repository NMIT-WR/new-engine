'use client'

import type { Product } from '@/types/product'
import { filterProducts, sortProducts } from '@/utils/product-filters'
import type { FilterState, SortOption } from '@/utils/product-filters'
import { useMemo, useState } from 'react'

export const DEFAULT_SORT_OPTIONS = [
  { value: 'newest' as const, label: 'Newest' },
  { value: 'price-asc' as const, label: 'Price: Low to High' },
  { value: 'price-desc' as const, label: 'Price: High to Low' },
  { value: 'name-asc' as const, label: 'Name: A to Z' },
  { value: 'name-desc' as const, label: 'Name: Z to A' },
]

export const SEARCH_SORT_OPTIONS = [
  { value: 'relevance' as const, label: 'Most Relevant' },
  ...DEFAULT_SORT_OPTIONS,
]

export const DEFAULT_FILTER_STATE: FilterState = {
  priceRange: [0, 200],
  categories: new Set(),
  sizes: new Set(),
  colors: new Set(),
}

type ExtendedSortOption = SortOption | 'relevance'

interface UseProductListingOptions {
  initialSortBy?: ExtendedSortOption
  initialFilters?: Partial<FilterState>
  sortOptions?: Array<{ value: ExtendedSortOption; label: string }>
}

interface UseProductListingReturn {
  sortBy: ExtendedSortOption
  setSortBy: (value: ExtendedSortOption) => void
  filters: FilterState
  setFilters: (filters: FilterState) => void
  sortedProducts: Product[]
  filteredProducts: Product[]
  productCount: number
  sortOptions: Array<{ value: ExtendedSortOption; label: string }>
}

export function useProductListing(
  products: Product[],
  options: UseProductListingOptions = {}
): UseProductListingReturn {
  const {
    initialSortBy = 'newest',
    initialFilters = {},
    sortOptions = DEFAULT_SORT_OPTIONS,
  } = options

  const [sortBy, setSortBy] = useState<ExtendedSortOption>(initialSortBy)
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTER_STATE,
    ...initialFilters,
  })

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  )

  const sortedProducts = useMemo(
    () =>
      sortProducts(
        filteredProducts,
        sortBy === 'relevance' ? 'newest' : sortBy
      ),
    [filteredProducts, sortBy]
  )

  return {
    sortBy,
    setSortBy,
    filters,
    setFilters,
    sortedProducts,
    filteredProducts,
    productCount: filteredProducts.length,
    sortOptions,
  }
}
