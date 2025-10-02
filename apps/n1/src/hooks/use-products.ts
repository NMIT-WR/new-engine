import { cacheConfig } from '@/lib/cache-config'
import { PRODUCT_LIMIT } from '@/lib/constants'
import { buildProductQueryParams } from '@/lib/product-query-params'
import { queryKeys } from '@/lib/query-keys'
import { getProducts } from '@/services/product-service'
import type { StoreProduct } from '@medusajs/types'
import { useQuery } from '@tanstack/react-query'
import { useRegion } from './use-region'

interface UseProductsProps {
  category_id?: string[]
  page?: number
  limit?: number
}

interface UseProductsReturn {
  products: StoreProduct[]
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function useProducts({
  category_id = [],
  page = 1,
  limit = PRODUCT_LIMIT,
}: UseProductsProps): UseProductsReturn {
  const { regionId, countryCode } = useRegion()

  const queryParams = buildProductQueryParams({
    category_id,
    region_id: regionId,
    country_code: countryCode,
    page,
    limit,
  })

  const { data, isLoading, error, dataUpdatedAt } = useQuery({
    queryKey: queryKeys.products.list(queryParams),
    queryFn: () => getProducts(queryParams),
    enabled: !!regionId,
    ...cacheConfig.semiStatic,
  })

  // Dev logging
  if (process.env.NODE_ENV === 'development' && data) {
    const cacheAge = Date.now() - dataUpdatedAt
    const source = cacheAge < 100 ? 'Fresh' : 'Cache'
    const categoryName = category_id?.[0]?.slice(-6) || 'all'
    console.log(
      `[Products] ${source} | ${categoryName} p${page} (${data.count})`
    )
  }

  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  return {
    products: data?.products || [],
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
