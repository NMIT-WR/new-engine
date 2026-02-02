import { useCallback, useState } from "react"
import { getProducts } from "@/services"
import type { Product } from "@/types/product"
import { useRegion } from "./region-hooks"

interface UseSearchProductsOptions {
  limit?: number
  fields?: string
}

export function useSearchProducts(options?: UseSearchProductsOptions) {
  const { selectedRegion } = useRegion()
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const searchProducts = useCallback(
    async (query: string) => {
      // Clear results if query is empty
      if (!query.trim()) {
        setSearchResults([])
        setError(null)
        return []
      }

      setIsSearching(true)
      setError(null)

      try {
        const response = await getProducts({
          q: query,
          fields: options?.fields || "id, handle, title",
          limit: options?.limit || 10,
          sort: "newest",
          region_id: selectedRegion?.id,
        })

        setSearchResults(response.products)
        return response.products
      } catch (err) {
        const error = err as Error
        console.error("Search error:", error)
        setError(error)
        setSearchResults([])
        return []
      } finally {
        setIsSearching(false)
      }
    },
    [options?.fields, options?.limit]
  )

  const clearResults = useCallback(() => {
    setSearchResults([])
    setError(null)
  }, [])

  return {
    searchResults,
    isSearching,
    error,
    searchProducts,
    clearResults,
  }
}
