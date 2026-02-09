import { prefetchLogger } from "@/lib/loggers/prefetch"
import {
  PREFETCH_CACHE_STRATEGY,
  PREFETCH_SKIP_IF_CACHED,
  PREFETCH_SKIP_MODE,
} from "@/lib/prefetch-policy"
import { usePrefetchProducts as useBasePrefetchProducts } from "./product-hooks"

/**
 * Format category IDs into a short label for logging
 * Shows last 6 chars of first category + count of additional categories
 */
const formatCategoryLabel = (categoryId: string[]): string => {
  const [firstCategory] = categoryId
  if (!firstCategory) return ""
  return categoryId.length === 1
    ? firstCategory.slice(-6)
    : `${firstCategory.slice(-6)} +${categoryId.length - 1}`
}

/**
 * n1-specific wrapper around storefront-data's usePrefetchProducts
 * Provides simplified API for category-based prefetching with logging
 */
export function usePrefetchProducts() {
  const basePrefetch = useBasePrefetchProducts({
    cacheStrategy: PREFETCH_CACHE_STRATEGY,
    skipIfCached: PREFETCH_SKIP_IF_CACHED,
    skipMode: PREFETCH_SKIP_MODE,
  })

  const prefetchCategoryProducts = async (
    categoryId: string[],
    prefetchedBy?: string
  ) => {
    if (!categoryId[0]) {
      return
    }

    const label = formatCategoryLabel(categoryId)
    const start = performance.now()
    prefetchLogger.start("Categories", label)

    await basePrefetch.prefetchProducts(
      { category_id: categoryId },
      {
        prefetchedBy,
        skipIfCached: PREFETCH_SKIP_IF_CACHED,
        skipMode: PREFETCH_SKIP_MODE,
      }
    )

    const duration = performance.now() - start
    prefetchLogger.complete("Categories", label, duration)
  }

  const prefetchRootCategories = async (categoryId: string[]) => {
    if (!categoryId[0]) {
      return
    }

    const label = formatCategoryLabel(categoryId)
    const start = performance.now()
    prefetchLogger.start("Root", label)

    await basePrefetch.prefetchFirstPage(
      { category_id: categoryId },
      {
        useGlobalFetcher: true,
        skipIfCached: PREFETCH_SKIP_IF_CACHED,
        skipMode: PREFETCH_SKIP_MODE,
      }
    )

    const duration = performance.now() - start
    prefetchLogger.complete("Root", label, duration)
  }

  const delayedPrefetch = (categoryId: string[], delay = 800) =>
    basePrefetch.delayedPrefetch(
      { category_id: categoryId },
      delay,
      categoryId.join("-")
    )

  const cancelPrefetch = (prefetchId: string) => {
    basePrefetch.cancelPrefetch(prefetchId)
  }

  return {
    prefetchCategoryProducts,
    prefetchRootCategories,
    delayedPrefetch,
    cancelPrefetch,
  }
}
