'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useUrlFilters } from './use-url-filters'

export function useUrlSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlFilters = useUrlFilters()

  const searchQuery = searchParams.get('q') || ''

  const setSearchQuery = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  return {
    searchQuery,
    setSearchQuery,
    ...urlFilters,
  }
}
