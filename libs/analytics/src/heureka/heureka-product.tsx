'use client'

import Script from 'next/script'
import type { HeurekaCountry } from './types'

export interface HeurekaProductProps {
  /** Country variant: 'cz' for Heureka.cz, 'sk' for Heureka.sk */
  country?: HeurekaCountry
  /** CSP nonce for inline scripts (optional) */
  nonce?: string
}

/**
 * HeurekaProduct - Script for product detail pages
 *
 * This component loads the Heureka SDK on product pages.
 * It automatically detects clicks from Heureka and stores
 * the tracking cookie (hg_ocm_id) for conversion attribution.
 *
 * Place this component on all product detail pages.
 *
 * @example
 * ```tsx
 * // In product detail page
 * <HeurekaProduct country="cz" />
 * ```
 */
export function HeurekaProduct({ country = 'cz', nonce }: HeurekaProductProps) {
  const domain = country === 'sk' ? 'heureka.sk' : 'heureka.cz'

  return (
    <Script
      id="heureka-product-script"
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
             'https://${domain}/ocm/sdk.js?version=2&page=product_detail',
             'heureka', '${country}');
        `,
      }}
    />
  )
}
