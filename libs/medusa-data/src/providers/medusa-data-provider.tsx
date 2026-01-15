'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createMedusaClient } from '../client/sdk'
import { getQueryClient, type QueryClientConfig } from '../client/query-client'
import { createQueryKeys } from '../lib/query-keys'
import { baseCacheConfig } from '../lib/cache-config'
import {
  PRODUCT_LIST_FIELDS,
  PRODUCT_DETAILED_FIELDS,
  PRODUCT_LIMIT,
  DEFAULT_COUNTRY_CODE,
} from '../lib/constants'
import {
  MedusaDataContext,
  type MedusaDataContextValue,
  type MedusaDataConfig,
} from '../hooks/context'

export interface MedusaDataProviderProps {
  children: React.ReactNode
  /** Medusa backend URL */
  baseUrl: string
  /** Medusa publishable API key */
  publishableKey: string
  /** Query keys namespace prefix (default: 'medusa') */
  queryKeysPrefix?: string
  /** Default country code (default: 'cz') */
  defaultCountryCode?: string
  /** Default product limit per page (default: 24) */
  defaultLimit?: number
  /** Product list fields to fetch */
  productListFields?: string
  /** Product detail fields to fetch */
  productDetailFields?: string
  /** QueryClient configuration */
  queryClientConfig?: QueryClientConfig
  /** Enable debug mode for SDK */
  debug?: boolean
}

/**
 * Combined provider for Medusa data layer
 * Sets up QueryClient, Medusa SDK, and context for all hooks
 *
 * Note: Add ReactQueryDevtools separately in your app if needed:
 * ```tsx
 * import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
 * // As a child of MedusaDataProvider:
 * <ReactQueryDevtools initialIsOpen={false} />
 * ```
 */
export function MedusaDataProvider({
  children,
  baseUrl,
  publishableKey,
  queryKeysPrefix = 'medusa',
  defaultCountryCode = DEFAULT_COUNTRY_CODE,
  defaultLimit = PRODUCT_LIMIT,
  productListFields = PRODUCT_LIST_FIELDS,
  productDetailFields = PRODUCT_DETAILED_FIELDS,
  queryClientConfig,
  debug = false,
}: MedusaDataProviderProps) {
  const queryClient = getQueryClient(queryClientConfig)

  const contextValue = useMemo<MedusaDataContextValue>(() => {
    const sdk = createMedusaClient({
      baseUrl,
      publishableKey,
      debug,
    })

    const queryKeys = createQueryKeys({ prefix: queryKeysPrefix })

    const config: MedusaDataConfig = {
      baseUrl,
      publishableKey,
      defaultCountryCode,
      defaultLimit,
      productListFields,
      productDetailFields,
    }

    return {
      sdk,
      queryKeys,
      config,
      cacheConfig: baseCacheConfig,
    }
  }, [
    baseUrl,
    publishableKey,
    queryKeysPrefix,
    defaultCountryCode,
    defaultLimit,
    productListFields,
    productDetailFields,
    debug,
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <MedusaDataContext.Provider value={contextValue}>
        {children}
      </MedusaDataContext.Provider>
    </QueryClientProvider>
  )
}
