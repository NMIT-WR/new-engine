/**
 * @libs/analytics - Unified e-commerce analytics tracking
 *
 * Recommended usage - unified hook:
 * ```tsx
 * import { useAnalytics } from '@libs/analytics/core'
 * import { useMetaAdapter } from '@libs/analytics/meta'
 * import { useGoogleAdapter } from '@libs/analytics/google'
 *
 * const analytics = useAnalytics({
 *   adapters: [useMetaAdapter(), useGoogleAdapter()]
 * })
 *
 * analytics.trackPurchase({ ... })
 * ```
 *
 * Or import from specific module paths:
 * - @libs/analytics/core - Core types and unified hook
 * - @libs/analytics/meta - Meta Pixel
 * - @libs/analytics/google - Google Ads / gtag
 * - @libs/analytics/leadhub - Leadhub CDP
 * - @libs/analytics/heureka - Heureka conversion tracking
 */

// Re-export core for convenience
export {
  useAnalytics,
  createWindowGetter,
  createTracker,
  createSimpleTracker,
} from './core'

export type {
  UseAnalyticsConfig,
  TrackingResult,
  AnalyticsAdapter,
  CoreViewContentParams,
  CoreAddToCartParams,
  CoreInitiateCheckoutParams,
  CorePurchaseParams,
  EcommerceProduct,
} from './core'

// Component re-exports for convenience
export { MetaPixel } from './meta'
