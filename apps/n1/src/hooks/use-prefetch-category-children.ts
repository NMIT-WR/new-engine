'use client'

import { allCategories } from '@/data/static/categories'
import { ALL_CATEGORIES_MAP } from '@/lib/constants'
import { prefetchLogger } from '@/lib/loggers'
// import { useQueryClient } from '@tanstack/react-query'  // Only needed for cancellation
import { useEffect } from 'react'
import { usePrefetchProducts } from './use-prefetch-products'
import { useRegion } from './use-region'

interface UsePrefetchCategoryChildrenParams {
  enabled?: boolean
  categoryHandle: string
}

export function usePrefetchCategoryChildren({
  enabled = true,
  categoryHandle,
}: UsePrefetchCategoryChildrenParams) {
  // const queryClient = useQueryClient()  // Only needed for cancellation
  const currentCategory = allCategories.find(
    (cat) => cat.handle === categoryHandle
  )
  const { regionId } = useRegion()
  const { prefetchCategoryProducts } = usePrefetchProducts()

  useEffect(() => {
    if (!enabled || !currentCategory || !regionId) return

    let isCancelled = false

    // Collect all category IDs that will be prefetched
    const children = allCategories.filter(
      (cat) => cat.parent_category_id === currentCategory.id
    )
    // const childCategoryIds = children
    //   .flatMap((child) => ALL_CATEGORIES_MAP[child.handle] || [])
    //   .filter((id): id is string => !!id)

    // Sequential prefetch with phases
    ;(async () => {
      // PHASE 1: Direct children - wait for completion
      if (children.length > 0) {
        const childHandles = children.map((c) => c.handle).join(', ')
        prefetchLogger.info('Children', `Phase 1: ${childHandles}`)

        await Promise.all(
          children.map((child) => {
            const categoryIds = ALL_CATEGORIES_MAP[child.handle]
            if (categoryIds?.length) {
              return prefetchCategoryProducts(categoryIds)
            }
            return Promise.resolve()
          })
        )

        if (isCancelled) return
        prefetchLogger.info('Children', 'Phase 1 complete')
      }
    })()

    return () => {
      isCancelled = true

      // CANCELLATION SUPPORT (requires AbortSignal in getProducts)
      // Cancel ongoing prefetch requests for this category's children
      // if (childCategoryIds.length > 0) {
      //   queryClient.cancelQueries({
      //     predicate: (query) => {
      //       const queryKey = query.queryKey
      //       // Match: ['n1', 'products', 'list', { category_id: [...], ... }]
      //       if (
      //         queryKey[0] === 'n1' &&
      //         queryKey[1] === 'products' &&
      //         queryKey[2] === 'list'
      //       ) {
      //         const params = queryKey[3] as { category_id?: string[] }
      //         const queryCategoryIds = params?.category_id || []

      //         // Cancel if query uses any of our child category IDs
      //         return queryCategoryIds.some((id) =>
      //           childCategoryIds.includes(id)
      //         )
      //       }
      //       return false
      //     },
      //   })

      //   prefetchLogger.info(
      //     'Children',
      //     `Cancelled ${childCategoryIds.length} child prefetches for ${categoryHandle}`
      //   )
      // }
    }
  }, [
    enabled,
    categoryHandle,
    regionId,
    currentCategory,
    prefetchCategoryProducts,
    // queryClient,  // Only needed for cancellation
  ])
}
