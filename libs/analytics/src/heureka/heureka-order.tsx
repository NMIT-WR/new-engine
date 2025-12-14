'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import type { HeurekaCountry, HeurekaProductItem } from './types'

/** Max retries for SDK polling (50 × 100ms = 5 seconds) */
const MAX_POLL_RETRIES = 50

export interface HeurekaOrderProps {
  /** API key from Heureka admin panel */
  apiKey: string
  /** Unique order ID */
  orderId: string
  /** Products in the order */
  products: HeurekaProductItem[]
  /** Total order value with VAT */
  totalWithVat: number
  /** Currency code (default: CZK) */
  currency?: string
  /** Country variant: 'cz' for Heureka.cz, 'sk' for Heureka.sk */
  country?: HeurekaCountry
  /** Enable debug logging */
  debug?: boolean
  /** CSP nonce for inline scripts (optional) */
  nonce?: string
}

/**
 * HeurekaOrder - Conversion tracking for thank you page
 *
 * This component loads the Heureka SDK and sends order data
 * for conversion tracking. Place this on your order confirmation page.
 *
 * @example
 * ```tsx
 * <HeurekaOrder
 *   apiKey={process.env.NEXT_PUBLIC_HEUREKA_API_KEY}
 *   orderId={order.id}
 *   products={order.items.map(item => ({
 *     id: item.variant_id,
 *     name: item.title,
 *     priceWithVat: item.unit_price,
 *     quantity: item.quantity
 *   }))}
 *   totalWithVat={order.total}
 *   currency="CZK"
 * />
 * ```
 */
export function HeurekaOrder({
  apiKey,
  orderId,
  products,
  totalWithVat,
  currency = 'CZK',
  country = 'cz',
  debug = false,
  nonce,
}: HeurekaOrderProps) {
  const domain = country === 'sk' ? 'heureka.sk' : 'heureka.cz'
  const sent = useRef(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    if (sent.current) {
      return
    }
    if (!apiKey || !orderId || products.length === 0) {
      if (debug) {
        console.warn('[HeurekaOrder] Missing required data:', {
          apiKey: !!apiKey,
          orderId: !!orderId,
          products: products.length,
        })
      }
      return
    }

    let cancelled = false

    // Wait for heureka SDK to be ready
    let retries = 0
    const sendOrder = () => {
      // Early exit if component unmounted or already sent
      if (cancelled || sent.current) {
        return
      }

      if (typeof window.heureka !== 'function') {
        retries++
        if (retries > MAX_POLL_RETRIES) {
          if (debug) {
            console.warn(
              '[HeurekaOrder] SDK failed to load after 5s, giving up'
            )
          }
          return
        }
        if (debug) {
          console.log('[HeurekaOrder] Waiting for SDK...')
        }
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(sendOrder, 100)
        return
      }

      sent.current = true

      if (debug) {
        console.log('[HeurekaOrder] Sending order:', {
          orderId,
          products,
          totalWithVat,
          currency,
        })
      }

      // Authenticate with API key
      window.heureka('authenticate', apiKey)

      // Set order ID
      window.heureka('set_order_id', orderId)

      // Add each product
      for (const product of products) {
        window.heureka(
          'add_product',
          product.id,
          product.name,
          String(product.priceWithVat),
          String(product.quantity)
        )
      }

      // Set total and currency
      window.heureka('set_total_vat', String(totalWithVat))
      window.heureka('set_currency', currency)

      // Send the order
      window.heureka('send', 'Order')

      if (debug) {
        console.log('[HeurekaOrder] Order sent successfully')
      }
    }

    // Start checking for SDK
    sendOrder()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [apiKey, orderId, products, totalWithVat, currency, country, debug])

  if (!apiKey) {
    if (debug) {
      console.warn('[HeurekaOrder] No API key provided, skipping')
    }
    return null
  }

  return (
    <Script
      id={`heureka-order-script-${country}`}
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: `
          (function(t, r, a, c, k, i, n, g) {
            t['ROIDataObject'] = k;
            t[k] = t[k] || function() {
              (t[k].q = t[k].q || []).push(arguments)
            };
            t[k].c = i;
            n = r.createElement(a);
            g = r.getElementsByTagName(a)[0];
            n.async = 1;
            n.src = c;
            g.parentNode.insertBefore(n, g);
          })(window, document, 'script',
             'https://${domain}/ocm/sdk.js?version=2&page=thank_you',
             'heureka', '${country}');
        `,
      }}
    />
  )
}
