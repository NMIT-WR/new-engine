import { sdk } from "@/lib/medusa-client"
import type { Product } from "@/types/product"
import { buildMedusaQuery } from "@/utils/server-filters"

import { tryGetProductsFromSearchStrategies } from "./product-search"

export interface ProductFilters {
  categories?: string[]
  sizes?: string[]
  // search removed - use 'q' parameter directly
}

export interface ProductListParams {
  limit?: number
  offset?: number
  fields?: string
  filters?: ProductFilters
  category?: string | string[]
  sort?: string
  q?: string
  region_id?: string
  country_code?: string
}

export interface ProductListResponse {
  products: Product[]
  count: number
  limit: number
  offset: number
}

type ProductListQueryParams = {
  limit: number
  offset: number
  q?: string
  category_id?: string | string[]
  fields: string
  region_id?: string
  country_code: string
  order?: string
}

const DEFAULT_COUNTRY_CODE = "cz"

const SORT_MAP: Record<string, string> = {
  // Assumes Medusa IDs are time-ordered (ULID-like); if ID strategy changes, use created_at.
  newest: "id",
  "price-asc": "variants.prices.amount",
  "price-desc": "-variants.prices.amount",
  "name-asc": "title",
  "name-desc": "-title",
}

// Fields for product list views (minimal data)
const LIST_FIELDS = [
  "id",
  "title",
  "handle",
  "thumbnail",
  "variants.title",
  "*variants.calculated_price",
  "variants.inventory_quantity",
  "variants.manage_inventory",
].join(",")

// Fields for product detail views (all data)
const DETAIL_FIELDS = [
  "id",
  "title",
  "handle",
  "description",
  "thumbnail",
  "status",
  "collection_id",
  "created_at",
  "updated_at",
  "tags",
  "images.id",
  "images.url",
  "categories.id",
  "categories.name",
  "categories.handle",
  "variants.id",
  "variants.title",
  "variants.sku",
  "variants.manage_inventory",
  "variants.allow_backorder",
  "+variants.inventory_quantity",
  "variants.prices.amount",
  "variants.prices.currency_code",
  "variants.calculated_price",
  "variants.options",
].join(",")

function buildBaseListQuery(params: {
  limit: number
  offset: number
  q?: string
  category?: string | string[]
  filters?: ProductFilters
  fields: string
  sort?: string
  region_id?: string
  country_code: string
}): ProductListQueryParams {
  const {
    limit,
    offset,
    q,
    category,
    filters,
    fields,
    sort,
    region_id,
    country_code,
  } = params

  const baseQuery: ProductListQueryParams = {
    limit,
    offset,
    q,
    // Explicit category param has priority over filters.categories.
    category_id: category || filters?.categories,
    fields,
    ...(region_id && { region_id }),
    country_code,
  }

  if (sort) {
    baseQuery.order = SORT_MAP[sort] || sort
  }

  return baseQuery
}

/**
 * Fetch products with filtering, pagination and sorting
 */
export const getProducts = async (
  params: ProductListParams = {}
): Promise<ProductListResponse> => {
  const {
    limit = 20,
    offset = 0,
    filters,
    category,
    fields = LIST_FIELDS,
    sort,
    q,
    region_id,
    country_code,
  } = params
  const normalizedCountryCode = country_code ?? DEFAULT_COUNTRY_CODE

  let searchStrategyResponse: Awaited<
    ReturnType<typeof tryGetProductsFromSearchStrategies>
  > = null

  try {
    searchStrategyResponse = await tryGetProductsFromSearchStrategies({
      limit,
      offset,
      fields,
      filters,
      category,
      sort,
      q,
      region_id,
      country_code: normalizedCountryCode,
    })
  } catch (error) {
    console.warn(
      "[ProductService] Search strategy failed unexpectedly, falling back to Medusa listing:",
      error
    )
  }

  if (searchStrategyResponse) {
    const products = searchStrategyResponse.products.map((product) =>
      transformProduct(product, true)
    )

    return {
      products,
      count: searchStrategyResponse.count || products.length,
      limit: searchStrategyResponse.limit ?? limit,
      offset: searchStrategyResponse.offset ?? offset,
    }
  }

  const queryParams = buildMedusaQuery(
    filters,
    buildBaseListQuery({
      limit,
      offset,
      q,
      category,
      filters,
      fields,
      sort,
      region_id,
      country_code: normalizedCountryCode,
    })
  )

  try {
    const response = await sdk.store.product.list(queryParams)

    if (!response.products) {
      console.error("[ProductService] Invalid response structure:", response)
      return { products: [], count: 0, limit, offset }
    }

    const products = response.products.map((product) =>
      transformProduct(product, true)
    )

    return {
      products,
      count: response.count || products.length,
      limit,
      offset,
    }
  } catch (error) {
    console.error("[ProductService] Error fetching products:", error)
    throw error
  }
}

/**
 * Transform raw product data from API
 */
const transformProduct = (product: any, withVariants?: boolean): Product => {
  if (!product) {
    throw new Error("Cannot transform null product")
  }

  // Get primary variant (first one)
  const primaryVariant = product.variants?.[0]

  // Get price from primary variant
  const price = primaryVariant?.calculated_price?.calculated_amount
  const priceWithTax =
    primaryVariant?.calculated_price?.calculated_amount_with_tax

  // Since Store API doesn't provide real inventory data, we can't determine stock status
  // We'll default to true and let the detailed product page handle variant-specific availability
  const inStock = true

  const reducedImages =
    product.images && product.images.length > 2 && product.images.slice(0, 2)

  // Remove variants array from the result to reduce payload size
  const { variants, ...productWithoutVariants } = product

  const result = withVariants ? product : productWithoutVariants

  return {
    ...result,
    thumbnail: product.thumbnail,
    images: reducedImages || product.images,
    inStock,
    price,
    priceWithTax,
    primaryVariant,
  } as Product
}

export async function getProduct(
  handle: string,
  region_id?: string,
  country_code?: string
): Promise<Product> {
  const response = await sdk.store.product.list({
    handle,
    fields: DETAIL_FIELDS, // Use full fields for detail views
    limit: 1,
    region_id,
    country_code: country_code ?? DEFAULT_COUNTRY_CODE,
  })

  if (!response.products?.length) {
    throw new Error("Product not found")
  }

  return transformProduct(response.products[0], true)
}
