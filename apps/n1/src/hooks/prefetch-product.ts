"use client"

import { prefetchLogger } from "@/lib/loggers/prefetch"
import { usePrefetchProduct as useBasePrefetchProduct } from "./product-hooks"

const PREFETCH_DELAY = 400

/**
 * n1-specific wrapper around storefront-data's usePrefetchProduct
 * Provides simplified API for product detail prefetching with logging
 */
export function usePrefetchProduct() {
  const basePrefetch = useBasePrefetchProduct({
    cacheStrategy: "semiStatic",
    defaultDelay: PREFETCH_DELAY,
    skipIfCached: true,
  })

  const prefetchProduct = async (handle: string, fields?: string) => {
    if (!handle) {
      return
    }

    prefetchLogger.start("Product", handle)

    await basePrefetch.prefetchProduct(
      { handle, fields },
      { skipIfCached: true }
    )
  }

  const delayedPrefetch = (
    handle: string,
    delay = PREFETCH_DELAY,
    fields?: string
  ) => basePrefetch.delayedPrefetch({ handle, fields }, delay, handle)

  const cancelPrefetch = (handle: string) => {
    basePrefetch.cancelPrefetch(handle)
  }

  return {
    prefetchProduct,
    delayedPrefetch,
    cancelPrefetch,
  }
}
