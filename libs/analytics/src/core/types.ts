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

export interface ViewContentParams {
  productId: string
  productName: string
  value: number
  currency: string
  category?: string
}

export interface AddToCartParams {
  productId: string
  productName: string
  value: number
  currency: string
  quantity: number
  category?: string
}

export interface InitiateCheckoutParams {
  productIds: string[]
  value: number
  currency: string
  numItems: number
}

export interface PurchaseParams {
  orderId: string
  value: number
  currency: string
  numItems: number
  products: EcommerceProduct[]
}
