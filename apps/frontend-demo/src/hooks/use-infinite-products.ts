'use client'

import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { type ProductListParams, getProducts } from '@/services/product-service'
import type { Product } from '@/types/product'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { PageRange } from './use-url-filters'

interface UseInfiniteProductsParams extends Omit<ProductListParams, 'offset'> {
  pageRange: PageRange
  enabled?: boolean
}

interface UseInfiniteProductsReturn {
  products: Product[]
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPageRange: PageRange
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  refetch: () => void
}

/**
 * Hook for fetching infinite product lists with "load more" functionality
 */
export function useInfiniteProducts(
  params: UseInfiniteProductsParams
): UseInfiniteProductsReturn {
  const {
    pageRange,
    limit = 12,
    filters,
    sort,
    fields,
    q,
    category,
    region_id,
    enabled,
  } = params

  const baseOffset = (pageRange.start - 1) * limit
  const totalPagesNeeded = pageRange.end - pageRange.start + 1
  
  // For range queries, we need to load all pages in the range at once
  const rangeLimit = totalPagesNeeded * limit

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.products.infinite({
      pageRange: `${pageRange.start}-${pageRange.end}`,
      limit,
      filters,
      sort,
      region_id,
      q,
      category,
    }),
    queryFn: ({ pageParam = baseOffset }) => {
      // For the initial load, use rangeLimit to load all pages in range at once
      // For subsequent "load more" calls, use normal limit
      const isInitialLoad = pageParam === baseOffset
      const requestLimit = isInitialLoad ? rangeLimit : limit
      
      return getProducts({
        limit: requestLimit,
        offset: pageParam,
        filters,
        sort,
        fields,
        q,
        category,
        region_id,
      })
    },
    initialPageParam: baseOffset,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // Since we load the full range in the first request, 
      // subsequent calls are just "load more" beyond the range
      const totalFetched = allPages.reduce(
        (sum, page) => sum + page.products.length,
        0
      )
      
      // Check if there are more products to load
      const hasMore = totalFetched < lastPage.count
      if (!hasMore) return undefined
      
      // Calculate offset for the next batch (beyond current range)
      const nextOffset = baseOffset + totalFetched
      return nextOffset
    },
    enabled: enabled !== undefined ? enabled : !!region_id,
    ...cacheConfig.semiStatic,
  })

  // Flatten all pages into a single array
  const products = data?.pages.flatMap((page) => page.products) || []
  const totalCount = data?.pages[0]?.count || 0

  return {
    products,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
    totalCount,
    currentPageRange: pageRange,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage: () => fetchNextPage(),
    refetch,
  }
}
