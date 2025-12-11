/**
 * E-commerce event types shared across all analytics providers
 */

export interface EcommerceProduct {
  id: string
  name: string
  price: number
  currency: string
  quantity?: number
  category?: string
  variant?: string
  sku?: string
}

export interface CoreViewContentParams {
  productId: string
  productName: string
  value: number
  currency: string
  category?: string
}

export interface CoreAddToCartParams {
  productId: string
  productName: string
  value: number
  currency: string
  quantity: number
  category?: string
}

export interface CoreInitiateCheckoutParams {
  productIds: string[]
  value: number
  currency: string
  numItems: number
}

export interface CorePurchaseParams {
  orderId: string
  value: number
  currency: string
  numItems: number
  products: EcommerceProduct[]
}
