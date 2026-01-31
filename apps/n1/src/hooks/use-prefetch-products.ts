import { prefetchLogger } from "@/lib/loggers/prefetch"
import { usePrefetchProducts as useBasePrefetchProducts } from "./product-hooks"

/**
 * n1-specific wrapper around storefront-data's usePrefetchProducts
 * Provides simplified API for category-based prefetching with logging
 */
export function usePrefetchProducts() {
  const basePrefetch = useBasePrefetchProducts({
    cacheStrategy: "semiStatic",
    skipIfCached: true,
  })

  const prefetchCategoryProducts = async (
    categoryId: string[],
    prefetchedBy?: string
  ) => {
    const [firstCategory] = categoryId
    if (!firstCategory) {
      return
    }

    const label =
      categoryId.length === 1
        ? firstCategory.slice(-6)
        : `${firstCategory.slice(-6)} +${categoryId.length - 1}`

    const start = performance.now()
    prefetchLogger.start("Categories", label)

    await basePrefetch.prefetchProducts(
      { category_id: categoryId },
      { prefetchedBy, skipIfCached: true }
    )

    const duration = performance.now() - start
    prefetchLogger.complete("Categories", label, duration)
  }

  const prefetchRootCategories = async (categoryId: string[]) => {
    const [firstCategory] = categoryId
    if (!firstCategory) {
      return
    }

    const label =
      categoryId.length === 1
        ? firstCategory.slice(-6)
        : `${firstCategory.slice(-6)} +${categoryId.length - 1}`

    const start = performance.now()
    prefetchLogger.start("Root", label)

    await basePrefetch.prefetchFirstPage(
      { category_id: categoryId },
      { useGlobalFetcher: true, skipIfCached: true }
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
