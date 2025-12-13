'use client'

import { useMemo } from 'react'
import { createTracker } from '../core/create-tracker'
import { createWindowGetter } from '../core/get-global-function'
import type { AnalyticsAdapter } from '../core/types'
import type { GtagFunction } from './types'

const getGtag = createWindowGetter<GtagFunction>('gtag')

export interface UseGoogleAdapterConfig {
  /** Google Ads conversion label for purchase events */
  conversionLabel?: string
  debug?: boolean
}

/**
 * Creates a Google Ads adapter for the unified analytics hook
 *
 * @example
 * ```tsx
 * import { useAnalytics } from '@libs/analytics/core'
 * import { useGoogleAdapter } from '@libs/analytics/google'
 *
 * const analytics = useAnalytics({
 *   adapters: [useGoogleAdapter({ conversionLabel: 'AW-XXXXX/YYYYY' })]
 * })
 * ```
 */
export function useGoogleAdapter(
  config?: UseGoogleAdapterConfig
): AnalyticsAdapter {
  const { conversionLabel, debug } = config ?? {}

  return useMemo(
    (): AnalyticsAdapter => ({
      key: 'google',

      trackViewContent: createTracker(
        getGtag,
        (gtag, params) => {
          gtag('event', 'view_item', {
            currency: params.currency,
            value: params.value,
            items: [
              {
                item_id: params.productId,
                item_name: params.productName,
                item_category: params.category,
                price: params.value,
                quantity: 1,
              },
            ],
          })
        },
        debug,
        'google'
      ),

      trackAddToCart: createTracker(
        getGtag,
        (gtag, params) => {
          const quantity = params.quantity || 1 // Guard against division by zero
          gtag('event', 'add_to_cart', {
            currency: params.currency,
            value: params.value,
            items: [
              {
                item_id: params.productId,
                item_name: params.productName,
                item_category: params.category,
                price: params.value / quantity,
                quantity: quantity,
              },
            ],
          })
        },
        debug,
        'google'
      ),

      trackInitiateCheckout: createTracker(
        getGtag,
        (gtag, params) => {
          gtag('event', 'begin_checkout', {
            currency: params.currency,
            value: params.value,
            items: params.productIds.map((id) => ({
              item_id: id,
              quantity: 1,
            })),
          })
        },
        debug,
        'google'
      ),

      trackPurchase: (params) => {
        const gtag = getGtag()
        if (!gtag) {
          if (debug) {
            console.warn('[Analytics:google] gtag not available')
          }
          return false
        }

        try {
          // Track as e-commerce purchase event
          gtag('event', 'purchase', {
            transaction_id: params.orderId,
            value: params.value,
            currency: params.currency,
            items: params.products.map((p) => ({
              item_id: p.id,
              item_name: p.name,
              item_brand: undefined,
              item_category: p.category,
              price: p.price,
              quantity: p.quantity ?? 1,
            })),
          })

          // If conversion label provided, also track as conversion
          if (conversionLabel) {
            gtag('event', 'conversion', {
              send_to: conversionLabel,
              value: params.value,
              currency: params.currency,
              transaction_id: params.orderId,
            })
          }

          if (debug) {
            console.log('[Analytics:google] Purchase tracked:', params)
          }
          return true
        } catch (error) {
          if (debug) {
            console.error('[Analytics:google] Purchase error:', error)
          }
          return false
        }
      },

      trackCustom: (
        eventName: string,
        params?: Record<string, unknown>
      ): boolean => {
        const gtag = getGtag()
        if (!gtag) {
          if (debug) {
            console.warn('[Analytics:google] gtag not available')
          }
          return false
        }
        try {
          gtag('event', eventName, params)
          if (debug) {
            console.log(
              '[Analytics:google] Custom event tracked:',
              eventName,
              params
            )
          }
          return true
        } catch (error) {
          if (debug) {
            console.error('[Analytics:google] Custom event error:', error)
          }
          return false
        }
      },
    }),
    [conversionLabel, debug]
  )
}
