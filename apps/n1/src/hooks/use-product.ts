'use client'

import { queryKeys } from '@/lib/query-keys'
import { getProductByHandle } from '@/services/product-service'
import { useRegion } from './use-region'
import { useQuery } from '@tanstack/react-query'

interface UseProductParams {
  handle: string
  fields?: string
}

export function useProduct({ handle, fields }: UseProductParams) {
  const { regionId, countryCode } = useRegion()

  return useQuery({
    queryKey: queryKeys.products.detail(handle, regionId, countryCode),
    queryFn: () =>
      getProductByHandle({
        handle,
        region_id: regionId,
        country_code: countryCode,
        fields,
      }),
    staleTime: 1000 * 60 * 60, // 1 hour - semiStatic strategy
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - semiStatic strategy
    enabled: !!handle && !!regionId && !!countryCode,
  })
}
