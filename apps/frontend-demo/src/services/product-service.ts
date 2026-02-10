import { sdk } from "@/lib/medusa-client"
import type { Product } from "@/types/product"
import { buildMedusaQuery } from "@/utils/server-filters"

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

interface MeiliSearchGuardInput {
  q?: string
  sort?: string
  category?: string | string[]
  filters?: ProductFilters
}

interface MeiliSearchProductHit {
  id?: string
}

interface MeiliSearchHitsResponse {
  hits?: MeiliSearchProductHit[]
  estimatedTotalHits?: number
  limit?: number
  offset?: number
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

function hasActiveCategoryFilter(
  category: string | string[] | undefined,
  filters?: ProductFilters
): boolean {
  if (Array.isArray(category)) {
    return category.length > 0
  }

  if (typeof category === "string") {
    return category.length > 0
  }

  return Boolean(filters?.categories?.length)
}

function hasActiveSizeFilter(filters?: ProductFilters): boolean {
  return Boolean(filters?.sizes?.length)
}

function shouldUseMeiliSearch({
  q,
  sort,
  category,
  filters,
}: MeiliSearchGuardInput): boolean {
  const hasQuery = Boolean(q?.trim())

  if (!hasQuery) {
    return false
  }

  if (hasActiveCategoryFilter(category, filters) || hasActiveSizeFilter(filters)) {
    return false
  }

  // Keep the original backend path for explicit non-default sorting,
  // because Meili relevance ordering and custom sorting are different concerns.
  if (sort && sort !== "newest") {
    return false
  }

  return true
}

function getBackendBaseUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
}

function getStoreHeaders(): HeadersInit {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (publishableKey) {
    headers["x-publishable-api-key"] = publishableKey
  }

  return headers
}

async function fetchMeiliHits(params: {
  query: string
  limit: number
  offset: number
}): Promise<MeiliSearchHitsResponse> {
  const { query, limit, offset } = params
  const searchParams = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset),
  })

  const response = await fetch(
    `${getBackendBaseUrl()}/store/meilisearch/products-hits?${searchParams.toString()}`,
    {
      method: "GET",
      headers: getStoreHeaders(),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}. ${errorBody.slice(0, 280)}`
    )
  }

  return (await response.json()) as MeiliSearchHitsResponse
}

function dedupeIdsFromHits(hits: MeiliSearchProductHit[] | undefined): string[] {
  const ids: string[] = []
  const seen = new Set<string>()

  for (const hit of hits || []) {
    const id = hit.id?.trim()

    if (!id || seen.has(id)) {
      continue
    }

    seen.add(id)
    ids.push(id)
  }

  return ids
}

function orderProductsByIds<TProduct extends { id?: string }>(
  products: TProduct[],
  ids: string[]
): TProduct[] {
  const byId = new Map<string, TProduct>()

  for (const product of products) {
    if (product.id) {
      byId.set(product.id, product)
    }
  }

  return ids
    .map((id) => byId.get(id))
    .filter((product): product is TProduct => Boolean(product))
}

async function fetchProductsViaMeili(params: {
  query: string
  limit: number
  offset: number
  fields: string
  region_id?: string
  country_code?: string
}): Promise<ProductListResponse> {
  const { query, limit, offset, fields, region_id, country_code } = params
  const hitsResponse = await fetchMeiliHits({ query, limit, offset })

  const productIds = dedupeIdsFromHits(hitsResponse.hits)
  const totalCount = hitsResponse.estimatedTotalHits ?? productIds.length

  if (productIds.length === 0) {
    return {
      products: [],
      count: totalCount,
      limit: hitsResponse.limit ?? limit,
      offset: hitsResponse.offset ?? offset,
    }
  }

  const productsQuery = buildMedusaQuery(undefined, {
    id: productIds,
    limit: productIds.length,
    offset: 0,
    fields,
    ...(region_id && { region_id }),
    country_code: country_code ?? "cz",
  })

  const productsResponse = await sdk.store.product.list(productsQuery)
  const orderedProducts = orderProductsByIds(
    productsResponse.products || [],
    productIds
  )

  return {
    products: orderedProducts.map((product) => transformProduct(product, true)),
    count: totalCount,
    limit: hitsResponse.limit ?? limit,
    offset: hitsResponse.offset ?? offset,
  }
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
  const normalizedCountryCode = country_code ?? "cz"

  // Use either category parameter OR filters.categories, not both
  // Priority: explicit category param > filters.categories
  const categoryIds = category || filters?.categories

  if (shouldUseMeiliSearch({ q, sort, category, filters })) {
    try {
      const query = q?.trim() || ""
      return await fetchProductsViaMeili({
        query,
        limit,
        offset,
        fields,
        region_id,
        country_code: normalizedCountryCode,
      })
    } catch (error) {
      console.warn(
        "[ProductService] Meili search failed, falling back to default listing:",
        error
      )
    }
  }

  // Build base query
  const baseQuery: Record<string, any> = {
    limit,
    offset,
    q,
    category_id: categoryIds,
    fields,
    ...(region_id && { region_id }),
    country_code: normalizedCountryCode,
  }

  // Add sorting
  if (sort) {
    const sortMap: Record<string, string> = {
      newest: "id",
      "price-asc": "variants.prices.amount",
      "price-desc": "-variants.prices.amount",
      "name-asc": "title",
      "name-desc": "-title",
    }
    baseQuery.order = sortMap[sort] || sort
  }

  // Build query with server-side filters
  const queryParams = buildMedusaQuery(filters, baseQuery)

  try {
    const response = await sdk.store.product.list(queryParams)

    if (!response.products) {
      console.error("[ProductService] Invalid response structure:", response)
      return { products: [], count: 0, limit, offset }
    }

    const products = response.products.map((p) => transformProduct(p, true))

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
    country_code: country_code ?? "cz",
  })

  if (!response.products?.length) {
    throw new Error("Product not found")
  }

  return transformProduct(response.products[0], true)
}
