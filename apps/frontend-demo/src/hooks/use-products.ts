'use client'

import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { getProduct, getProducts, ProductListParams, type ProductFilters } from '@/services/product-service'
import type { Product } from '@/types/product'
import { useQuery } from '@tanstack/react-query'

interface UseProductsParams extends ProductListParams {
  page?: number
}

interface UseProductsReturn {
  products: Product[]
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Hook for fetching product lists with pagination and filtering
 */
export function useProducts(params: UseProductsParams = {}): UseProductsReturn {
  const { page = 1, limit = 20, filters, sort, fields, q, category, } = params
  const offset = (page - 1) * limit

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.products.list({ page, limit, filters, sort }),
    queryFn: () => getProducts({ limit, offset, filters, sort, fields, q, category }),
    ...cacheConfig.semiStatic,
  })

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

/**
 * Hook for fetching a single product by handle
 */
export function useProduct(handle: string) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.product(handle),
    queryFn: () => getProduct(handle),
    enabled: !!handle,
    ...cacheConfig.semiStatic,
  })

  return {
    product,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}
