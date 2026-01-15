'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useQueryKeys, useMedusaConfig, useCacheConfig } from './context'
import { useRegion } from './use-region'
import { buildPrefetchParams } from '../lib/product-query-params'
import { createProductService } from '../services/product-service'
import { prefetchLogger } from '../utils/loggers'

export function usePrefetchProducts() {
  const { regionId, countryCode } = useRegion()
  const queryClient = useQueryClient()
  const queryKeys = useQueryKeys()
  const config = useMedusaConfig()
  const cacheConfig = useCacheConfig()
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const productService = createProductService({
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
  })

  const prefetchCategoryProducts = async (
    categoryId: string[],
    prefetchedBy?: string
  ) => {
    if (!regionId) return

    const queryParams = buildPrefetchParams({
      category_id: categoryId,
      region_id: regionId,
      country_code: countryCode,
    })

    const queryKey = queryKeys.products.list(queryParams)
    const cached = queryClient.getQueryData(queryKey)

    if (cached) {
      const label = categoryId[0]?.slice(-6) || 'unknown'
      prefetchLogger.cacheHit('Categories', label)
    } else {
      const label =
        categoryId.length === 1
          ? categoryId[0]?.slice(-6) || 'unknown'
          : `${categoryId[0]?.slice(-6) || 'unknown'} +${categoryId.length - 1}`
      const start = performance.now()

      prefetchLogger.start('Categories', label)

      await queryClient.prefetchQuery({
        queryKey,
        queryFn: ({ signal }) =>
          productService.getProducts(queryParams, signal),
        ...cacheConfig.semiStatic,
        meta: prefetchedBy ? { prefetchedBy } : undefined,
      })

      const duration = performance.now() - start
      prefetchLogger.complete('Categories', label, duration)
    }
  }

  const prefetchRootCategories = async (categoryId: string[]) => {
    if (!regionId) return

    const queryParams = buildPrefetchParams({
      category_id: categoryId,
      region_id: regionId,
      country_code: countryCode,
    })

    const queryKey = queryKeys.products.list(queryParams)
    const cached = queryClient.getQueryData(queryKey)

    if (cached) {
      const label = categoryId[0]?.slice(-6) || 'unknown'
      prefetchLogger.cacheHit('Root', label)
    } else {
      const label =
        categoryId.length === 1
          ? categoryId[0]?.slice(-6) || 'unknown'
          : `${categoryId[0]?.slice(-6) || 'unknown'} +${categoryId.length - 1}`
      const start = performance.now()

      prefetchLogger.start('Root', label)

      await queryClient.prefetchQuery({
        queryKey,
        queryFn: () => productService.getProductsGlobal(queryParams),
        ...cacheConfig.semiStatic,
      })

      const duration = performance.now() - start
      prefetchLogger.complete('Root', label, duration)
    }
  }

  const delayedPrefetch = (categoryId: string[], delay = 800) => {
    const id = categoryId.join('-')
    const existing = timeoutsRef.current.get(id)
    if (existing) clearTimeout(existing)

    const timeoutId = setTimeout(() => {
      prefetchCategoryProducts(categoryId)
      timeoutsRef.current.delete(id)
    }, delay)

    timeoutsRef.current.set(id, timeoutId)
    return id
  }

  const cancelPrefetch = (prefetchId: string) => {
    const timeout = timeoutsRef.current.get(prefetchId)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(prefetchId)
    }
  }

  return {
    prefetchCategoryProducts,
    prefetchRootCategories,
    delayedPrefetch,
    cancelPrefetch,
  }
}
