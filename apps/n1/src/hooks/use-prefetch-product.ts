'use client'

import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getProductByHandle } from '@/services/product-service'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { useRegion } from './use-region'

export function usePrefetchProduct() {
  const { regionId, countryCode } = useRegion()
  const queryClient = useQueryClient()
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const prefetchProduct = useCallback(
    async (handle: string, fields?: string) => {
      if (!regionId || !handle) return

      const queryKey = queryKeys.products.detail(handle, regionId, countryCode)
      const cached = queryClient.getQueryData(queryKey)

      if (!cached) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Prefetch] Product ${handle}`)
        }
        await queryClient.prefetchQuery({
          queryKey,
          queryFn: () =>
            getProductByHandle({
              handle,
              region_id: regionId,
              country_code: countryCode,
              fields,
            }),
          ...cacheConfig.semiStatic,
        })
      } else if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache hit] Product ${handle}`)
      }
    },
    [queryClient, regionId, countryCode]
  )

  const delayedPrefetch = useCallback(
    (handle: string, delay = 800, fields?: string) => {
      const existing = timeoutsRef.current.get(handle)
      if (existing) clearTimeout(existing)

      const timeoutId = setTimeout(() => {
        prefetchProduct(handle, fields)
        timeoutsRef.current.delete(handle)
      }, delay)

      timeoutsRef.current.set(handle, timeoutId)
      return handle
    },
    [prefetchProduct]
  )

  const cancelPrefetch = useCallback((handle: string) => {
    const timeout = timeoutsRef.current.get(handle)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(handle)
    }
  }, [])

  return {
    prefetchProduct,
    delayedPrefetch,
    cancelPrefetch,
  }
}
