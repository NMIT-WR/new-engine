'use client'

import { useUrlFilters } from './use-url-filters'

export function useUrlSearch() {
  const urlFilters = useUrlFilters()

  return {
    ...urlFilters,
  }
}
