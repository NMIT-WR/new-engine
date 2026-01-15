'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useQueryKeys, useMedusaSdk, useMedusaConfig, useCacheConfig } from './context'
import { useRegion } from './use-region'
import { createProductDetailService } from '../services/product-service'
import { prefetchLogger } from '../utils/loggers'

const DEFAULT_PREFETCH_DELAY = 400

export function usePrefetchProduct() {
  const { regionId, countryCode } = useRegion()
  const queryClient = useQueryClient()
  const queryKeys = useQueryKeys()
  const sdk = useMedusaSdk()
  const config = useMedusaConfig()
  const cacheConfig = useCacheConfig()
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const productDetailService = createProductDetailService(sdk)

  const prefetchProduct = async (handle: string, fields?: string) => {
    if (!regionId || !handle) return

    const queryKey = queryKeys.products.detail(handle, regionId, countryCode)
    const cached = queryClient.getQueryData(queryKey)

    if (cached) {
      prefetchLogger.cacheHit('Product', handle)
    } else {
      prefetchLogger.start('Product', handle)
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: () =>
          productDetailService.getProductByHandle({
            handle,
            region_id: regionId,
            country_code: countryCode,
            fields: fields || config.productDetailFields,
          }),
        ...cacheConfig.semiStatic,
      })
    }
  }

  const delayedPrefetch = (
    handle: string,
    delay = DEFAULT_PREFETCH_DELAY,
    fields?: string
  ) => {
    const existing = timeoutsRef.current.get(handle)
    if (existing) clearTimeout(existing)

    const timeoutId = setTimeout(() => {
      prefetchProduct(handle, fields)
      timeoutsRef.current.delete(handle)
    }, delay)

    timeoutsRef.current.set(handle, timeoutId)
    return handle
  }

  const cancelPrefetch = (handle: string) => {
    const timeout = timeoutsRef.current.get(handle)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(handle)
    }
  }

  return {
    prefetchProduct,
    delayedPrefetch,
    cancelPrefetch,
  }
}
