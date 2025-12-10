'use client'

import { useCallback } from 'react'
import type {
  AddToCartParams,
  BeginCheckoutParams,
  ConversionParams,
  PurchaseParams,
  ViewItemParams,
} from './types'

function getGtag() {
  if (typeof window !== 'undefined' && window.gtag) {
    return window.gtag
  }
  return null
}

/**
 * Hook for Google Ads event tracking
 *
 * @example
 * ```tsx
 * const { trackPurchase, trackConversion } = useGoogleAds()
 *
 * // Track a purchase (e-commerce event only)
 * trackPurchase({
 *   transaction_id: 'order_123',
 *   value: 599.50,
 *   currency: 'CZK',
 *   items: [{ id: 'variant_1', quantity: 1 }]
 * })
 *
 * // Track a purchase with conversion (e-commerce + Google Ads conversion)
 * trackPurchase(
 *   {
 *     transaction_id: 'order_123',
 *     value: 599.50,
 *     currency: 'CZK',
 *     items: [{ id: 'variant_1', quantity: 1 }]
 *   },
 *   'AW-XXXXX/YYYYY'
 * )
 *
 * // Track a standalone conversion
 * trackConversion({
 *   send_to: 'AW-XXXXX/YYYYY',
 *   value: 599.50,
 *   currency: 'CZK',
 *   transaction_id: 'order_123'
 * })
 * ```
 */
export function useGoogleAds() {
  /**
   * Track a conversion event
   * Use this for custom conversions configured in Google Ads
   */
  const trackConversion = useCallback((params: ConversionParams) => {
    const gtag = getGtag()
    if (gtag) {
      gtag('event', 'conversion', params)
    }
  }, [])

  /**
   * Track purchase event
   * This is the main conversion event for e-commerce
   */
  const trackPurchase = useCallback(
    (params: PurchaseParams, conversionLabel?: string) => {
      const gtag = getGtag()
      if (gtag) {
        // Track as e-commerce purchase event
        gtag('event', 'purchase', {
          transaction_id: params.transaction_id,
          value: params.value,
          currency: params.currency,
          items: params.items,
        })

        // If conversion label provided, also track as conversion
        if (conversionLabel) {
          gtag('event', 'conversion', {
            send_to: conversionLabel,
            value: params.value,
            currency: params.currency,
            transaction_id: params.transaction_id,
          })
        }
      }
    },
    []
  )

  /**
   * Track view_item event (remarketing)
   */
  const trackViewItem = useCallback((params: ViewItemParams) => {
    const gtag = getGtag()
    if (gtag) {
      gtag('event', 'view_item', params)
    }
  }, [])

  /**
   * Track add_to_cart event (remarketing)
   */
  const trackAddToCart = useCallback((params: AddToCartParams) => {
    const gtag = getGtag()
    if (gtag) {
      gtag('event', 'add_to_cart', params)
    }
  }, [])

  /**
   * Track begin_checkout event (remarketing)
   */
  const trackBeginCheckout = useCallback((params: BeginCheckoutParams) => {
    const gtag = getGtag()
    if (gtag) {
      gtag('event', 'begin_checkout', params)
    }
  }, [])

  /**
   * Track any custom event
   */
  const trackEvent = useCallback((eventName: string, params?: object) => {
    const gtag = getGtag()
    if (gtag) {
      gtag('event', eventName, params)
    }
  }, [])

  return {
    trackConversion,
    trackPurchase,
    trackViewItem,
    trackAddToCart,
    trackBeginCheckout,
    trackEvent,
  }
}
