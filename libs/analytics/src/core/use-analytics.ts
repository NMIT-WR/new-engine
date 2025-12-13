'use client'

import { useCallback, useMemo, useRef } from 'react'
import type {
  AnalyticsAdapter,
  CoreAddToCartParams,
  CoreInitiateCheckoutParams,
  CorePurchaseParams,
  CoreViewContentParams,
} from './types'

/**
 * Configuration for the unified analytics hook
 */
export interface UseAnalyticsConfig {
  /** Array of analytics adapters to use */
  adapters: AnalyticsAdapter[]
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Result of tracking operation across all adapters
 */
export interface TrackingResult {
  /** Whether all adapters successfully tracked the event */
  success: boolean
  /** Results per adapter */
  results: Record<string, boolean>
}

/**
 * Unified analytics hook for tracking events across multiple providers
 *
 * @example
 * ```tsx
 * import { useAnalytics } from '@libs/analytics/core'
 * import { useMetaAdapter } from '@libs/analytics/meta'
 * import { useGoogleAdapter } from '@libs/analytics/google'
 * import { useLeadhubAdapter } from '@libs/analytics/leadhub'
 *
 * function CheckoutSuccess({ order }) {
 *   const analytics = useAnalytics({
 *     adapters: [
 *       useMetaAdapter(),
 *       useGoogleAdapter(),
 *       useLeadhubAdapter(),
 *     ],
 *     debug: process.env.NODE_ENV === 'development'
 *   })
 *
 *   useEffect(() => {
 *     analytics.trackPurchase({
 *       orderId: order.id,
 *       value: order.total,
 *       currency: 'CZK',
 *       numItems: order.items.length,
 *       products: order.items,
 *       email: customer.email,
 *     })
 *   }, [])
 * }
 * ```
 */
export function useAnalytics({ adapters, debug }: UseAnalyticsConfig) {
  // Stable ref for adapters to prevent callback recreation on every render
  // when consumers pass a new array reference (e.g., inline array literals)
  const adaptersRef = useRef(adapters)
  adaptersRef.current = adapters

  /**
   * Execute a tracking method across all adapters
   */
  const executeAcrossAdapters = useCallback(
    <TParams>(
      methodName: keyof Omit<AnalyticsAdapter, 'key'>,
      params: TParams
    ): TrackingResult => {
      const results: Record<string, boolean> = {}
      let allSuccess = true

      for (const adapter of adaptersRef.current) {
        const method = adapter[methodName] as
          | ((params: TParams) => boolean)
          | undefined

        if (method) {
          try {
            const success = method(params)
            results[adapter.key] = success
            if (!success) {
              allSuccess = false
            }
          } catch (error) {
            results[adapter.key] = false
            allSuccess = false
            if (debug) {
              console.error(
                `[Analytics:${adapter.key}] Error in ${String(methodName)}:`,
                error
              )
            }
          }
        } else {
          // Method not implemented for this adapter - not an error
          results[adapter.key] = true
        }
      }

      if (debug) {
        console.log(`[Analytics] ${String(methodName)} results:`, results)
      }

      return { success: allSuccess, results }
    },
    [debug]
  )

  const trackViewContent = useCallback(
    (params: CoreViewContentParams): TrackingResult => {
      return executeAcrossAdapters('trackViewContent', params)
    },
    [executeAcrossAdapters]
  )

  const trackAddToCart = useCallback(
    (params: CoreAddToCartParams): TrackingResult => {
      return executeAcrossAdapters('trackAddToCart', params)
    },
    [executeAcrossAdapters]
  )

  const trackInitiateCheckout = useCallback(
    (params: CoreInitiateCheckoutParams): TrackingResult => {
      return executeAcrossAdapters('trackInitiateCheckout', params)
    },
    [executeAcrossAdapters]
  )

  const trackPurchase = useCallback(
    (params: CorePurchaseParams): TrackingResult => {
      return executeAcrossAdapters('trackPurchase', params)
    },
    [executeAcrossAdapters]
  )

  const trackCustom = useCallback(
    (eventName: string, params?: Record<string, unknown>): TrackingResult => {
      const results: Record<string, boolean> = {}
      let allSuccess = true

      for (const adapter of adaptersRef.current) {
        if (adapter.trackCustom) {
          try {
            const success = adapter.trackCustom(eventName, params)
            results[adapter.key] = success
            if (!success) {
              allSuccess = false
            }
          } catch (error) {
            results[adapter.key] = false
            allSuccess = false
            if (debug) {
              console.error(
                `[Analytics:${adapter.key}] Error in trackCustom:`,
                error
              )
            }
          }
        } else {
          results[adapter.key] = true
        }
      }

      if (debug) {
        console.log(`[Analytics] trackCustom(${eventName}) results:`, results)
      }

      return { success: allSuccess, results }
    },
    [debug]
  )

  return useMemo(
    () => ({
      trackViewContent,
      trackAddToCart,
      trackInitiateCheckout,
      trackPurchase,
      trackCustom,
    }),
    [
      trackViewContent,
      trackAddToCart,
      trackInitiateCheckout,
      trackPurchase,
      trackCustom,
    ]
  )
}
