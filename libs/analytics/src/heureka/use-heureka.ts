'use client'

import { useCallback } from 'react'
import type { HeurekaOrderParams, HeurekaProductItem } from './types'

/**
 * Get the heureka function if available
 */
function getHeureka() {
  if (typeof window !== 'undefined' && typeof window.heureka === 'function') {
    return window.heureka
  }
  return null
}

/**
 * useHeureka - Hook for manual Heureka conversion tracking
 *
 * Use this hook when you need more control over when and how
 * conversion data is sent to Heureka.
 *
 * Note: For most use cases, prefer using the HeurekaOrder component
 * which handles SDK loading and data submission automatically.
 *
 * @example
 * ```tsx
 * const { sendOrder, isReady } = useHeureka('YOUR_API_KEY')
 *
 * useEffect(() => {
 *   if (isReady && order) {
 *     sendOrder({
 *       orderId: order.id,
 *       products: order.items.map(item => ({
 *         id: item.variant_id,
 *         name: item.title,
 *         priceWithVat: item.unit_price,
 *         quantity: item.quantity
 *       })),
 *       totalWithVat: order.total,
 *       currency: 'CZK'
 *     })
 *   }
 * }, [isReady, order])
 * ```
 */
export function useHeureka(apiKey: string) {
  /**
   * Check if Heureka SDK is loaded and ready
   */
  const isReady = useCallback(() => {
    return getHeureka() !== null
  }, [])

  /**
   * Add a single product to the current order
   */
  const addProduct = useCallback((product: HeurekaProductItem) => {
    const heureka = getHeureka()
    if (heureka) {
      heureka(
        'add_product',
        product.id,
        product.name,
        String(product.priceWithVat),
        String(product.quantity)
      )
      return true
    }
    return false
  }, [])

  /**
   * Send complete order data to Heureka
   */
  const sendOrder = useCallback(
    (params: HeurekaOrderParams) => {
      const heureka = getHeureka()
      if (!heureka) {
        console.warn('[useHeureka] SDK not loaded yet')
        return false
      }

      const { orderId, products, totalWithVat, currency = 'CZK' } = params

      // Authenticate
      heureka('authenticate', apiKey)

      // Set order ID
      heureka('set_order_id', orderId)

      // Add all products
      for (const product of products) {
        heureka(
          'add_product',
          product.id,
          product.name,
          String(product.priceWithVat),
          String(product.quantity)
        )
      }

      // Set total and currency
      heureka('set_total_vat', String(totalWithVat))
      heureka('set_currency', currency)

      // Send the order
      heureka('send', 'Order')

      return true
    },
    [apiKey]
  )

  return {
    isReady,
    addProduct,
    sendOrder,
  }
}
