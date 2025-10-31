import { cacheConfig } from '@/lib/cache-config'
import { prefetchLogger } from '@/lib/loggers'
import { buildPrefetchParams } from '@/lib/product-query-params'
import { queryKeys } from '@/lib/query-keys'
import { getProducts, getProductsGlobal } from '@/services/product-service'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useRegion } from './use-region'

export function usePrefetchProducts() {
  const { regionId, countryCode } = useRegion()
  const queryClient = useQueryClient()
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const prefetchCategoryProducts = useCallback(
    async (categoryId: string[], prefetchedBy?: string) => {
      if (!regionId) return

      const queryParams = buildPrefetchParams({
        category_id: categoryId,
        region_id: regionId,
        country_code: countryCode,
      })

      const queryKey = queryKeys.products.list(queryParams)
      const cached = queryClient.getQueryData(queryKey)

      if (cached) {
        const label = categoryId[0].slice(-6)
        prefetchLogger.cacheHit('Categories', label)
      } else {
        const label =
          categoryId.length === 1
            ? categoryId[0].slice(-6)
            : `${categoryId[0].slice(-6)} +${categoryId.length - 1}`
        const start = performance.now()

        prefetchLogger.start('Categories', label)

        await queryClient.prefetchQuery({
          queryKey,
          queryFn: ({ signal }) => getProducts(queryParams, signal),
          ...cacheConfig.semiStatic,
          meta: prefetchedBy ? { prefetchedBy } : undefined,
        })

        const duration = performance.now() - start
        prefetchLogger.complete('Categories', label, duration)
      }
    },
    [queryClient, regionId, countryCode]
  )

  const prefetchRootCategories = useCallback(
    async (categoryId: string[]) => {
      if (!regionId) return

      const queryParams = buildPrefetchParams({
        category_id: categoryId,
        region_id: regionId,
        country_code: countryCode,
      })

      const queryKey = queryKeys.products.list(queryParams)
      const cached = queryClient.getQueryData(queryKey)

      if (cached) {
        const label = categoryId[0].slice(-6)
        prefetchLogger.cacheHit('Root', label)
      } else {
        const label =
          categoryId.length === 1
            ? categoryId[0].slice(-6)
            : `${categoryId[0].slice(-6)} +${categoryId.length - 1}`
        const start = performance.now()

        prefetchLogger.start('Root', label)

        await queryClient.prefetchQuery({
          queryKey,
          queryFn: () => getProductsGlobal(queryParams),
          ...cacheConfig.semiStatic,
        })

        const duration = performance.now() - start
        prefetchLogger.complete('Root', label, duration)
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
    prefetchRootCategories,
    delayedPrefetch,
    cancelPrefetch,
  }
}
