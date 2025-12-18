'use client'

import { cacheConfig } from '@/lib/cache-config'
import { fetchLogger, logQuery } from '@/lib/loggers'
import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { getProductByHandle } from '@/services/product-service'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useRegion } from './use-region'

interface UseProductParams {
  handle: string
  fields?: string
}

export function useProduct({ handle, fields }: UseProductParams) {
  const { regionId, countryCode } = useRegion()
  const queryKey = queryKeys.products.detail(handle, regionId, countryCode)

  const result = useQuery({
    queryKey,
    queryFn: async () => {
      const start = performance.now()
      const data = await getProductByHandle({
        handle,
        region_id: regionId,
        country_code: countryCode,
        fields,
      })
      const duration = performance.now() - start

      if (process.env.NODE_ENV === 'development') {
        fetchLogger.current(handle, duration)
      }

      return data
    },
    ...cacheConfig.semiStatic,
    enabled: !!handle && !!regionId && !!countryCode,
  })

  // Cache status logging
  if (process.env.NODE_ENV === 'development' && result.data) {
    logQuery(`useProduct(${handle})`, queryKey, {
      isLoading: result.isLoading,
      isFetching: result.isFetching,
      isSuccess: result.isSuccess,
      dataUpdatedAt: result.dataUpdatedAt,
    })
  }

  return result
}

export function useSuspenseProduct({ handle, fields }: UseProductParams) {
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
    regions.find((region) =>
      region.countries?.some((country) => country.iso_2 === 'cz')
    ) || regions[0]

  const regionId = selectedRegion?.id
  const countryCode = selectedRegion?.countries?.[0]?.iso_2 || 'cz'

  if (!(handle && regionId && countryCode)) {
    throw new Error('Missing required product query parameters')
  }

  const queryKey = queryKeys.products.detail(handle, regionId, countryCode)

  return useSuspenseQuery({
    queryKey,
    queryFn: async () => {
      const start = performance.now()
      const data = await getProductByHandle({
        handle,
        region_id: regionId,
        country_code: countryCode,
        fields,
      })
      const duration = performance.now() - start

      if (process.env.NODE_ENV === 'development') {
        fetchLogger.current(handle, duration)
      }

      return data
    },
    ...cacheConfig.semiStatic,
  })
}
