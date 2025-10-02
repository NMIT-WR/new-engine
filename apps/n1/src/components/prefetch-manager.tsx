'use client'
import { usePrefetchProducts } from '@/hooks/use-prefetch-products'
import { useRegion } from '@/hooks/use-region'
import { CATEGORY_MAP, VALID_CATEGORY_ROUTES } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const PREFETCH_DELAY_STANDARD = 200
const PREFETCH_DELAY_CATEGORY_PAGE = 1500

export function PrefetchManager() {
  const { prefetchCategoryProducts } = usePrefetchProducts()
  const { regionId } = useRegion()
  const pathname = usePathname()
  const hasPrefetched = useRef(false)

  useEffect(() => {
    if (!regionId) return
    if (hasPrefetched.current) return
    hasPrefetched.current = true

    const currentCategoryHandle = pathname.startsWith('/')
      ? pathname.slice(1)
      : pathname

    const isOnCategory = VALID_CATEGORY_ROUTES.includes(currentCategoryHandle)
    const delay = isOnCategory
      ? PREFETCH_DELAY_CATEGORY_PAGE
      : PREFETCH_DELAY_STANDARD

    const timer = setTimeout(() => {
      for (const [handle, categoryIds] of Object.entries(CATEGORY_MAP)) {
        if (handle !== currentCategoryHandle) {
          prefetchCategoryProducts(categoryIds)
        }
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [regionId, pathname, prefetchCategoryProducts])

  return null
}
