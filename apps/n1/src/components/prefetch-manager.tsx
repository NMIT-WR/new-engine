'use client'
import { usePrefetchProducts } from '@/hooks/use-prefetch-products'
import { CATEGORY_MAP } from '@/lib/constants'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function PrefetchManager() {
  const { prefetchCategoryProducts } = usePrefetchProducts()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') return

    const timer = setTimeout(() => {
      for (const categoryId of Object.values(CATEGORY_MAP)) {
        prefetchCategoryProducts(categoryId)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname, prefetchCategoryProducts])

  return null
}
