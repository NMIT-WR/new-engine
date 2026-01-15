'use client'

import { createContext, useContext } from 'react'
import type Medusa from '@medusajs/js-sdk'
import type { QueryKeys } from '../lib/query-keys'
import type { CacheStrategy } from '../lib/cache-config'

export interface MedusaDataConfig {
  baseUrl: string
  publishableKey: string
  defaultCountryCode: string
  defaultLimit: number
  productListFields: string
  productDetailFields: string
}

export interface MedusaDataContextValue {
  sdk: Medusa
  queryKeys: QueryKeys
  config: MedusaDataConfig
  cacheConfig: {
    semiStatic: CacheStrategy
    realtime: CacheStrategy
    userData: CacheStrategy
    static: CacheStrategy
  }
}

export const MedusaDataContext = createContext<MedusaDataContextValue | null>(
  null
)

export function useMedusaDataContext(): MedusaDataContextValue {
  const context = useContext(MedusaDataContext)
  if (!context) {
    throw new Error(
      'useMedusaDataContext must be used within a MedusaDataProvider'
    )
  }
  return context
}

/**
 * Get SDK instance from context
 */
export function useMedusaSdk(): Medusa {
  return useMedusaDataContext().sdk
}

/**
 * Get query keys from context
 */
export function useQueryKeys(): QueryKeys {
  return useMedusaDataContext().queryKeys
}

/**
 * Get config from context
 */
export function useMedusaConfig(): MedusaDataConfig {
  return useMedusaDataContext().config
}

/**
 * Get cache config from context
 */
export function useCacheConfig() {
  return useMedusaDataContext().cacheConfig
}
