import type { QueryClient } from '@tanstack/react-query'
import type Medusa from '@medusajs/js-sdk'
import { createQueryKeys, type QueryKeysConfig } from '../lib/query-keys'
import { baseCacheConfig } from '../lib/cache-config'
import {
  buildProductQueryParams,
  type ProductQueryBuilderParams,
} from '../lib/product-query-params'
import {
  createProductService,
  createProductDetailService,
  type ProductServiceConfig,
} from '../services/product-service'

export interface ServerPrefetchConfig extends ProductServiceConfig {
  queryKeysConfig: QueryKeysConfig
  sdk: Medusa
  defaultCountryCode?: string
}

/**
 * Create server-side prefetch utilities
 */
export function createServerPrefetch(config: ServerPrefetchConfig) {
  const {
    queryKeysConfig,
    sdk,
    baseUrl,
    publishableKey,
    defaultCountryCode = 'cz',
  } = config

  const queryKeys = createQueryKeys(queryKeysConfig)
  const productService = createProductService({ baseUrl, publishableKey })
  const productDetailService = createProductDetailService(sdk)

  /**
   * Prefetch products for a category/page
   */
  async function prefetchProducts(
    queryClient: QueryClient,
    params: ProductQueryBuilderParams & { region_id: string }
  ): Promise<void> {
    const queryParams = buildProductQueryParams({
      country_code: defaultCountryCode,
      ...params,
    })

    await queryClient.prefetchQuery({
      queryKey: queryKeys.products.list(queryParams),
      queryFn: () => productService.getProductsGlobal(queryParams),
      ...baseCacheConfig.semiStatic,
    })
  }

  /**
   * Prefetch products for multiple categories (parallel)
   */
  async function prefetchProductsForCategories(
    queryClient: QueryClient,
    categoryIds: string[][],
    regionId: string
  ): Promise<void> {
    await Promise.all(
      categoryIds.map((category_id) =>
        prefetchProducts(queryClient, {
          category_id,
          region_id: regionId,
          country_code: defaultCountryCode,
        })
      )
    )
  }

  /**
   * Prefetch a single product by handle
   */
  async function prefetchProduct(
    queryClient: QueryClient,
    handle: string,
    regionId: string,
    countryCode = defaultCountryCode
  ): Promise<void> {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(handle, regionId, countryCode),
      queryFn: () =>
        productDetailService.getProductByHandle({
          handle,
          region_id: regionId,
          country_code: countryCode,
        }),
      ...baseCacheConfig.semiStatic,
    })
  }

  /**
   * Prefetch regions
   */
  async function prefetchRegions(queryClient: QueryClient): Promise<void> {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.regions(),
      queryFn: async () => {
        const response = await sdk.store.region.list()
        return response.regions
      },
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
    })
  }

  return {
    queryKeys,
    prefetchProducts,
    prefetchProductsForCategories,
    prefetchProduct,
    prefetchRegions,
  }
}

export type ServerPrefetch = ReturnType<typeof createServerPrefetch>
