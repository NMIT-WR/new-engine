import { cacheConfig } from '@/lib/cache-config'
import { buildPrefetchParams } from '@/lib/product-query-params'
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

      const queryParams = buildPrefetchParams({
        category_id: categoryId,
        region_id: regionId,
        country_code: countryCode,
      })

      const queryKey = queryKeys.products.list(queryParams)
      const cached = queryClient.getQueryData(queryKey)

      if (!cached) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Prefetch] Category ${categoryId[0]} (page 1)`)
        }
        await queryClient.prefetchQuery({
          queryKey,
          queryFn: () => getProducts(queryParams),
          ...cacheConfig.semiStatic,
        })
      } else if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache hit] Category ${categoryId[0]}`)
      }
    },
    [queryClient, regionId, countryCode]
  )

  const delayedPrefetch = useCallback(
    (categoryId: string[], delay = 800) => {
      const id = categoryId.join('-')
      const existing = timeoutsRef.current.get(id)
      if (existing) clearTimeout(existing)

      const timeoutId = setTimeout(() => {
        prefetchCategoryProducts(categoryId)
        timeoutsRef.current.delete(id)
      }, delay)

      timeoutsRef.current.set(id, timeoutId)
      return id
    },
    [prefetchCategoryProducts]
  )

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
