import type Medusa from '@medusajs/js-sdk'
import {
  buildQueryString,
  type ProductQueryParams,
} from '../lib/product-query-params'
import { PRODUCT_DETAILED_FIELDS } from '../lib/constants'
import { fetchLogger } from '../utils/loggers'
import type { ProductDetailParams, ProductListResponse } from '../types'

export interface ProductServiceConfig {
  baseUrl: string
  publishableKey: string
}

/**
 * Create product service functions bound to a specific configuration
 */
export function createProductService(config: ProductServiceConfig) {
  const { baseUrl, publishableKey } = config

  /**
   * Fetch products with optional AbortSignal for cancellation
   */
  async function getProducts(
    params: ProductQueryParams,
    signal?: AbortSignal
  ): Promise<ProductListResponse> {
    const { category_id, region_id, country_code, limit, offset, fields } =
      params

    try {
      const queryString = buildQueryString({
        limit,
        offset,
        fields,
        country_code,
        region_id,
        category_id,
      })

      const response = await fetch(`${baseUrl}/store/products?${queryString}`, {
        signal,
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = (await response.json()) as {
        products?: import('@medusajs/types').StoreProduct[]
        count?: number
      }

      return {
        products: data.products || [],
        count: data.count ?? 0,
        limit: limit || 0,
        offset: offset || 0,
      }
    } catch (err) {
      // AbortError is expected when request is cancelled
      if (err instanceof Error && err.name === 'AbortError') {
        const categoryLabel = category_id?.[0]?.slice(-6) || 'all'
        fetchLogger.cancelled(categoryLabel, offset)
        throw err // Let React Query handle it
      }

      const message = err instanceof Error ? err.message : 'Unknown error'
      throw new Error(`Failed to fetch products: ${message}`)
    }
  }

  /**
   * Fetch products without AbortSignal (for global/persistent prefetch)
   */
  async function getProductsGlobal(
    params: ProductQueryParams
  ): Promise<ProductListResponse> {
    return getProducts(params, undefined)
  }

  return {
    getProducts,
    getProductsGlobal,
  }
}

/**
 * Create product detail service using Medusa SDK
 */
export function createProductDetailService(sdk: Medusa) {
  /**
   * Fetch a single product by handle
   */
  async function getProductByHandle(
    params: ProductDetailParams
  ): Promise<import('@medusajs/types').StoreProduct | null> {
    const { handle, region_id, country_code, fields } = params

    try {
      const response = await sdk.store.product.list({
        handle,
        limit: 1,
        fields: fields || PRODUCT_DETAILED_FIELDS,
        country_code,
        region_id,
      })

      return response.products?.[0] || null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      throw new Error(`Failed to fetch product: ${message}`)
    }
  }

  return {
    getProductByHandle,
  }
}
