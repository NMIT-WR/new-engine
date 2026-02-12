"use client"

import { useCallback, useMemo, useState } from "react"
import { useProducts } from "@/hooks/product-hooks"
import type { Product } from "@/types/product"

interface UseSearchProductsOptions {
  limit?: number
  fields?: string
}

export function useSearchProducts(options?: UseSearchProductsOptions) {
  const [query, setQuery] = useState("")
  const limit = options?.limit ?? 10
  const fields = options?.fields ?? "id, handle, title"
  const hasQuery = query.trim().length > 0

  const { products, isLoading, isFetching, error } = useProducts({
    q: hasQuery ? query : undefined,
    fields,
    limit,
    sort: "newest",
    enabled: hasQuery,
  })

  const searchResults = useMemo<Product[]>(
    () => (hasQuery ? products : []),
    [hasQuery, products]
  )

  const searchProducts = useCallback(
    async (nextQuery: string) => {
      setQuery(nextQuery)
      return []
    },
    [setQuery]
  )

  const clearResults = useCallback(() => {
    setQuery("")
  }, [])

  return {
    searchResults,
    isSearching: isLoading || isFetching,
    error: error ? new Error(error) : null,
    searchProducts,
    clearResults,
  }
}
