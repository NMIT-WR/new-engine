import { sdk } from '@/lib/medusa-client'
import type { StoreProduct } from '@medusajs/types'
import { useCallback, useState } from 'react'

interface UseSearchProductsOptions {
  limit?: number
  fields?: string
}

export function useSearchProducts(options?: UseSearchProductsOptions) {
  const [searchResults, setSearchResults] = useState<StoreProduct[]>([])
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
        const response = await sdk.store.product.list({
          q: query,
          fields: options?.fields || 'id, handle, title',
          limit: options?.limit || 10,
        })

        setSearchResults(response.products)
        return response.products
      } catch (err) {
        const error = err as Error
        console.error('Search error:', error)
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
