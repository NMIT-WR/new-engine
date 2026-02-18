"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRegionContext } from "@techsio/storefront-data"
import { useCallback, useRef } from "react"
import { getProductsQueryOptions, usePrefetchProducts } from "@/hooks/product-hooks"
import { storefrontCacheConfig } from "@/lib/cache-config"

interface UseCategoryPrefetchOptions {
  enabled?: boolean
  cacheStrategy?: keyof typeof storefrontCacheConfig
  prefetchLimit?: number
}

export function useCategoryPrefetch(options?: UseCategoryPrefetchOptions) {
  const queryClient = useQueryClient()
  const region = useRegionContext()
  const enabled = options?.enabled ?? true
  const prefetchLimit = options?.prefetchLimit ?? 12
  const cacheStrategy = options?.cacheStrategy

  const { delayedPrefetch, cancelPrefetch } = usePrefetchProducts({
    cacheStrategy,
    skipIfCached: true,
  })

  const activePrefetchesRef = useRef<Set<string>>(new Set())

  const prefetchCategoryProducts = useCallback(
    async (categoryIds: string[]) => {
      if (!enabled || categoryIds.length === 0) {
        return
      }

      await queryClient.prefetchQuery(
        getProductsQueryOptions({
          limit: prefetchLimit,
          filters: { categories: categoryIds, sizes: [] },
          sort: "newest",
          region_id: region?.region_id ?? undefined,
          country_code: region?.country_code ?? undefined,
        })
      )
    },
    [enabled, prefetchLimit, queryClient, region?.country_code, region?.region_id]
  )

  const delayedPrefetchCategory = useCallback(
    (categoryIds: string[], delay = 800, prefetchId?: string) => {
      if (!enabled || categoryIds.length === 0) {
        return
      }

      const id = delayedPrefetch(
        {
          limit: prefetchLimit,
          filters: { categories: categoryIds, sizes: [] },
          sort: "newest",
        },
        delay,
        prefetchId
      )

      activePrefetchesRef.current.add(id)
      return id
    },
    [enabled, delayedPrefetch, prefetchLimit]
  )

  const cancelPrefetchById = useCallback(
    (prefetchId: string) => {
      if (!prefetchId) {
        return false
      }
      cancelPrefetch(prefetchId)
      return activePrefetchesRef.current.delete(prefetchId)
    },
    [cancelPrefetch]
  )

  const cancelAllPrefetches = useCallback(() => {
    activePrefetchesRef.current.forEach((id) => {
      cancelPrefetch(id)
    })
    activePrefetchesRef.current.clear()
  }, [cancelPrefetch])

  return {
    prefetchCategoryProducts,
    delayedPrefetch: delayedPrefetchCategory,
    cancelPrefetch: cancelPrefetchById,
    cancelAllPrefetches,
  }
}
