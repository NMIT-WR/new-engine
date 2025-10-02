'use client'

import { cacheConfig } from '@/lib/cache-config'
import { buildProductQueryParams } from '@/lib/product-query-params'
import { queryKeys } from '@/lib/query-keys'
import { getProducts } from '@/services/product-service'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

interface UsePrefetchPagesParams {
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  totalPages: number
  pageSize: number
  category_id: string[]
  regionId?: string
  countryCode?: string
}

/**
 * Prefetches surrounding pages for instant navigation
 */
export function usePrefetchPages({
  currentPage,
  hasNextPage,
  hasPrevPage,
  totalPages,
  pageSize,
  category_id,
  regionId,
  countryCode,
}: UsePrefetchPagesParams) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!regionId) return

    const pagesToPrefetch: number[] = []

    if (currentPage !== 1) {
      pagesToPrefetch.push(1)
    }

    if (hasPrevPage) {
      pagesToPrefetch.push(currentPage - 1)
      if (currentPage - 2 >= 1) {
        pagesToPrefetch.push(currentPage - 2)
      }
    }

    if (hasNextPage) {
      pagesToPrefetch.push(currentPage + 1)
      if (currentPage + 2 <= totalPages) {
        pagesToPrefetch.push(currentPage + 2)
      }
    }

    if (totalPages > 1 && currentPage !== totalPages) {
      pagesToPrefetch.push(totalPages)
    }

    if (process.env.NODE_ENV === 'development' && pagesToPrefetch.length > 0) {
      const categoryName = category_id[0]?.slice(-6) || 'unknown'
      const pages = pagesToPrefetch.map((p) => `p${p}`).join(', ')
      console.log(`[Prefetch Pages] ${categoryName}: ${pages}`)
    }

    for (const page of pagesToPrefetch) {
      const queryParams = buildProductQueryParams({
        category_id,
        region_id: regionId,
        country_code: countryCode,
        page,
        limit: pageSize,
      })

      queryClient.prefetchQuery({
        queryKey: queryKeys.products.list(queryParams),
        queryFn: () => getProducts(queryParams),
        ...cacheConfig.semiStatic,
      })
    }
  }, [
    currentPage,
    hasNextPage,
    hasPrevPage,
    totalPages,
    pageSize,
    category_id,
    regionId,
    countryCode,
    queryClient,
  ])
}
