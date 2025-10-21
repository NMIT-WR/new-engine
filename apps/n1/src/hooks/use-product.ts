'use client'

import { cacheConfig } from '@/lib/cache-config'
import { fetchLogger, logQuery } from '@/lib/loggers'
import { queryKeys } from '@/lib/query-keys'
import { getProductByHandle } from '@/services/product-service'
import { useQuery } from '@tanstack/react-query'
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
