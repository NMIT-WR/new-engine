import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

export function useRegion() {
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
    regions.find((r) => r.countries?.some((c) => c.iso_2 === 'cz')) ||
    regions[0]

  return {
    regions,
    selectedRegion,
    regionId: selectedRegion?.id,
    countryCode: selectedRegion?.countries?.[0]?.iso_2 || 'cz',
    currencyCode: selectedRegion?.currency_code || 'czk',
    isLoading,
  }
}

export function useSuspenseRegion() {
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
    regions.find((r) => r.countries?.some((c) => c.iso_2 === 'cz')) ||
    regions[0]

  return {
    regions,
    selectedRegion,
    regionId: selectedRegion?.id,
    countryCode: selectedRegion?.countries?.[0]?.iso_2 || 'cz',
    currencyCode: selectedRegion?.currency_code || 'czk',
  }
}
