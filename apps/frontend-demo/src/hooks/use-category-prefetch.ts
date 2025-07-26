import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import type { LeafParent } from '@/lib/static-data/categories'
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
    (categoryIds: string[]) => {
      if (!enabled || !selectedRegion?.id || categoryIds.length === 0) return

      // Check if data is already in cache
      const queryKey = queryKeys.products.list({
        page: 1,
        limit: 12,
        category: categoryIds,
        region_id: selectedRegion.id,
      })

      const cachedData = queryClient.getQueryData(queryKey)
      const queryState = queryClient.getQueryState(queryKey)

      // Only prefetch if data is not in cache or is stale
      if (!cachedData || queryState?.isInvalidated) {
        console.log('🔄 Prefetching:', categoryIds.length === 1 ? categoryIds[0] : `${categoryIds.length} categories`)
        
        queryClient.prefetchQuery({
          queryKey,
          queryFn: () =>
            getProducts({
              category: categoryIds,
              limit: 12,
              offset: 0,
              region_id: selectedRegion.id,
            }),
          ...cacheConfig[cacheStrategy],
        })
      } else {
        console.log('✓ Cached:', categoryIds.length === 1 ? categoryIds[0] : `${categoryIds.length} categories`)
      }
    },
    [queryClient, selectedRegion?.id, enabled, cacheStrategy]
  )

  // Prefetch products for categories considering leafParents
  const prefetchForCategory = useCallback(
    (
      categoryId: string,
      leafCategoryIds: Set<string>,
      leafParentIds: Set<string>,
      leafParents: LeafParent[]
    ) => {
      // Check if this category should be prefetched
      if (!leafCategoryIds.has(categoryId) && !leafParentIds.has(categoryId)) {
        return // Not a leaf or leafParent, skip
      }

      const categoryIds: string[] = []

      if (leafCategoryIds.has(categoryId)) {
        // It's a leaf category - prefetch just this one
        categoryIds.push(categoryId)
      } else if (leafParentIds.has(categoryId)) {
        // It's a leaf parent - prefetch all its children
        const parent = leafParents.find((p) => p.id === categoryId)
        if (parent) {
          categoryIds.push(...parent.children)
        }
      }

      if (categoryIds.length > 0) {
        prefetchCategoryProducts(categoryIds)
      }
    },
    [prefetchCategoryProducts]
  )

  return {
    prefetchCategoryProducts,
    prefetchForCategory,
  }
}
