"use client"

import { usePrefetchPages as useBasePrefetchPages } from "./product-hooks"

type UsePrefetchPagesParams = {
  enabled?: boolean
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  totalPages: number
  pageSize: number
  category_id: string[]
  regionId?: string
  countryCode?: string
}

/**
 * n1-specific wrapper around storefront-data's usePrefetchPages
 * Provides priority-based pagination prefetching
 *
 * Priority system:
 * - HIGH (0ms): currentPage + 1
 * - MEDIUM (500ms): currentPage + 2
 * - LOW (1500ms): previous, first, last pages
 */
export function usePrefetchPages({
  enabled = true,
  currentPage,
  hasNextPage,
  hasPrevPage,
  totalPages,
  pageSize,
  category_id,
}: UsePrefetchPagesParams) {
  // Use storefront-data's usePrefetchPages with priority mode
  // Region is automatically resolved by the product hooks factory
  useBasePrefetchPages({
    enabled,
    shouldPrefetch: enabled,
    baseInput: { category_id },
    currentPage,
    hasNextPage,
    hasPrevPage,
    totalPages,
    pageSize,
    mode: "priority",
    cacheStrategy: "semiStatic",
    delays: {
      medium: 500,
      low: 1500,
    },
  })
}
