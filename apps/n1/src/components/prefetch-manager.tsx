'use client'
import { usePrefetchProducts } from '@/hooks/use-prefetch-products'
import { useRegion } from '@/hooks/use-region'
import { CATEGORY_MAP } from '@/lib/constants'
import { prefetchLogger } from '@/lib/loggers'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const PREFETCH_DELAY = 200

/**
 * Prefetches all root categories on non-category pages
 * Category pages use usePrefetchRootCategories hook instead
 */
export function PrefetchManager() {
  const { prefetchCategoryProducts } = usePrefetchProducts()
  const { regionId } = useRegion()
  const pathname = usePathname()
  const hasPrefetched = useRef(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!regionId) return
    if (hasPrefetched.current) return

    // Skip category pages - they have their own prefetch logic
    if (pathname.startsWith('/kategorie/')) return

    hasPrefetched.current = true

    const timer = setTimeout(() => {
      prefetchLogger.info('Categories', `Manager started from ${pathname}`)

      // Prefetch ALL root categories
      for (const categoryIds of Object.values(CATEGORY_MAP)) {
        prefetchCategoryProducts(categoryIds)
      }
    }, PREFETCH_DELAY)

    return () => clearTimeout(timer)
  }, [regionId, pathname, prefetchCategoryProducts])

  return null
}
