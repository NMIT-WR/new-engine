import { createPromiseCache } from "@/lib/promise-cache"
import { sdk } from "@/lib/medusa-client"
import { buildMedusaQuery } from "@/utils/server-filters"

type QueryParamPrimitive = string | number | boolean
type QueryParamValue =
  | QueryParamPrimitive
  | QueryParamPrimitive[]
  | undefined
  | null

type ProductFiltersLike = {
  categories?: string[]
  sizes?: string[]
}

type ProductFetchStrategy =
  | "MEILI_SIZE_INTERSECTION"
  | "SIZE_ONLY_FALLBACK"
  | "MEILI_ONLY"
  | "DEFAULT_MEDUSA"

type MeiliSearchProductHit = {
  id?: string
}

type MeiliSearchHitsResponse = {
  hits?: MeiliSearchProductHit[]
  estimatedTotalHits?: number
  limit?: number
  offset?: number
}

type StoreProductVariantLite = {
  id?: string
  product_id?: string
}

type StoreProductVariantListResponse = {
  variants?: StoreProductVariantLite[]
  count?: number
}

type StoreProductRecord = {
  id?: string
}

type RawProductListResponse = {
  products: StoreProductRecord[]
  count: number
  limit: number
  offset: number
}

type SearchStrategyInput = {
  limit: number
  offset: number
  fields: string
  filters?: ProductFiltersLike
  category?: string | string[]
  sort?: string
  q?: string
  region_id?: string
  country_code: string
}

type PaginatedIdsPageResult = {
  ids: string[]
  itemCount: number
  totalCount?: number
}

const IDS_PAGE_SIZE = 250
const IDS_CACHE_TTL_MS = 5 * 60 * 1000
const IDS_CACHE_MAX_ENTRIES = 200

const variantSizeIdsCache = createPromiseCache<string[]>({
  maxEntries: IDS_CACHE_MAX_ENTRIES,
  ttlMs: IDS_CACHE_TTL_MS,
})

const meiliQueryIdsCache = createPromiseCache<string[]>({
  maxEntries: IDS_CACHE_MAX_ENTRIES,
  ttlMs: IDS_CACHE_TTL_MS,
})

function hasActiveCategoryFilter(
  category: string | string[] | undefined,
  filters?: ProductFiltersLike
): boolean {
  if (Array.isArray(category)) {
    return category.length > 0
  }

  if (typeof category === "string") {
    return category.length > 0
  }

  return Boolean(filters?.categories?.length)
}

function hasActiveSizeFilter(filters?: ProductFiltersLike): boolean {
  return Boolean(filters?.sizes?.length)
}

function shouldUseMeiliSearch(params: {
  q?: string
  sort?: string
  category?: string | string[]
  filters?: ProductFiltersLike
}): boolean {
  const { q, sort, category, filters } = params
  const hasQuery = Boolean(q?.trim())

  if (!hasQuery) {
    return false
  }

  if (hasActiveCategoryFilter(category, filters) || hasActiveSizeFilter(filters)) {
    return false
  }

  if (sort && sort !== "newest") {
    return false
  }

  return true
}

function shouldUseVariantSizeFallback(params: {
  filters?: ProductFiltersLike
  category?: string | string[]
}): boolean {
  const { filters, category } = params

  return (
    hasActiveSizeFilter(filters) && !hasActiveCategoryFilter(category, filters)
  )
}

function selectProductFetchStrategy(params: {
  q?: string
  sort?: string
  category?: string | string[]
  filters?: ProductFiltersLike
}): ProductFetchStrategy {
  const { q, sort, category, filters } = params
  const normalizedQuery = q?.trim()

  if (shouldUseVariantSizeFallback({ filters, category })) {
    return normalizedQuery ? "MEILI_SIZE_INTERSECTION" : "SIZE_ONLY_FALLBACK"
  }

  if (shouldUseMeiliSearch({ q: normalizedQuery, sort, category, filters })) {
    return "MEILI_ONLY"
  }

  return "DEFAULT_MEDUSA"
}

function normalizeSizes(sizes: string[] | undefined): string[] {
  if (!sizes?.length) {
    return []
  }

  const normalized = sizes.map((size) => size.trim()).filter(Boolean)
  return Array.from(new Set(normalized))
}

function getVariantSizeCacheKey(size: string, q?: string): string {
  return `${size}::${q?.trim() || ""}`
}

function getMeiliQueryCacheKey(query: string): string {
  return query.trim().toLowerCase()
}

function buildQueryString(params: Record<string, QueryParamValue>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(`${key}[]`, String(item))
      })
      continue
    }

    searchParams.append(key, String(value))
  }

  return searchParams.toString()
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

async function fetchStoreJson<TResponse>(
  path: string,
  params: Record<string, QueryParamValue>
): Promise<TResponse> {
  const queryString = buildQueryString(params)
  const response = await fetch(
    `${getBackendBaseUrl()}${path}${queryString ? `?${queryString}` : ""}`,
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

  return (await response.json()) as TResponse
}

async function fetchMeiliHits(params: {
  query: string
  limit: number
  offset: number
}): Promise<MeiliSearchHitsResponse> {
  const { query, limit, offset } = params

  return await fetchStoreJson<MeiliSearchHitsResponse>(
    "/store/meilisearch/products-hits",
    {
      query,
      limit,
      offset,
    }
  )
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

function intersectIdsPreservingOrder(ids: string[], allowedIds: string[]): string[] {
  const allowed = new Set(allowedIds)
  return ids.filter((id) => allowed.has(id))
}

async function collectIdsFromPaginatedSource(
  fetchPage: (offset: number, limit: number) => Promise<PaginatedIdsPageResult>
): Promise<string[]> {
  const ids: string[] = []
  const seen = new Set<string>()
  let offset = 0

  while (true) {
    const page = await fetchPage(offset, IDS_PAGE_SIZE)
    if (page.itemCount === 0) {
      break
    }

    for (const id of page.ids) {
      if (!id || seen.has(id)) {
        continue
      }

      seen.add(id)
      ids.push(id)
    }

    const nextOffset = offset + page.itemCount
    const totalCount = page.totalCount ?? nextOffset
    offset = nextOffset

    if (offset >= totalCount) {
      break
    }
  }

  return ids
}

async function fetchVariantProductIdsPage(params: {
  size: string
  q?: string
  limit: number
  offset: number
}): Promise<StoreProductVariantListResponse> {
  const { size, q, limit, offset } = params

  return await fetchStoreJson<StoreProductVariantListResponse>(
    "/store/product-variants",
    {
      limit,
      offset,
      fields: "product_id",
      q,
      "options[value]": size,
    }
  )
}

async function collectVariantProductIdsForSize(params: {
  size: string
  q?: string
}): Promise<string[]> {
  const { size, q } = params

  return await collectIdsFromPaginatedSource(async (offset, limit) => {
    const page = await fetchVariantProductIdsPage({
      size,
      q,
      limit,
      offset,
    })

    const variants = page.variants || []
    const ids = variants
      .map((variant) => variant.product_id?.trim())
      .filter((id): id is string => Boolean(id))

    return {
      ids,
      itemCount: variants.length,
      totalCount: page.count,
    }
  })
}

async function collectVariantProductIdsForSizeCached(params: {
  size: string
  q?: string
}): Promise<string[]> {
  const { size, q } = params
  const cacheKey = getVariantSizeCacheKey(size, q)

  return await variantSizeIdsCache.getOrCreate(cacheKey, async () => {
    return await collectVariantProductIdsForSize({ size, q })
  })
}

async function collectVariantProductIdsForSizes(params: {
  sizes: string[]
  q?: string
}): Promise<string[]> {
  const { sizes, q } = params
  const mergedIds: string[] = []
  const seen = new Set<string>()

  for (const size of sizes) {
    const ids = await collectVariantProductIdsForSizeCached({ size, q })

    for (const id of ids) {
      if (seen.has(id)) {
        continue
      }

      seen.add(id)
      mergedIds.push(id)
    }
  }

  return mergedIds
}

async function collectMeiliProductIdsForQuery(query: string): Promise<string[]> {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return []
  }

  return await collectIdsFromPaginatedSource(async (offset, limit) => {
    const page = await fetchMeiliHits({
      query: normalizedQuery,
      limit,
      offset,
    })
    const hits = page.hits || []

    return {
      ids: dedupeIdsFromHits(hits),
      itemCount: hits.length,
      totalCount: page.estimatedTotalHits,
    }
  })
}

async function collectMeiliProductIdsForQueryCached(
  query: string
): Promise<string[]> {
  const cacheKey = getMeiliQueryCacheKey(query)
  return await meiliQueryIdsCache.getOrCreate(cacheKey, async () => {
    return await collectMeiliProductIdsForQuery(query)
  })
}

async function fetchProductsByIds(params: {
  productIds: string[]
  fields: string
  region_id?: string
  country_code: string
}): Promise<StoreProductRecord[]> {
  const { productIds, fields, region_id, country_code } = params
  if (productIds.length === 0) {
    return []
  }

  const productsQuery = buildMedusaQuery(undefined, {
    id: productIds,
    limit: productIds.length,
    offset: 0,
    fields,
    ...(region_id && { region_id }),
    country_code,
  })

  const productsResponse = await sdk.store.product.list(productsQuery)
  return orderProductsByIds(
    (productsResponse.products || []) as StoreProductRecord[],
    productIds
  )
}

async function fetchProductsViaVariantSearch(params: {
  sizes: string[]
  q?: string
  limit: number
  offset: number
  fields: string
  region_id?: string
  country_code: string
}): Promise<RawProductListResponse> {
  const { sizes, q, limit, offset, fields, region_id, country_code } = params
  const productIds = await collectVariantProductIdsForSizes({ sizes, q })
  const totalCount = productIds.length
  const pagedIds = productIds.slice(offset, offset + limit)
  const products = await fetchProductsByIds({
    productIds: pagedIds,
    fields,
    region_id,
    country_code,
  })

  return {
    products,
    count: totalCount,
    limit,
    offset,
  }
}

async function fetchProductsViaMeiliAndVariantSearch(params: {
  query: string
  sizes: string[]
  limit: number
  offset: number
  fields: string
  region_id?: string
  country_code: string
}): Promise<RawProductListResponse> {
  const { query, sizes, limit, offset, fields, region_id, country_code } = params

  const [meiliIds, sizeIds] = await Promise.all([
    collectMeiliProductIdsForQueryCached(query),
    collectVariantProductIdsForSizes({ sizes }),
  ])

  const matchingIds = intersectIdsPreservingOrder(meiliIds, sizeIds)
  const totalCount = matchingIds.length
  const pagedIds = matchingIds.slice(offset, offset + limit)
  const products = await fetchProductsByIds({
    productIds: pagedIds,
    fields,
    region_id,
    country_code,
  })

  return {
    products,
    count: totalCount,
    limit,
    offset,
  }
}

async function fetchProductsViaMeili(params: {
  query: string
  limit: number
  offset: number
  fields: string
  region_id?: string
  country_code: string
}): Promise<RawProductListResponse> {
  const { query, limit, offset, fields, region_id, country_code } = params
  const hitsResponse = await fetchMeiliHits({ query, limit, offset })

  const productIds = dedupeIdsFromHits(hitsResponse.hits)
  const totalCount = hitsResponse.estimatedTotalHits ?? productIds.length
  const products = await fetchProductsByIds({
    productIds,
    fields,
    region_id,
    country_code,
  })

  return {
    products,
    count: totalCount,
    limit: hitsResponse.limit ?? limit,
    offset: hitsResponse.offset ?? offset,
  }
}

export async function tryGetProductsFromSearchStrategies(
  input: SearchStrategyInput
): Promise<RawProductListResponse | null> {
  const {
    limit,
    offset,
    fields,
    filters,
    category,
    sort,
    q,
    region_id,
    country_code,
  } = input

  const normalizedQuery = q?.trim()
  const normalizedSizes = normalizeSizes(filters?.sizes)
  const strategy = selectProductFetchStrategy({ q, sort, category, filters })

  switch (strategy) {
    case "MEILI_SIZE_INTERSECTION":
      try {
        return await fetchProductsViaMeiliAndVariantSearch({
          query: normalizedQuery || "",
          sizes: normalizedSizes,
          limit,
          offset,
          fields,
          region_id,
          country_code,
        })
      } catch (error) {
        console.warn(
          "[ProductService] Variant-size fallback failed, falling back to default listing:",
          error
        )

        try {
          return await fetchProductsViaVariantSearch({
            sizes: normalizedSizes,
            q: normalizedQuery,
            limit,
            offset,
            fields,
            region_id,
            country_code,
          })
        } catch (secondaryError) {
          console.warn(
            "[ProductService] Exact variant fallback also failed, using default listing:",
            secondaryError
          )
          return null
        }
      }
    case "SIZE_ONLY_FALLBACK":
      try {
        return await fetchProductsViaVariantSearch({
          sizes: normalizedSizes,
          q: undefined,
          limit,
          offset,
          fields,
          region_id,
          country_code,
        })
      } catch (error) {
        console.warn(
          "[ProductService] Variant-size fallback failed, falling back to default listing:",
          error
        )
        return null
      }
    case "MEILI_ONLY":
      try {
        return await fetchProductsViaMeili({
          query: normalizedQuery || "",
          limit,
          offset,
          fields,
          region_id,
          country_code,
        })
      } catch (error) {
        console.warn(
          "[ProductService] Meili search failed, falling back to default listing:",
          error
        )
        return null
      }
    case "DEFAULT_MEDUSA":
    default:
      return null
  }
}
