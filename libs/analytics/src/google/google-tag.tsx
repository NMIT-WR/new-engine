'use client'

import Script from 'next/script'
import type { GoogleAdsConfig } from './types'

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
export function GoogleTag({ adsId, debug = false }: GoogleAdsConfig) {
  if (!adsId) {
    if (debug) {
      console.warn('[GoogleTag] No Ads ID provided, skipping initialization')
    }
    return null
  }

  return (
    <>
      {/* Load gtag.js from Google */}
      <Script
        id="google-tag-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
      />
      {/* Initialize gtag */}
      <Script
        id="google-tag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${adsId}');
            ${debug ? "console.log('[GoogleTag] Initialized with ID:', '" + adsId + "');" : ''}
          `,
        }}
      />
    </>
  )
}
