'use client'

import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { regionStore, setSelectedRegionId } from '@/stores/region-store'
import { useStore } from '@tanstack/react-store'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useRegions() {
  const queryClient = useQueryClient()
  const selectedRegionId = useStore(regionStore, (state) => state.selectedRegionId)

  const { data: regions = [], isLoading, error } = useQuery({
    queryKey: queryKeys.regions(),
    queryFn: async () => {
      const response = await sdk.store.region.list()
      return response.regions
    },
    staleTime: Number.POSITIVE_INFINITY, // Regions rarely change
    gcTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  })

  // Initialize selected region from regions list or default to USD
  useEffect(() => {
    if (regions.length > 0 && !selectedRegionId) {
      // Default to USD region if no stored preference
      const defaultRegion =
        regions.find((r) => r.currency_code === 'usd') ||
        regions.find((r) => r.currency_code === 'eur') ||
        regions[0]
      
      if (defaultRegion) {
        setSelectedRegionId(defaultRegion.id)
        // Invalidate queries that depend on region
        queryClient.invalidateQueries({ queryKey: queryKeys.products() })
        queryClient.invalidateQueries({ queryKey: queryKeys.cart() })
      }
    }
  }, [regions, selectedRegionId, queryClient])

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || null

  const setSelectedRegion = (region: any) => {
    if (region?.id) {
      setSelectedRegionId(region.id)
      // Invalidate queries that depend on region
      queryClient.invalidateQueries({ queryKey: queryKeys.products() })
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() })
    }
  }

  return {
    regions,
    selectedRegion,
    setSelectedRegion,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

// Hook to get current region (with localStorage persistence)
export function useCurrentRegion() {
  const { selectedRegion, isLoading, error } = useRegions()
  return { region: selectedRegion, isLoading, error }
}
