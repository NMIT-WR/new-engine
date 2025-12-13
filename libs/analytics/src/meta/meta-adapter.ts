'use client'

import { useMemo } from 'react'
import { createTracker } from '../core/create-tracker'
import { createWindowGetter } from '../core/get-global-function'
import type { AnalyticsAdapter } from '../core/types'
import type { MetaPixelFbq } from './types'

const getFbq = createWindowGetter<MetaPixelFbq>('fbq')

export interface UseMetaAdapterConfig {
  debug?: boolean
}

/**
 * Creates a Meta Pixel adapter for the unified analytics hook
 *
 * @example
 * ```tsx
 * import { useAnalytics } from '@libs/analytics/core'
 * import { useMetaAdapter } from '@libs/analytics/meta'
 *
 * const analytics = useAnalytics({
 *   adapters: [useMetaAdapter()]
 * })
 * ```
 */
export function useMetaAdapter(
  config?: UseMetaAdapterConfig
): AnalyticsAdapter {
  const debug = config?.debug

  return useMemo(
    (): AnalyticsAdapter => ({
      key: 'meta',

      trackViewContent: createTracker(
        getFbq,
        (fbq, params) => {
          fbq('track', 'ViewContent', {
            content_ids: [params.productId],
            content_type: 'product',
            content_name: params.productName,
            currency: params.currency,
            value: params.value,
            content_category: params.category,
          })
        },
        debug,
        'meta'
      ),

      trackAddToCart: createTracker(
        getFbq,
        (fbq, params) => {
          fbq('track', 'AddToCart', {
            content_ids: [params.productId],
            content_type: 'product',
            content_name: params.productName,
            currency: params.currency,
            value: params.value,
            contents: [
              {
                id: params.productId,
                quantity: params.quantity,
              },
            ],
          })
        },
        debug,
        'meta'
      ),

      trackInitiateCheckout: createTracker(
        getFbq,
        (fbq, params) => {
          fbq('track', 'InitiateCheckout', {
            content_ids: params.productIds,
            currency: params.currency,
            value: params.value,
            num_items: params.numItems,
          })
        },
        debug,
        'meta'
      ),

      trackPurchase: createTracker(
        getFbq,
        (fbq, params) => {
          fbq('track', 'Purchase', {
            content_ids: params.products.map((p) => p.id),
            content_type: 'product',
            currency: params.currency,
            value: params.value,
            num_items: params.numItems,
            contents: params.products.map((p) => ({
              id: p.id,
              quantity: p.quantity ?? 1,
            })),
          })
        },
        debug,
        'meta'
      ),

      trackCustom: (
        eventName: string,
        params?: Record<string, unknown>
      ): boolean => {
        const fbq = getFbq()
        if (!fbq) {
          if (debug) {
            console.warn('[Analytics:meta] fbq not available')
          }
          return false
        }
        try {
          fbq('trackCustom', eventName, params)
          if (debug) {
            console.log(
              '[Analytics:meta] Custom event tracked:',
              eventName,
              params
            )
          }
          return true
        } catch (error) {
          if (debug) {
            console.error('[Analytics:meta] Custom event error:', error)
          }
          return false
        }
      },
    }),
    [debug]
  )
}
