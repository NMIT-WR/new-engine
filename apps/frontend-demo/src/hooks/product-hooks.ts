"use client"

import {
  createProductHooks,
  type ProductDetailInputBase,
  type ProductListInputBase,
  type ProductListResponse,
} from "@techsio/storefront-data"
import { queryOptions } from "@tanstack/react-query"
import { storefrontCacheConfig } from "@/lib/cache-config"
import { queryKeys } from "@/lib/query-keys"
import {
  getProduct,
  getProducts,
  type ProductFilters,
} from "@/services/product-service"
import type { Product } from "@/types/product"

// Input types for the hooks
export type ProductListInput = ProductListInputBase & {
  category?: string | string[]
  sort?: string
  q?: string
  filters?: ProductFilters
  fields?: string
  offset?: number
}

export type ProductDetailInput = ProductDetailInputBase & {
  // handle is already in ProductDetailInputBase
}

// Internal service params (what gets passed to the service)
type ProductListServiceParams = {
  category_id?: string[]
  region_id?: string
  country_code?: string
  limit: number
  offset: number
  sort?: string
  q?: string
  fields?: string
  filters?: ProductFilters
}

type ProductDetailServiceParams = {
  handle: string
  region_id?: string
  country_code?: string
}

// Helper to normalize category to array
function normalizeCategoryToArray(
  category?: string | string[]
): string[] | undefined {
  if (!category) {
    return
  }
  return Array.isArray(category) ? category : [category]
}

// Build params functions
function buildListParams(input: ProductListInput): ProductListServiceParams {
  const { page = 1, limit = 12, category, filters, offset, ...rest } = input
  const resolvedOffset =
    typeof offset === "number" ? offset : (page - 1) * limit

  return {
    ...rest,
    category_id: normalizeCategoryToArray(category),
    filters,
    limit,
    offset: resolvedOffset,
  }
}

function buildDetailParams(
  input: ProductDetailInput
): ProductDetailServiceParams {
  return {
    handle: input.handle,
    region_id: input.region_id,
    country_code: input.country_code,
  }
}

function fetchProducts(
  params: ProductListServiceParams,
  signal?: AbortSignal
): Promise<ProductListResponse<Product>> {
  return getProducts(
    {
      limit: params.limit,
      offset: params.offset,
      filters: params.filters,
      category: params.category_id,
      sort: params.sort,
      q: params.q,
      fields: params.fields,
      region_id: params.region_id,
      country_code: params.country_code,
    },
    signal
  )
}

async function fetchProductByHandle(
  params: ProductDetailServiceParams,
  signal?: AbortSignal
): Promise<Product | null> {
  try {
    return await getProduct(
      params.handle,
      params.region_id,
      params.country_code,
      signal
    )
  } catch {
    return null
  }
}

/**
 * Co-located key+fn helper for Product list queries (TanStack query-options style).
 */
export function getProductsQueryOptions(input: ProductListInput) {
  const params = buildListParams(input)
  return queryOptions({
    queryKey: queryKeys.products.list(params),
    queryFn: ({ signal }) => fetchProducts(params, signal),
    ...storefrontCacheConfig.semiStatic,
  })
}

// Create the hooks
export const productHooks = createProductHooks<
  Product,
  ProductListInput,
  ProductListServiceParams,
  ProductDetailInput,
  ProductDetailServiceParams
>({
  service: {
    getProducts: async (
      params: ProductListServiceParams,
      signal?: AbortSignal
    ): Promise<ProductListResponse<Product>> => {
      return fetchProducts(params, signal)
    },
    getProductByHandle: async (
      params: ProductDetailServiceParams,
      signal?: AbortSignal
    ): Promise<Product | null> => {
      return fetchProductByHandle(params, signal)
    },
  },
  buildListParams,
  buildDetailParams,
  queryKeys: queryKeys.products,
  cacheConfig: storefrontCacheConfig,
  defaultPageSize: 12,
  requireRegion: true,
})

export const {
  useProducts,
  useInfiniteProducts: useInfiniteProductsBase,
  usePrefetchProducts,
  usePrefetchProduct,
  usePrefetchPages,
} = productHooks
