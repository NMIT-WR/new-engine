'use client'

import { useCallback } from 'react'
import type {
  ViewContentParams,
  AddToCartParams,
  InitiateCheckoutParams,
  PurchaseParams,
} from './types'

/**
 * Check if fbq is available (client-side only)
 */
function getFbq() {
  if (typeof window !== 'undefined' && window.fbq) {
    return window.fbq
  }
  return null
}

/**
 * Hook for tracking Meta Pixel events
 *
 * @example
 * ```tsx
 * const { trackViewContent, trackAddToCart, trackPurchase } = useMetaPixel()
 *
 * // Track product view
 * trackViewContent({
 *   content_ids: ['SKU123'],
 *   content_type: 'product',
 *   content_name: 'Product Name',
 *   currency: 'CZK',
 *   value: 299
 * })
 * ```
 */
export function useMetaPixel() {
  /**
   * Track ViewContent - when user views a product
   */
  const trackViewContent = useCallback((params: ViewContentParams) => {
    const fbq = getFbq()
    if (fbq) {
      fbq('track', 'ViewContent', params)
    }
  }, [])

  /**
   * Track AddToCart - when user adds item to cart
   */
  const trackAddToCart = useCallback((params: AddToCartParams) => {
    const fbq = getFbq()
    if (fbq) {
      fbq('track', 'AddToCart', params)
    }
  }, [])

  /**
   * Track InitiateCheckout - when user enters checkout
   */
  const trackInitiateCheckout = useCallback((params: InitiateCheckoutParams) => {
    const fbq = getFbq()
    if (fbq) {
      fbq('track', 'InitiateCheckout', params)
    }
  }, [])

  /**
   * Track Purchase - when order is completed
   * Note: currency and value are REQUIRED by Meta
   */
  const trackPurchase = useCallback((params: PurchaseParams) => {
    const fbq = getFbq()
    if (fbq) {
      fbq('track', 'Purchase', params)
    }
  }, [])

  /**
   * Track custom event
   */
  const trackCustom = useCallback((eventName: string, params?: object) => {
    const fbq = getFbq()
    if (fbq) {
      fbq('trackCustom', eventName, params)
    }
  }, [])

  /**
   * Track standard event (generic)
   */
  const track = useCallback((eventName: string, params?: object) => {
    const fbq = getFbq()
    if (fbq) {
      fbq('track', eventName as any, params)
    }
  }, [])

  return {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackCustom,
    track,
  }
}
