'use client'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { StoreProduct } from '@medusajs/types'
import {
  useQueryKeys,
  useMedusaSdk,
  useMedusaConfig,
  useCacheConfig,
} from './context'
import { useRegion, useSuspenseRegion } from './use-region'
import { createProductDetailService } from '../services/product-service'
import { fetchLogger, logQuery } from '../utils/loggers'

interface UseProductParams {
  handle: string
  fields?: string
}

interface UseProductReturn {
  data: StoreProduct | null | undefined
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  isPending: boolean
  error: Error | null
  dataUpdatedAt: number
}

interface UseSuspenseProductReturn {
  data: StoreProduct | null
  isFetching: boolean
  dataUpdatedAt: number
}

export function useProduct({
  handle,
  fields,
}: UseProductParams): UseProductReturn {
  const { regionId, countryCode } = useRegion()
  const queryKeys = useQueryKeys()
  const sdk = useMedusaSdk()
  const config = useMedusaConfig()
  const cacheConfig = useCacheConfig()

  const queryKey = queryKeys.products.detail(handle, regionId || '', countryCode)
  const productDetailService = createProductDetailService(sdk)

  const result = useQuery({
    queryKey,
    queryFn: async () => {
      const start = performance.now()
      const data = await productDetailService.getProductByHandle({
        handle,
        region_id: regionId,
        country_code: countryCode,
        fields: fields || config.productDetailFields,
      })
      const duration = performance.now() - start

      fetchLogger.current(handle, duration)

      return data
    },
    ...cacheConfig.semiStatic,
    enabled: !!handle && !!regionId && !!countryCode,
  })

  // Cache status logging
  if (result.data) {
    logQuery(`useProduct(${handle})`, queryKey, {
      isLoading: result.isLoading,
      isFetching: result.isFetching,
      isSuccess: result.isSuccess,
      dataUpdatedAt: result.dataUpdatedAt,
    })
  }

  return {
    data: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isSuccess: result.isSuccess,
    isPending: result.isPending,
    error: result.error,
    dataUpdatedAt: result.dataUpdatedAt,
  }
}

export function useSuspenseProduct({
  handle,
  fields,
}: UseProductParams): UseSuspenseProductReturn {
  const { regionId, countryCode } = useSuspenseRegion()
  const queryKeys = useQueryKeys()
  const sdk = useMedusaSdk()
  const config = useMedusaConfig()
  const cacheConfig = useCacheConfig()

  if (!(handle && regionId && countryCode)) {
    throw new Error('Missing required product query parameters')
  }

  const queryKey = queryKeys.products.detail(handle, regionId, countryCode)
  const productDetailService = createProductDetailService(sdk)

  const result = useSuspenseQuery({
    queryKey,
    queryFn: async () => {
      const start = performance.now()
      const data = await productDetailService.getProductByHandle({
        handle,
        region_id: regionId,
        country_code: countryCode,
        fields: fields || config.productDetailFields,
      })
      const duration = performance.now() - start

      fetchLogger.current(handle, duration)

      return data
    },
    ...cacheConfig.semiStatic,
  })

  return {
    data: result.data,
    isFetching: result.isFetching,
    dataUpdatedAt: result.dataUpdatedAt,
  }
}
