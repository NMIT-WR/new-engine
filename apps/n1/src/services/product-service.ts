import type { StoreProduct } from "@medusajs/types"
import { createMedusaProductService } from "@techsio/storefront-data"
import { PRODUCT_DETAILED_FIELDS, PRODUCT_LIST_FIELDS } from "@/lib/constants"
import { fetchLogger } from "@/lib/loggers/fetch"
import { sdk } from "@/lib/medusa-client"
import type { ProductQueryParams } from "@/lib/product-query-params"

export type ProductListResponse = {
  products: StoreProduct[]
  count: number
  limit: number
  offset: number
}

export type ProductDetailParams = {
  handle: string
  region_id?: string
  country_code?: string
  fields?: string
}

const baseProductService = createMedusaProductService<
  StoreProduct,
  ProductQueryParams,
  ProductDetailParams
>(sdk, {
  defaultListFields: PRODUCT_LIST_FIELDS,
  defaultDetailFields: PRODUCT_DETAILED_FIELDS,
  normalizeListQuery: (params) => ({
    ...params,
    country_code: params.country_code ?? "cz",
    fields: params.fields ?? PRODUCT_LIST_FIELDS,
  }),
  normalizeDetailQuery: (params) => ({
    handle: params.handle,
    limit: 1,
    region_id: params.region_id,
    country_code: params.country_code ?? "cz",
    fields: params.fields ?? PRODUCT_DETAILED_FIELDS,
  }),
  createGlobalFetcher: true,
})

export async function getProducts(
  params: ProductQueryParams,
  signal?: AbortSignal
): Promise<ProductListResponse> {
  const { category_id, offset } = params

  try {
    return await baseProductService.getProducts(params, signal)
  } catch (err) {
    // AbortError is expected when request is cancelled
    if (err instanceof Error && err.name === "AbortError") {
      if (process.env.NODE_ENV === "development") {
        const categoryLabel = category_id?.[0]?.slice(-6) || "all"
        fetchLogger.cancelled(categoryLabel, offset)
      }
      throw err // Let React Query handle it
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[ProductService] Failed to fetch products:", err)
    }
    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Failed to fetch products: ${message}`)
  }
}

/**
 * Fetch products without AbortSignal (for global/persistent prefetch)
 * Use for root categories that should complete even after navigation
 */
export function getProductsGlobal(
  params: ProductQueryParams
): Promise<ProductListResponse> {
  if (baseProductService.getProductsGlobal) {
    return baseProductService.getProductsGlobal(params)
  }
  return baseProductService.getProducts(params, undefined)
}

export async function getProductByHandle(
  params: ProductDetailParams,
  signal?: AbortSignal
): Promise<StoreProduct | null> {
  try {
    return await baseProductService.getProductByHandle(params, signal)
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ProductService] Failed to fetch product by handle:", err)
    }
    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Failed to fetch product: ${message}`)
  }
}
