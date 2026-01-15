/**
 * Product query parameters (no `page` - only `offset` for cache consistency)
 */
export interface ProductQueryParams {
  category_id?: string[]
  region_id?: string
  country_code?: string
  limit?: number
  offset?: number
  fields?: string
}

/**
 * Builder params (includes `page` for convenience)
 */
export interface ProductQueryBuilderParams extends Partial<ProductQueryParams> {
  page?: number
}

export interface ProductQueryConfig {
  defaultLimit: number
  defaultFields: string
  defaultCountryCode: string
}

const DEFAULT_CONFIG: ProductQueryConfig = {
  defaultLimit: 24,
  defaultFields:
    'id,title,handle,thumbnail,' +
    'variants.title,' +
    'variants.manage_inventory,' +
    'variants.inventory_quantity,' +
    'variants.calculated_price,',
  defaultCountryCode: 'cz',
}

/**
 * Create product query params builder with custom defaults
 */
export function createProductQueryParamsBuilder(
  config: Partial<ProductQueryConfig> = {}
) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  return {
    build(params: ProductQueryBuilderParams): ProductQueryParams {
      const { page = 1, limit = mergedConfig.defaultLimit, ...rest } = params

      return {
        fields: mergedConfig.defaultFields,
        country_code: mergedConfig.defaultCountryCode,
        ...rest,
        limit,
        offset: (page - 1) * limit,
      }
    },

    buildPrefetch(
      params: Pick<
        ProductQueryBuilderParams,
        'category_id' | 'region_id' | 'country_code'
      >
    ): ProductQueryParams {
      return this.build({
        ...params,
        page: 1,
      })
    },
  }
}

/**
 * Default builder instance
 */
export const productQueryParamsBuilder = createProductQueryParamsBuilder()

/**
 * Convenience function using default builder
 */
export function buildProductQueryParams(
  params: ProductQueryBuilderParams
): ProductQueryParams {
  return productQueryParamsBuilder.build(params)
}

/**
 * Convenience function for prefetch params
 */
export function buildPrefetchParams(
  params: Pick<
    ProductQueryBuilderParams,
    'category_id' | 'region_id' | 'country_code'
  >
): ProductQueryParams {
  return productQueryParamsBuilder.buildPrefetch(params)
}

/**
 * Converts query params to URL query string
 * Handles arrays (category_id) with indexed notation
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      // category_id[0]=xxx&category_id[1]=yyy
      value.forEach((v, i) => {
        searchParams.append(`${key}[${i}]`, String(v))
      })
    } else {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
}
