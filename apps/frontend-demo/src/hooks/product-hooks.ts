"use client"

import {
  createProductHooks,
  type ProductDetailInputBase,
  type ProductListInputBase,
  type ProductListResponse,
} from "@techsio/storefront-data"
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
      params: ProductListServiceParams
    ): Promise<ProductListResponse<Product>> => {
      const result = await getProducts({
        limit: params.limit,
        offset: params.offset,
        filters: params.filters,
        category: params.category_id,
        sort: params.sort,
        q: params.q,
        fields: params.fields,
        region_id: params.region_id,
        country_code: params.country_code,
      })
      return result
    },
    getProductByHandle: async (
      params: ProductDetailServiceParams
    ): Promise<Product | null> => {
      try {
        return await getProduct(
          params.handle,
          params.region_id,
          params.country_code
        )
      } catch {
        return null
      }
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
  useSuspenseProducts,
  useProduct,
  useSuspenseProduct,
  usePrefetchProducts,
  usePrefetchProduct,
  usePrefetchPages,
} = productHooks
