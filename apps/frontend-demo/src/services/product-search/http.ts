import type {
  MeiliSearchHitsResponse,
  QueryParamValue,
  StoreProductVariantListResponse,
} from "./types"
import { STORE_FETCH_TIMEOUT_MS } from "./constants"

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
  const headers: HeadersInit = {}

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
  const url = `${getBackendBaseUrl()}${path}${queryString ? `?${queryString}` : ""}`
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), STORE_FETCH_TIMEOUT_MS)
  let response: Response

  try {
    response = await fetch(url, {
      method: "GET",
      headers: getStoreHeaders(),
      signal: abortController.signal,
    })
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Request timed out after ${STORE_FETCH_TIMEOUT_MS}ms for ${path}`
      )
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}. ${errorBody.slice(0, 280)}`
    )
  }

  return (await response.json()) as TResponse
}

export async function fetchMeiliHits(params: {
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

export async function fetchVariantProductIdsPage(params: {
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
