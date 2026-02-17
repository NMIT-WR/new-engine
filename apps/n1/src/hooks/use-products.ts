import type { StoreProduct } from "@medusajs/types"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { cacheConfig } from "@/lib/cache-config"
import { PRODUCT_LIMIT } from "@/lib/constants"
import { logQuery } from "@/lib/loggers/cache"
import { fetchLogger } from "@/lib/loggers/fetch"
import {
  buildProductQueryParams,
  type ProductQueryParams,
} from "@/lib/product-query-params"
import { queryKeys } from "@/lib/query-keys"
import { getProducts } from "@/services/product-service"
import { useRegion, useSuspenseRegion } from "./use-region"

type BaseProductsProps = {
  category_id?: string[]
  q?: string
  page?: number
  limit?: number
}

type UseProductsProps = BaseProductsProps & {
  skipIfEmptyQuery?: boolean
}

type UseSuspenseProductsProps = BaseProductsProps

type UseProductsReturn = {
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

type UseSuspenseProductsReturn = {
  products: StoreProduct[]
  isFetching: boolean
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function getProductsLabel(trimmedQuery: string, categoryIds: string[]): string {
  if (trimmedQuery.length > 0) {
    return `q:${trimmedQuery.slice(0, 12)}`
  }

  return categoryIds[0]?.slice(-6) || "all"
}

function createProductsQueryFn(queryParams: ProductQueryParams, label: string) {
  return async ({ signal }: { signal?: AbortSignal }) => {
    const start = performance.now()
    const result = await getProducts(queryParams, signal)
    const duration = performance.now() - start

    if (process.env.NODE_ENV === "development") {
      fetchLogger.current(label, duration)
    }

    return result
  }
}

function areSameStringArrays(a: string[] = [], b: string[] = []): boolean {
  if (a.length !== b.length) {
    return false
  }

  return a.every((value, index) => value === b[index])
}

function shouldKeepPreviousProductsData(
  currentParams: ProductQueryParams,
  previousParams?: ProductQueryParams
): boolean {
  if (!previousParams) {
    return false
  }

  return (
    (currentParams.q ?? "") === (previousParams.q ?? "") &&
    areSameStringArrays(currentParams.category_id, previousParams.category_id)
  )
}

function extractProductsParamsFromKey(
  queryKey: readonly unknown[] | undefined
): ProductQueryParams | undefined {
  if (!Array.isArray(queryKey) || queryKey.length < 4) {
    return undefined
  }

  const maybeParams = queryKey[3]
  if (!maybeParams || typeof maybeParams !== "object") {
    return undefined
  }

  return maybeParams as ProductQueryParams
}

export function useProducts({
  category_id = [],
  q = "",
  page = 1,
  limit = PRODUCT_LIMIT,
  skipIfEmptyQuery = false,
}: UseProductsProps): UseProductsReturn {
  const { regionId, countryCode } = useRegion()
  const trimmedQuery = q.trim()
  const hasCategoryFilter = category_id.length > 0
  const hasSearchIntent = trimmedQuery.length > 0 || hasCategoryFilter
  const label = getProductsLabel(trimmedQuery, category_id)

  const queryParams = buildProductQueryParams({
    category_id,
    q: trimmedQuery,
    region_id: regionId,
    country_code: countryCode,
    page,
    limit,
  })

  const queryFn = createProductsQueryFn(queryParams, label)
  const { data, isLoading, error, dataUpdatedAt, isFetching, isSuccess } =
    useQuery({
      queryKey: queryKeys.products.list(queryParams),
      queryFn,
      enabled: !!regionId && (!skipIfEmptyQuery || hasSearchIntent),
      placeholderData: (previousData, previousQuery) => {
        const previousParams = extractProductsParamsFromKey(
          previousQuery?.queryKey
        )

        return shouldKeepPreviousProductsData(queryParams, previousParams)
          ? previousData
          : undefined
      },
      ...cacheConfig.semiStatic,
    })

  // Enhanced dev logging with cache-logger
  if (process.env.NODE_ENV === "development" && data) {
    const operation = `useProducts(${label} p${page})`

    logQuery(operation, queryKeys.products.list(queryParams), {
      isLoading,
      isFetching,
      isSuccess,
      dataUpdatedAt,
    })
  }

  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)
  let errorMessage: string | null = null
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (error) {
    errorMessage = String(error)
  }

  return {
    products: data?.products || [],
    isLoading,
    isFetching,
    isSuccess,
    error: errorMessage,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export function useSuspenseProducts({
  category_id = [],
  q = "",
  page = 1,
  limit = PRODUCT_LIMIT,
}: UseSuspenseProductsProps): UseSuspenseProductsReturn {
  const { regionId, countryCode } = useSuspenseRegion()
  const trimmedQuery = q.trim()
  const label = getProductsLabel(trimmedQuery, category_id)

  if (!(regionId && countryCode)) {
    throw new Error("Region is required for product queries")
  }

  const queryParams = buildProductQueryParams({
    category_id,
    q: trimmedQuery,
    region_id: regionId,
    country_code: countryCode,
    page,
    limit,
  })

  const queryFn = createProductsQueryFn(queryParams, label)
  const { data, isFetching, dataUpdatedAt } = useSuspenseQuery({
    queryKey: queryKeys.products.list(queryParams),
    queryFn,
    ...cacheConfig.semiStatic,
  })

  if (process.env.NODE_ENV === "development" && data) {
    const operation = `useSuspenseProducts(${label} p${page})`

    logQuery(operation, queryKeys.products.list(queryParams), {
      isFetching,
      isSuccess: true,
      dataUpdatedAt,
    })
  }

  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / limit)

  return {
    products: data?.products || [],
    isFetching,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
