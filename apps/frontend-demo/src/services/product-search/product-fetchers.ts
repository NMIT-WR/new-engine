import { sdk } from "@/lib/medusa-client"
import { buildMedusaQuery } from "@/utils/server-filters"
import { collectMeiliProductIdsForQueryCached, collectVariantProductIdsForSizes } from "./collectors"
import { fetchMeiliHits } from "./http"
import {
  dedupeIdsFromHits,
  intersectIdsPreservingOrder,
  orderProductsByIds,
} from "./id-utils"
import type { RawProductListResponse, StoreProductRecord } from "./types"

async function fetchProductsByIds(params: {
  productIds: string[]
  fields: string
  region_id?: string
  country_code: string
}): Promise<StoreProductRecord[]> {
  // Callers should pass a page-sized ID slice to avoid oversized query strings.
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

export async function fetchProductsViaVariantSearch(params: {
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

export async function fetchProductsViaMeiliAndVariantSearch(params: {
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

export async function fetchProductsViaMeili(params: {
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
  const pageOffset = hitsResponse.offset ?? offset
  const pageLimit = hitsResponse.limit ?? limit
  const observedCount = pageOffset + productIds.length
  const hasMoreByPageSize = productIds.length >= pageLimit
  const totalCount = hasMoreByPageSize
    ? Math.max(hitsResponse.estimatedTotalHits ?? 0, observedCount)
    : observedCount

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
