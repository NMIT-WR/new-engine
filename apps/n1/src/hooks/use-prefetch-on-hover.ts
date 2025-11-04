'use client'

import { ALL_CATEGORIES_MAP } from '@/lib/constants'
import { PREFETCH_DELAYS } from '@/lib/prefetch-config'
import { useCallback, useEffect, useRef } from 'react'
import { usePrefetchProducts } from './use-prefetch-products'

interface UsePrefetchOnHoverReturn {
  handleHover: (categoryHandle: string) => void
  cancelHover: () => void
}

/**
 * Smart hover-based prefetch for category navigation with delay and cancellation
 *
 * Features:
 * - 300ms delay before prefetch (balances responsiveness with avoiding waste)
 * - Cancellation on mouseLeave or rapid hover changes
 * - Automatic cleanup on unmount
 *
 * Usage:
 * ```tsx
 * const { handleHover, cancelHover } = usePrefetchOnHover()
 *
 * <TreeView.Node
 *   onTriggerHover={handleHover}  // Pass callback (gets handle from TreeView)
 *   onTriggerLeave={cancelHover}
 * />
 * ```
 */
export function usePrefetchOnHover(): UsePrefetchOnHoverReturn {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const { prefetchCategoryProducts } = usePrefetchProducts()

  const handleHover = useCallback(
    (categoryHandle: string) => {
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
    },
    [prefetchCategoryProducts]
  )

  const cancelHover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
      console.log('HOVER CANCELLED')
    }
  }, [])

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
