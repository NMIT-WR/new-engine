import { cacheConfig } from '@/lib/cache-config'
import { PRODUCT_FIELDS, PRODUCT_LIMIT } from '@/lib/constants'
import { queryKeys } from '@/lib/query-keys'
import { getProducts } from '@/services/product-service'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useRegion } from './use-region'

export function usePrefetchProducts() {
  const { regionId, countryCode } = useRegion()
  const queryClient = useQueryClient()
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const prefetchCategoryProducts = useCallback(
    async (categoryId: string[]) => {
      if (!regionId) return

      const queryKey = queryKeys.products.list({
        category_id: categoryId,
        region_id: regionId,
        country_code: countryCode,
        limit: PRODUCT_LIMIT,
        fields: PRODUCT_FIELDS,
      })

      // Kontrola cache
      const cached = queryClient.getQueryData(queryKey)
      if (!cached) {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn: () =>
            getProducts({
              category_id: categoryId,
              region_id: regionId,
              country_code: countryCode,
            }),
          ...cacheConfig.semiStatic,
        })
      }
    },
    [queryClient, regionId, countryCode]
  )

  // Prefetch s delay pro hover
  const delayedPrefetch = useCallback(
    (categoryId: string[], delay = 800) => {
      const id = categoryId.join('-')

      // Cancel existing timeout
      const existing = timeoutsRef.current.get(id)
      if (existing) clearTimeout(existing)

      // Create new timeout
      const timeoutId = setTimeout(() => {
        prefetchCategoryProducts(categoryId)
        timeoutsRef.current.delete(id)
      }, delay)

      timeoutsRef.current.set(id, timeoutId)
      return id
    },
    [prefetchCategoryProducts]
  )

  // Cancel prefetch
  const cancelPrefetch = useCallback((prefetchId: string) => {
    const timeout = timeoutsRef.current.get(prefetchId)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(prefetchId)
    }
  }, [])

  return {
    prefetchCategoryProducts,
    delayedPrefetch,
    cancelPrefetch,
  }
}
