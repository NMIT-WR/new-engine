'use client'

import {
  useQuery,
  useSuspenseQuery,
  keepPreviousData,
} from '@tanstack/react-query'
import type { StoreProduct } from '@medusajs/types'
import { useQueryKeys, useMedusaConfig, useCacheConfig } from './context'
import { useRegion, useSuspenseRegion } from './use-region'
import { buildProductQueryParams } from '../lib/product-query-params'
import { createProductService } from '../services/product-service'
import { fetchLogger, logQuery } from '../utils/loggers'

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
  isPlaceholderData: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface UseSuspenseProductsReturn {
  products: StoreProduct[]
  isFetching: boolean
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function useProducts({
  category_id = [],
  page = 1,
  limit,
}: UseProductsProps): UseProductsReturn {
  const { regionId, countryCode } = useRegion()
  const queryKeys = useQueryKeys()
  const config = useMedusaConfig()
  const cacheConfig = useCacheConfig()
  const effectiveLimit = limit ?? config.defaultLimit

  const queryParams = buildProductQueryParams({
    category_id,
    region_id: regionId,
    country_code: countryCode,
    page,
    limit: effectiveLimit,
  })

  const productService = createProductService({
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
  })

  const {
    data,
    isLoading,
    error,
    dataUpdatedAt,
    isFetching,
    isSuccess,
    isPlaceholderData,
  } = useQuery({
      queryKey: queryKeys.products.list(queryParams),
      queryFn: async ({ signal }) => {
        const start = performance.now()
        const result = await productService.getProducts(queryParams, signal)
        const duration = performance.now() - start

        const categoryLabel = category_id?.[0]?.slice(-6) || 'all'
        fetchLogger.current(categoryLabel, duration)

        return result
      },
      enabled: !!regionId,
      placeholderData: keepPreviousData,
      ...cacheConfig.semiStatic,
    })

  // Dev logging
  if (data) {
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
  const totalPages = Math.ceil(totalCount / effectiveLimit)

  return {
    products: data?.products || [],
    isLoading,
    isFetching,
    isSuccess,
    isPlaceholderData,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
    totalCount,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export function useSuspenseProducts({
  category_id = [],
  page = 1,
  limit,
}: UseProductsProps): UseSuspenseProductsReturn {
  const { regionId, countryCode } = useSuspenseRegion()
  const queryKeys = useQueryKeys()
  const config = useMedusaConfig()
  const cacheConfig = useCacheConfig()
  const effectiveLimit = limit ?? config.defaultLimit

  if (!regionId || !countryCode) {
    throw new Error('Region is required for product queries')
  }

  const queryParams = buildProductQueryParams({
    category_id,
    region_id: regionId,
    country_code: countryCode,
    page,
    limit: effectiveLimit,
  })

  const productService = createProductService({
    baseUrl: config.baseUrl,
    publishableKey: config.publishableKey,
  })

  const { data, isFetching, dataUpdatedAt } = useSuspenseQuery({
    queryKey: queryKeys.products.list(queryParams),
    queryFn: async ({ signal }) => {
      const start = performance.now()
      const result = await productService.getProducts(queryParams, signal)
      const duration = performance.now() - start

      const categoryLabel = category_id?.[0]?.slice(-6) || 'all'
      fetchLogger.current(categoryLabel, duration)

      return result
    },
    ...cacheConfig.semiStatic,
  })

  // Dev logging
  if (data) {
    const categoryName = category_id?.[0]?.slice(-6) || 'all'
    const operation = `useSuspenseProducts(${categoryName} p${page})`

    logQuery(operation, queryKeys.products.list(queryParams), {
      isFetching,
      isSuccess: true,
      dataUpdatedAt,
    })
  }

  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / effectiveLimit)

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
