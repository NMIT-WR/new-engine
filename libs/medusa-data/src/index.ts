// =============================================================================
// @libs/medusa-data - Shared data fetching library for Medusa.js e-commerce
// =============================================================================

// -----------------------------------------------------------------------------
// Lib - Core utilities
// -----------------------------------------------------------------------------
export {
  createQueryKeys,
  type QueryKeys,
  type QueryKeysConfig,
} from './lib/query-keys'

export {
  baseCacheConfig,
  createCacheConfig,
  getCacheConfig,
  type CacheStrategy,
  type CacheConfigKey,
} from './lib/cache-config'

export {
  buildProductQueryParams,
  buildPrefetchParams,
  buildQueryString,
  createProductQueryParamsBuilder,
  productQueryParamsBuilder,
  type ProductQueryParams,
  type ProductQueryBuilderParams,
  type ProductQueryConfig,
} from './lib/product-query-params'

export {
  PRODUCT_LIST_FIELDS,
  PRODUCT_DETAILED_FIELDS,
  PRODUCT_LIMIT,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_CURRENCY,
} from './lib/constants'

// -----------------------------------------------------------------------------
// Client - SDK and QueryClient factories
// -----------------------------------------------------------------------------
export {
  createMedusaClient,
  getMedusaClientConfig,
  type MedusaClientConfig,
} from './client/sdk'

export {
  makeQueryClient,
  getQueryClient,
  resetBrowserQueryClient,
  type QueryClientConfig,
} from './client/query-client'

// -----------------------------------------------------------------------------
// Services - Data fetching functions
// -----------------------------------------------------------------------------
export {
  createProductService,
  createProductDetailService,
  type ProductServiceConfig,
} from './services/product-service'

export { createRegionService } from './services/region-service'

// -----------------------------------------------------------------------------
// Hooks - React Query hooks
// -----------------------------------------------------------------------------
export {
  MedusaDataContext,
  useMedusaDataContext,
  useMedusaSdk,
  useQueryKeys,
  useMedusaConfig,
  useCacheConfig,
  type MedusaDataContextValue,
  type MedusaDataConfig,
} from './hooks/context'

export { useRegion, useSuspenseRegion } from './hooks/use-region'
export { useProducts, useSuspenseProducts } from './hooks/use-products'
export { useProduct, useSuspenseProduct } from './hooks/use-product'
export { usePrefetchProducts } from './hooks/use-prefetch-products'
export { usePrefetchProduct } from './hooks/use-prefetch-product'

// -----------------------------------------------------------------------------
// Providers - React providers
// -----------------------------------------------------------------------------
export { QueryProvider } from './providers/query-provider'
export {
  MedusaDataProvider,
  type MedusaDataProviderProps,
} from './providers/medusa-data-provider'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export type {
  ProductListResponse,
  ProductDetailParams,
  RegionData,
  StoreProduct,
  StoreRegion,
} from './types'

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------
export {
  fetchLogger,
  prefetchLogger,
  cacheLogger,
  logQuery,
  logError,
} from './utils/loggers'
