import type { StoreProduct } from "@medusajs/types"
import { PRODUCT_DETAILED_FIELDS } from "@/lib/constants"
import { fetchLogger } from "@/lib/loggers/fetch"
import { sdk } from "@/lib/medusa-client"
import {
  buildQueryString,
  type ProductQueryParams,
} from "@/lib/product-query-params"

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

type StoreProductsApiResponse = {
  products?: StoreProduct[]
  count?: number
  limit?: number
  offset?: number
}

type MeiliSearchProductHit = {
  id?: string
}

type MeiliSearchHitsResponse = {
  hits?: MeiliSearchProductHit[]
  estimatedTotalHits?: number
  limit?: number
  offset?: number
}

type StoreRequestContext = {
  baseUrl: string
  headers: HeadersInit
  signal?: AbortSignal
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

function createStoreRequestContext(signal?: AbortSignal): StoreRequestContext {
  return {
    baseUrl: getBackendBaseUrl(),
    headers: getStoreHeaders(),
    signal,
  }
}

function parseSearchQuery(query: string | undefined): string | null {
  const normalized = query?.trim()
  return normalized ? normalized : null
}

function getProductsLogLabel(
  searchQuery: string | null,
  categoryIds?: string[]
): string {
  if (searchQuery) {
    return `q:${searchQuery.slice(0, 12)}`
  }

  return categoryIds?.[0]?.slice(-6) || "all"
}

async function fetchJson<T>(
  url: string,
  signal: AbortSignal | undefined,
  headers: HeadersInit
): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}. ${errorBody.slice(0, 280)}`
    )
  }

  return (await response.json()) as T
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

function orderProductsByIds(products: StoreProduct[], ids: string[]): StoreProduct[] {
  const byId = new Map(products.map((product) => [product.id, product]))

  return ids
    .map((id) => byId.get(id))
    .filter((product): product is StoreProduct => Boolean(product))
}

async function fetchStoreProducts(
  params: ProductQueryParams,
  context: StoreRequestContext
): Promise<ProductListResponse> {
  const { q, category_id, region_id, country_code, limit, offset, fields } =
    params
  const queryString = buildQueryString({
    q,
    limit,
    offset,
    fields,
    country_code,
    region_id,
    category_id,
  })

  const data = await fetchJson<StoreProductsApiResponse>(
    `${context.baseUrl}/store/products?${queryString}`,
    context.signal,
    context.headers
  )

  return {
    products: data.products || [],
    count: data.count || 0,
    limit: data.limit ?? limit ?? 0,
    offset: data.offset ?? offset ?? 0,
  }
}

async function fetchSearchProducts(
  params: ProductQueryParams,
  searchQuery: string,
  context: StoreRequestContext
): Promise<ProductListResponse> {
  const { region_id, country_code, limit, offset, fields } = params
  const hitsQueryString = buildQueryString({
    query: searchQuery,
    limit,
    offset,
  })

  const hitsData = await fetchJson<MeiliSearchHitsResponse>(
    `${context.baseUrl}/store/meilisearch/products-hits?${hitsQueryString}`,
    context.signal,
    context.headers
  )

  const productIds = dedupeIdsFromHits(hitsData.hits)
  const totalCount = hitsData.estimatedTotalHits ?? productIds.length

  if (productIds.length === 0) {
    return {
      products: [],
      count: totalCount,
      limit: limit ?? hitsData.limit ?? 0,
      offset: offset ?? hitsData.offset ?? 0,
    }
  }

  const productsQueryString = buildQueryString({
    id: productIds,
    fields,
    region_id,
    country_code,
    limit: productIds.length,
    offset: 0,
  })

  const productsData = await fetchJson<StoreProductsApiResponse>(
    `${context.baseUrl}/store/products?${productsQueryString}`,
    context.signal,
    context.headers
  )

  return {
    products: orderProductsByIds(productsData.products || [], productIds),
    count: totalCount,
    limit: limit ?? hitsData.limit ?? productIds.length,
    offset: offset ?? hitsData.offset ?? 0,
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: product fetch includes error handling and logging branches
export async function getProducts(
  params: ProductQueryParams,
  signal?: AbortSignal
): Promise<ProductListResponse> {
  const searchQuery = parseSearchQuery(params.q)
  const hasCategoryFilter = (params.category_id?.length || 0) > 0
  const context = createStoreRequestContext(signal)

  try {
    if (searchQuery && !hasCategoryFilter) {
      return await fetchSearchProducts(params, searchQuery, context)
    }

    return await fetchStoreProducts(params, context)
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      if (process.env.NODE_ENV === "development") {
        fetchLogger.cancelled(
          getProductsLogLabel(searchQuery, params.category_id),
          params.offset
        )
      }
      throw err
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
  return getProducts(params, undefined)
}

export async function getProductByHandle(
  params: ProductDetailParams
): Promise<StoreProduct | null> {
  const { handle, region_id, country_code } = params

  try {
    const response = await sdk.store.product.list({
      handle,
      limit: 1,
      fields: PRODUCT_DETAILED_FIELDS,
      country_code,
      region_id,
    })

    return response.products?.[0] || null
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ProductService] Failed to fetch product by handle:", err)
    }
    const message = err instanceof Error ? err.message : "Unknown error"
    throw new Error(`Failed to fetch product: ${message}`)
  }
}
