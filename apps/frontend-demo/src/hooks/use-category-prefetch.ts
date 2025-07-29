import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getProducts } from '@/services/product-service'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useRegions } from './use-region'

interface UseCategoryPrefetchOptions {
  enabled?: boolean
  cacheStrategy?: keyof typeof cacheConfig
}

export function useCategoryPrefetch(options?: UseCategoryPrefetchOptions) {
  const { selectedRegion } = useRegions()
  const queryClient = useQueryClient()
  const enabled = options?.enabled ?? true
  const cacheStrategy = options?.cacheStrategy ?? 'semiStatic'

  const prefetchCategoryProducts = useCallback(
    async (categoryIds: string[]) => {
      if (!enabled || !selectedRegion?.id || categoryIds.length === 0) return

      // Check if data is already in cache
      const queryKey = queryKeys.products.list({
        page: 1,
        limit: 12,
        filters: { categories: categoryIds, sizes: [] },
        region_id: selectedRegion.id,
        sort: 'newest',
      })

      const cachedData = queryClient.getQueryData(queryKey)
      const queryState = queryClient.getQueryState(queryKey)

      // Only prefetch if data is not in cache or is stale
      if (!cachedData || queryState?.isInvalidated) {
      //  console.log(`[Prefetch] Executing prefetch for ${categoryIds.length} categories`)

        await queryClient.prefetchQuery({
          queryKey,
          queryFn: () =>
            getProducts({
              filters: { categories: categoryIds, sizes: [] },
              limit: 12,
              offset: 0,
              region_id: selectedRegion.id,
              sort: 'newest',
            }),
          ...cacheConfig[cacheStrategy],
        })
      }/* else {
        console.log(`[Prefetch] Skipping - already in cache for ${categoryIds.length} categories`)
      }*/
    },
    [queryClient, selectedRegion?.id, enabled, cacheStrategy]
  )

  return {
    prefetchCategoryProducts,
  }
}
