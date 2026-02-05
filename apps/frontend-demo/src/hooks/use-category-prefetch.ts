"use client"

import { useCallback, useRef } from "react"
import { usePrefetchProducts } from "@/hooks/product-hooks"
import { storefrontCacheConfig } from "@/lib/cache-config"

interface UseCategoryPrefetchOptions {
  enabled?: boolean
  cacheStrategy?: keyof typeof storefrontCacheConfig
  prefetchLimit?: number
}

export function useCategoryPrefetch(options?: UseCategoryPrefetchOptions) {
  const enabled = options?.enabled ?? true
  const prefetchLimit = options?.prefetchLimit ?? 12
  const cacheStrategy = options?.cacheStrategy

  const { prefetchProducts, delayedPrefetch, cancelPrefetch } =
    usePrefetchProducts({
      cacheStrategy,
      skipIfCached: true,
    })

  const activePrefetchesRef = useRef<Set<string>>(new Set())

  const prefetchCategoryProducts = useCallback(
    async (categoryIds: string[]) => {
      if (!enabled || categoryIds.length === 0) {
        return
      }

      await prefetchProducts(
        {
          limit: prefetchLimit,
          filters: { categories: categoryIds, sizes: [] },
          sort: "newest",
        },
        { cacheStrategy }
      )
    },
    [enabled, prefetchLimit, prefetchProducts, cacheStrategy]
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
