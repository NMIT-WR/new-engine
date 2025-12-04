/**
 * Meta Pixel TypeScript definitions
 * Based on: https://developers.facebook.com/docs/meta-pixel/reference
 */

// Standard e-commerce events
export type MetaPixelStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Search'

// Parameters for ViewContent event
export interface ViewContentParams {
  content_ids?: string[]
  content_type?: 'product' | 'product_group'
  content_name?: string
  content_category?: string
  currency?: string
  value?: number
}

// Parameters for AddToCart event
export interface AddToCartParams {
  content_ids?: string[]
  content_type?: 'product' | 'product_group'
  content_name?: string
  currency?: string
  value?: number
  contents?: Array<{
    id: string
    quantity: number
    item_price?: number
  }>
}

// Parameters for InitiateCheckout event
export interface InitiateCheckoutParams {
  content_ids?: string[]
  content_type?: 'product' | 'product_group'
  currency?: string
  value?: number
  num_items?: number
  contents?: Array<{
    id: string
    quantity: number
    item_price?: number
  }>
}

// Parameters for Purchase event (currency and value are REQUIRED)
export interface PurchaseParams {
  currency: string
  value: number
  content_ids?: string[]
  content_type?: 'product' | 'product_group'
  num_items?: number
  contents?: Array<{
    id: string
    quantity: number
    item_price?: number
  }>
}

// fbq function signature
export interface MetaPixelFbq {
  (action: 'init', pixelId: string): void
  (action: 'track', event: MetaPixelStandardEvent, params?: object): void
  (action: 'trackCustom', event: string, params?: object): void
  callMethod?: (...args: unknown[]) => void
  queue?: unknown[]
  loaded?: boolean
  version?: string
  push?: (...args: unknown[]) => void
}

// Extend Window interface
declare global {
  interface Window {
    fbq: MetaPixelFbq
    _fbq: MetaPixelFbq
  }
}

export interface MetaPixelConfig {
  pixelId: string
  debug?: boolean
}
