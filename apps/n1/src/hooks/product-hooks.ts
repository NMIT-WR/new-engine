import type { StoreProduct } from "@medusajs/types"
import {
  createProductHooks,
  createProductQueryKeys,
  type ProductListResponse,
} from "@techsio/storefront-data"
import { PRODUCT_LIMIT, PRODUCT_LIST_FIELDS } from "@/lib/constants"
import {
  getProducts,
  getProductsGlobal,
  getProductByHandle,
  type ProductDetailParams,
} from "@/services/product-service"

/**
 * Input types for product hooks
 */
export type ProductListInput = {
  category_id?: string[]
  page?: number
  limit?: number
  enabled?: boolean
  region_id?: string
  country_code?: string
}

export type ProductDetailInput = {
  handle: string
  fields?: string
  enabled?: boolean
  region_id?: string
  country_code?: string
}

/**
 * Internal params types (what the service receives)
 */
type ProductListParams = {
  category_id?: string[]
  region_id?: string
  country_code?: string
  limit: number
  offset: number
  fields?: string
}

/**
 * Build list params from input (page -> offset conversion)
 */
function buildListParams(input: ProductListInput): ProductListParams {
  const { page = 1, limit = PRODUCT_LIMIT, ...rest } = input

  return {
    fields: PRODUCT_LIST_FIELDS,
    country_code: "cz",
    ...rest,
    limit,
    offset: (page - 1) * limit,
  }
}

/**
 * Build detail params from input
 */
function buildDetailParams(input: ProductDetailInput): ProductDetailParams {
  return {
    handle: input.handle,
    region_id: input.region_id,
    country_code: input.country_code ?? "cz",
    fields: input.fields,
  }
}

/**
 * Custom query keys to maintain cache compatibility with existing n1 keys
 */
const productQueryKeys = createProductQueryKeys<
  ProductListParams,
  ProductDetailParams
>("n1")

/**
 * Adapter for getProductByHandle to match ProductService interface
 * (storefront-data expects signal parameter)
 */
function getProductByHandleAdapter(
  params: ProductDetailParams,
  _signal?: AbortSignal
): Promise<StoreProduct | null> {
  return getProductByHandle(params)
}

/**
 * Create product hooks using storefront-data factory
 */
export const {
  useProducts,
  useInfiniteProducts,
  useSuspenseProducts,
  useProduct,
  useSuspenseProduct,
  usePrefetchProducts,
  usePrefetchProduct,
  usePrefetchPages,
} = createProductHooks<
  StoreProduct,
  ProductListInput,
  ProductListParams,
  ProductDetailInput,
  ProductDetailParams
>({
  service: {
    getProducts: getProducts as (
      params: ProductListParams,
      signal?: AbortSignal
    ) => Promise<ProductListResponse<StoreProduct>>,
    getProductsGlobal: getProductsGlobal as (
      params: ProductListParams,
      signal?: AbortSignal
    ) => Promise<ProductListResponse<StoreProduct>>,
    getProductByHandle: getProductByHandleAdapter,
  },
  buildListParams,
  buildDetailParams,
  queryKeys: productQueryKeys,
  queryKeyNamespace: "n1",
  defaultPageSize: PRODUCT_LIMIT,
  requireRegion: true,
})
