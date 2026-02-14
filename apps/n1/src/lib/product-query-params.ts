import { PRODUCT_LIMIT, PRODUCT_LIST_FIELDS } from "./constants"

/**
 * Product query parameters (no `page` - only `offset` for cache consistency)
 */
export type ProductQueryParams = {
  category_id?: string[]
  region_id?: string
  country_code?: string
  q?: string
  limit?: number
  offset?: number
  fields?: string
}

/**
 * Builder params (includes `page` for convenience)
 */
interface BuilderParams extends Partial<ProductQueryParams> {
  page?: number
}

export function buildProductQueryParams(
  params: BuilderParams
): ProductQueryParams {
  const { page = 1, limit = PRODUCT_LIMIT, ...rest } = params

  return {
    fields: PRODUCT_LIST_FIELDS,
    country_code: "cz", // default, can be overridden
    ...rest,
    limit,
    offset: (page - 1) * limit,
  }
}

/**
 * Always prefetches page 1
 */
export function buildPrefetchParams(
  params: Pick<BuilderParams, "category_id" | "region_id" | "country_code">
): ProductQueryParams {
  return buildProductQueryParams({
    ...params,
    page: 1,
  })
}

/**
 * Converts query params to URL query string
 * Handles arrays using repeated [] notation
 */
type QueryParamValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>
  | null
  | undefined

export function buildQueryString(
  params: Record<string, QueryParamValue>
): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      // category_id[]=xxx&category_id[]=yyy
      value.forEach((v) => {
        searchParams.append(`${key}[]`, String(v))
      })
    } else {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
}
