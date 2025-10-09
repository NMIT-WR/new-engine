'use client'

import { allCategories } from '@/data/static/categories'
import { ALL_CATEGORIES_MAP } from '@/lib/constants'
import { chunk } from '@/utils/helpers/array'
import { sleep } from '@/utils/helpers/async'
import { useEffect } from 'react'
import { usePrefetchProducts } from './use-prefetch-products'
import { useRegion } from './use-region'

interface UsePrefetchCategoryChildrenParams {
  categoryHandle: string
}

/**
 * Progressively prefetches category children in 3 sequential phases:
 * - Phase 1: Direct children (visible in aside) - waits for completion
 * - Phase 2: Siblings - waits for completion
 * - Phase 3: All nested leaf categories - chunked (5 at a time) with 200ms pauses
 */

const DEFAULT_PAUSE = 200
const DEFAULT_CHUNK_SIZE = 5

export function usePrefetchCategoryChildren({
  categoryHandle,
}: UsePrefetchCategoryChildrenParams) {
  const currentCategory = allCategories.find(
    (cat) => cat.handle === categoryHandle
  )
  const { regionId } = useRegion()
  const { prefetchCategoryProducts } = usePrefetchProducts()

  useEffect(() => {
    if (!currentCategory || !regionId) return

    let isCancelled = false

    // Sequential prefetch with phases
    ;(async () => {
      // PHASE 1: Direct children - wait for completion
      const children = allCategories.filter(
        (cat) => cat.parent_category_id === currentCategory.id
      )

      if (children.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          const childHandles = children.map((c) => c.handle).join(', ')
          console.log(`[Prefetch Children] Phase 1: ${childHandles}`)
        }

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
        if (process.env.NODE_ENV === 'development') {
          console.log('[Prefetch Children] Phase 1 complete')
        }
      }

      // PHASE 2: Siblings - wait for completion
      /*if (currentCategory.parent_category_id) {
        const siblings = allCategories.filter(
          (cat) =>
            cat.parent_category_id === currentCategory.parent_category_id &&
            cat.id !== currentCategory.id
        )

        if (siblings.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            const siblingHandles = siblings.map((s) => s.handle).join(', ')
            console.log(`[Prefetch Children] Phase 2: ${siblingHandles}`)
          }

          await Promise.all(
            siblings.map((sibling) => {
              const categoryIds = ALL_CATEGORIES_MAP[sibling.handle]
              if (categoryIds?.length) {
                return prefetchCategoryProducts(categoryIds)
              }
              return Promise.resolve()
            })
          )

          if (isCancelled) return
          if (process.env.NODE_ENV === 'development') {
            console.log('[Prefetch Children] Phase 2 complete')
          }
        }
      }*/

      // PHASE 3: Nested leafs - chunked lazy loading (5 at a time)
      const allLeafIds = ALL_CATEGORIES_MAP[categoryHandle]

     /* if (allLeafIds?.length) {
        const leafCategories = allCategories.filter((cat) =>
          allLeafIds.includes(cat.id)
        )

        const uniqueLeafs = leafCategories.filter(
          (leaf, index, self) =>
            index === self.findIndex((l) => l.id === leaf.id)
        )

        if (uniqueLeafs.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `[Prefetch Children] Phase 3: ${uniqueLeafs.length} leafs under ${categoryHandle} (chunked)`
            )
          }

          const chunks = chunk(uniqueLeafs, DEFAULT_CHUNK_SIZE)

          for (const [index, leafChunk] of chunks.entries()) {
            if (isCancelled) return

            await Promise.all(
              leafChunk.map((leaf) => prefetchCategoryProducts([leaf.id]))
            )

            if (process.env.NODE_ENV === 'development') {
              console.log(
                `[Prefetch Children] Phase 3 chunk ${index + 1}/${chunks.length} complete`
              )
            }

            // Pause between chunks (except last one)
            if (index < chunks.length - 1) {
              await sleep(DEFAULT_PAUSE)
            }
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('[Prefetch Children] Phase 3 complete')
          }
        }
      }*/
    })()

    return () => {
      isCancelled = true
    }
  }, [categoryHandle, regionId, currentCategory, prefetchCategoryProducts])
}
