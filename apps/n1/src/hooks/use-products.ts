import { cacheConfig } from '@/lib/cache-config'
import { PRODUCT_LIMIT } from '@/lib/constants'
import { fetchLogger, logQuery } from '@/lib/loggers'
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
  isFetching: boolean
  isSuccess: boolean
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

  const { data, isLoading, error, dataUpdatedAt, isFetching, isSuccess } =
    useQuery({
      queryKey: queryKeys.products.list(queryParams),
      queryFn: async () => {
        // queryFn: async ({ signal }) => {
        const start = performance.now()
        //const result = await getProducts(queryParams, signal)
        const result = await getProducts(queryParams)
        const duration = performance.now() - start

        if (process.env.NODE_ENV === 'development') {
          const categoryLabel = category_id?.[0]?.slice(-6) || 'all'
          fetchLogger.current(categoryLabel, duration)
        }

        return result
      },
      enabled: !!regionId,
      ...cacheConfig.semiStatic,
    })

  // Enhanced dev logging with cache-logger
  if (process.env.NODE_ENV === 'development' && data) {
    const categoryName = category_id?.[0]?.slice(-6) || 'all'
    const operation = `useProducts(${categoryName} p${page})`

    logQuery(operation, queryKeys.products.list(queryParams), {
      isLoading,
      isFetching,
      isSuccess,
      dataUpdatedAt,
    })
  }

  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  return {
    products: data?.products || [],
    isLoading,
    isFetching,
    isSuccess,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
