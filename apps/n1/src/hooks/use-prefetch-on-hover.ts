'use client'

import { ALL_CATEGORIES_MAP } from '@/lib/constants'
import { PREFETCH_DELAYS } from '@/lib/prefetch-config'
import { useEffect, useRef } from 'react'
import { usePrefetchProducts } from './use-prefetch-products'

interface UsePrefetchOnHoverReturn {
  handleHover: (categoryHandle: string) => void
  cancelHover: () => void
}

export function usePrefetchOnHover(): UsePrefetchOnHoverReturn {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const { prefetchCategoryProducts } = usePrefetchProducts()

  const handleHover = (categoryHandle: string) => {
    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Schedule prefetch with delay
    timeoutRef.current = setTimeout(() => {
      console.log('HOVER PREFETCH: ', categoryHandle)
      const categoryIds = ALL_CATEGORIES_MAP[categoryHandle]
      console.log('CATEGORY IDS: ', categoryIds)

      if (categoryIds?.length) {
        // Use categoryHandle as scopedBy for potential cancellation
        prefetchCategoryProducts(categoryIds, categoryHandle)
      }
    }, PREFETCH_DELAYS.CATEGORY_HOVER)
  }

  const cancelHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
      console.log('HOVER CANCELLED')
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { handleHover, cancelHover }
}
