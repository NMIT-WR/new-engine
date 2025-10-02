'use client'
import { usePrefetchProducts } from '@/hooks/use-prefetch-products'
import { useRegion } from '@/hooks/use-region'
import { CATEGORY_MAP } from '@/lib/constants'
import { useEffect, useRef } from 'react'

const PREFETCH_DELAY = 200

export function PrefetchManager() {
  const { prefetchCategoryProducts } = usePrefetchProducts()
  const { regionId } = useRegion()
  const hasPrefetched = useRef(false)

  useEffect(() => {
    if (!regionId) return // Wait for region to load
    if (hasPrefetched.current) return
    hasPrefetched.current = true

    const timer = setTimeout(() => {
      for (const categoryId of Object.values(CATEGORY_MAP)) {
        prefetchCategoryProducts(categoryId)
      }
    }, PREFETCH_DELAY)

    return () => clearTimeout(timer)
  }, [regionId, prefetchCategoryProducts])

  return null
}
