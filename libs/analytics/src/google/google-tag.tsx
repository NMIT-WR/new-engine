'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import type { GoogleAdsConfig } from './types'

/** Valid Google Ads ID format: AW-XXXXXXXXX or G-XXXXXXXXX */
const VALID_ADS_ID_PATTERN = /^(AW|G)-[A-Z0-9]+$/i

/**
 * Google Tag (gtag.js) base component
 *
 * Loads the Google Tag script and configures it for Google Ads.
 * Place this component in your root layout.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { GoogleTag } from '@libs/analytics/google'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <GoogleTag adsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID!} />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function GoogleTag({ adsId, debug = false, nonce }: GoogleAdsConfig) {
  const isValidAdsId =
    typeof adsId === 'string' && VALID_ADS_ID_PATTERN.test(adsId)

  useEffect(() => {
    if (!debug || !isValidAdsId) return
    console.log('[GoogleTag] Initialized with ID:', adsId)
  }, [adsId, debug, isValidAdsId])

  if (!adsId) {
    if (debug) {
      console.warn('[GoogleTag] No Ads ID provided, skipping initialization')
    }
    return null
  }

  // Validate adsId format to prevent XSS
  if (!isValidAdsId) {
    if (debug) {
      console.error('[GoogleTag] Invalid Ads ID format:', adsId)
    }
    return null
  }

  return (
    <>
      {/* Load gtag.js from Google */}
      <Script
        id="google-tag-script"
        strategy="afterInteractive"
        nonce={nonce}
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
      />
      {/* Initialize gtag */}
      <Script
        id="google-tag-init"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${adsId}');
          `,
        }}
      />
    </>
  )
}
