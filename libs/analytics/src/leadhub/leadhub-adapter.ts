'use client'

import { useMemo } from 'react'
import { createSimpleTracker, createTracker } from '../core/create-tracker'
import { createWindowGetter } from '../core/get-global-function'
import type { AnalyticsAdapter } from '../core/types'
import type {
  LeadhubExtras,
  LeadhubFunction,
  LeadhubIdentifyParams,
  LeadhubSetCartParams,
  LeadhubViewCategoryParams,
} from './types'

const getLhi = createWindowGetter<LeadhubFunction>(['lhi', 'LHInsights'])

export interface UseLeadhubAdapterConfig {
  debug?: boolean
}

/**
 * Creates a Leadhub adapter for the unified analytics hook.
 * Returns AnalyticsAdapter with additional Leadhub-specific methods.
 *
 * @example
 * ```tsx
 * import { useAnalytics } from '@libs/analytics/core'
 * import { useLeadhubAdapter } from '@libs/analytics/leadhub'
 *
 * const leadhubAdapter = useLeadhubAdapter()
 *
 * // Use with unified analytics
 * const analytics = useAnalytics({
 *   adapters: [leadhubAdapter]
 * })
 *
 * // Access Leadhub-specific methods directly
 * leadhubAdapter.trackViewCategory({ category: 'Žena > Kabáty' })
 * leadhubAdapter.trackIdentify({ email: 'user@example.com', subscribe: [] })
 * ```
 */
export function useLeadhubAdapter(
  config?: UseLeadhubAdapterConfig
): AnalyticsAdapter & LeadhubExtras {
  const debug = config?.debug

  return useMemo(
    (): AnalyticsAdapter & LeadhubExtras => ({
      key: 'leadhub',

      trackViewContent: createTracker(
        getLhi,
        (lhi, params) => {
          lhi('ViewContent', {
            products: [{ product_id: params.productId }],
          })
        },
        debug,
        'leadhub'
      ),

      // Leadhub uses SetCart instead of AddToCart
      trackAddToCart: createTracker(
        getLhi,
        (lhi, params) => {
          lhi('SetCart', {
            products: [
              {
                product_id: params.productId,
                quantity: params.quantity,
                value: params.value,
                currency: params.currency,
              },
            ],
          })
        },
        debug,
        'leadhub'
      ),

      // Leadhub doesn't have a specific InitiateCheckout event
      // We can use SetCart with current cart state
      trackInitiateCheckout: createTracker(
        getLhi,
        (lhi, params) => {
          lhi('SetCart', {
            products: params.productIds.map((id) => ({
              product_id: id,
              quantity: 1,
            })),
          })
        },
        debug,
        'leadhub'
      ),

      trackPurchase: createTracker(
        getLhi,
        (lhi, params) => {
          lhi('Purchase', {
            email: params.email,
            value: params.value,
            currency: params.currency,
            order_id: params.orderId,
            products: params.products.map((p) => ({
              product_id: p.id,
              quantity: p.quantity ?? 1,
              value: p.price,
              currency: p.currency,
            })),
          })
        },
        debug,
        'leadhub'
      ),

      // Leadhub doesn't support arbitrary custom events
      trackCustom: undefined,

      // ========================================
      // Leadhub-specific methods (LeadhubExtras)
      // ========================================

      trackViewCategory: createTracker<LeadhubFunction, LeadhubViewCategoryParams>(
        getLhi,
        (lhi, params) => {
          lhi('ViewCategory', params)
        },
        debug,
        'leadhub'
      ),

      trackIdentify: createTracker<LeadhubFunction, LeadhubIdentifyParams>(
        getLhi,
        (lhi, params) => {
          lhi('Identify', params)
        },
        debug,
        'leadhub'
      ),

      trackSetCart: createTracker<LeadhubFunction, LeadhubSetCartParams>(
        getLhi,
        (lhi, params) => {
          lhi('SetCart', params)
        },
        debug,
        'leadhub'
      ),

      trackPageview: createSimpleTracker<LeadhubFunction>(
        getLhi,
        (lhi) => {
          lhi('pageview')
        },
        debug,
        'leadhub'
      ),
    }),
    [debug]
  )
}
