'use client'

import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import { type ProductFilters, ProductService } from '@/services/product-service'
import type { Product } from '@/types/product'
import { useQuery } from '@tanstack/react-query'

interface UseProductsParams {
  page?: number
  limit?: number
  filters?: ProductFilters
  sort?: string
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
  const { page = 1, limit = 20, filters, sort } = params
  const offset = (page - 1) * limit

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.products.list({ page, limit, filters, sort }),
    queryFn: () => ProductService.getProducts({ limit, offset, filters, sort }),
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
    queryFn: () => ProductService.getProduct(handle),
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

/**
 * Hook for fetching homepage products
 */
export function useHomeProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.homeProducts(),
    queryFn: () => ProductService.getHomePageProducts(),
    ...cacheConfig.dynamic,
  })

  return {
    featured: data?.featured || [],
    newArrivals: data?.newArrivals || [],
    trending: data?.trending || [],
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
  }
}

