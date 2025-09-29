import { cacheConfig } from '@/lib/cache-config'
import { PRODUCT_FIELDS, PRODUCT_LIMIT } from '@/lib/constants'
import { queryKeys } from '@/lib/query-keys'
import { getProducts } from '@/services/product-service'
import { useQuery } from '@tanstack/react-query'
import { useRegion } from './use-region'

interface UseProductsProps {
  category_id?: string[]
}

export function useProducts({ category_id = [] }: UseProductsProps) {
  const { regionId, countryCode } = useRegion()

  const queryKey = queryKeys.products.list({
    category_id,
    region_id: regionId,
    country_code: countryCode,
    limit: PRODUCT_LIMIT,
    fields: PRODUCT_FIELDS,
  })

  return useQuery({
    queryKey,
    queryFn: () =>
      getProducts({
        category_id,
        region_id: regionId,
        country_code: countryCode,
      }),
    enabled: !!regionId,
    ...cacheConfig.semiStatic,
  })
}
