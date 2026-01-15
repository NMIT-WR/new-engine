import type { StoreProduct, StoreRegion } from '@medusajs/types'

export type { StoreProduct, StoreRegion }

/**
 * Product list response from Medusa API
 */
export interface ProductListResponse {
  products: StoreProduct[]
  count: number
  limit: number
  offset: number
}

/**
 * Parameters for fetching a single product
 */
export interface ProductDetailParams {
  handle: string
  region_id?: string
  country_code?: string
  fields?: string
}

/**
 * Region data with extracted values
 */
export interface RegionData {
  regions: StoreRegion[]
  selectedRegion: StoreRegion | undefined
  regionId: string | undefined
  countryCode: string
  currencyCode: string
}

/**
 * Medusa data provider context
 */
export interface MedusaDataContextValue {
  sdk: import('@medusajs/js-sdk').default
  queryKeys: import('../lib/query-keys').QueryKeys
  config: {
    baseUrl: string
    publishableKey: string
    defaultCountryCode: string
  }
}
