'use client'

import { useRef } from 'react'
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

export interface Analytics {
  trackViewContent: (params: CoreViewContentParams) => TrackingResult
  trackAddToCart: (params: CoreAddToCartParams) => TrackingResult
  trackInitiateCheckout: (params: CoreInitiateCheckoutParams) => TrackingResult
  trackPurchase: (params: CorePurchaseParams) => TrackingResult
  trackCustom: (
    eventName: string,
    params?: Record<string, unknown>
  ) => TrackingResult
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
export function useAnalytics({
  adapters,
  debug,
}: UseAnalyticsConfig): Analytics {
  // Stable ref for adapters to prevent callback recreation on every render
  // when consumers pass a new array reference (e.g., inline array literals)
  const adaptersRef = useRef(adapters)
  adaptersRef.current = adapters

  // Stable ref for debug flag, so we can keep stable methods without
  // useCallback/useMemo churn.
  const debugRef = useRef(debug)
  debugRef.current = debug

  const analyticsRef = useRef<Analytics | null>(null)

  if (!analyticsRef.current) {
    const executeAcrossAdapters = (
      label: string,
      run: (adapter: AnalyticsAdapter) => boolean | undefined
    ): TrackingResult => {
      const results: Record<string, boolean> = {}
      let allSuccess = true

      for (const adapter of adaptersRef.current) {
        try {
          const success = run(adapter)
          results[adapter.key] = success ?? true

          if (success === false) {
            allSuccess = false
          }
        } catch (error) {
          results[adapter.key] = false
          allSuccess = false
          if (debugRef.current) {
            console.error(
              `[Analytics:${adapter.key}] Error in ${label}:`,
              error
            )
          }
        }
      }

      if (debugRef.current) {
        console.log(`[Analytics] ${label} results:`, results)
      }

      return { success: allSuccess, results }
    }

    analyticsRef.current = {
      trackViewContent: (params) =>
        executeAcrossAdapters('trackViewContent', (adapter) =>
          adapter.trackViewContent?.(params)
        ),

      trackAddToCart: (params) =>
        executeAcrossAdapters('trackAddToCart', (adapter) =>
          adapter.trackAddToCart?.(params)
        ),

      trackInitiateCheckout: (params) =>
        executeAcrossAdapters('trackInitiateCheckout', (adapter) =>
          adapter.trackInitiateCheckout?.(params)
        ),

      trackPurchase: (params) =>
        executeAcrossAdapters('trackPurchase', (adapter) =>
          adapter.trackPurchase?.(params)
        ),

      trackCustom: (eventName, params) =>
        executeAcrossAdapters(`trackCustom(${eventName})`, (adapter) =>
          adapter.trackCustom?.(eventName, params)
        ),
    }
  }

  const analytics = analyticsRef.current
  if (!analytics) {
    throw new Error('Analytics not initialized')
  }

  return analytics
}
