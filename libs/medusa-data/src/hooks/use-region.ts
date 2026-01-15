'use client'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useMedusaSdk, useQueryKeys, useMedusaConfig } from './context'
import type { RegionData } from '../types'

export function useRegion(): RegionData & { isLoading: boolean } {
  const sdk = useMedusaSdk()
  const queryKeys = useQueryKeys()
  const config = useMedusaConfig()

  const { data: regions = [], isLoading } = useQuery({
    queryKey: queryKeys.regions(),
    queryFn: async () => {
      const response = await sdk.store.region.list()
      return response.regions
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const selectedRegion =
    regions.find((r) =>
      r.countries?.some((c) => c.iso_2 === config.defaultCountryCode)
    ) || regions[0]

  return {
    regions,
    selectedRegion,
    regionId: selectedRegion?.id,
    countryCode:
      selectedRegion?.countries?.[0]?.iso_2 || config.defaultCountryCode,
    currencyCode: selectedRegion?.currency_code || 'czk',
    isLoading,
  }
}

export function useSuspenseRegion(): RegionData {
  const sdk = useMedusaSdk()
  const queryKeys = useQueryKeys()
  const config = useMedusaConfig()

  const { data: regions = [] } = useSuspenseQuery({
    queryKey: queryKeys.regions(),
    queryFn: async () => {
      const response = await sdk.store.region.list()
      return response.regions
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const selectedRegion =
    regions.find((r) =>
      r.countries?.some((c) => c.iso_2 === config.defaultCountryCode)
    ) || regions[0]

  return {
    regions,
    selectedRegion,
    regionId: selectedRegion?.id,
    countryCode:
      selectedRegion?.countries?.[0]?.iso_2 || config.defaultCountryCode,
    currencyCode: selectedRegion?.currency_code || 'czk',
  }
}
