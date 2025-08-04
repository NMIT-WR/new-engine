// Product types matching Medusa structure
export interface Product {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  images?: ProductImage[]
  status: 'draft' | 'published' | 'proposed'
  collection?: ProductCollection
  categories?: ProductCategory[]
  variants?: ProductVariant[]
  options?: ProductOption[]
  rating?: number
  tags?: Array<{ id: string; value: string }>
  metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
  reviewCount?: number
  features?: string[]
  specifications?: { name: string; value: string }[]
  // Computed properties from transformProduct
  inStock?: boolean
  price?: any
  primaryVariant?: ProductVariant
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
}

export interface ProductCollection {
  id: string
  title: string
  handle: string
}

// Main Category type used in components
export interface Category {
  id: string
  name: string
  handle: string
  parent_category_id?: string
  count?: number
  imageUrl?: string
  description?: string
  leaves?: string[]
}

export interface ProductCategory {
  id: string
  name: string
  handle: string
  parent_category_id?: string
}

export interface HomeCategory {
  name: string
  leaves: string[]
  imageUrl: string
  description: string
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  manage_inventory?: boolean
  allow_backorder?: boolean
  inventory_quantity?: number // deprecated, keeping for backward compatibility
  prices?: ProductPrice[]
  calculated_price?: ProductPrice // For API products
  options?: Record<string, string>
  metadata?: Record<string, unknown>
  colorHex?: string
}

export interface ProductPrice {
  id: string
  currency_code: string
  calculated_amount?: number // Amount in dollars/euros
  calculated_amount_with_tax?: number
  amount: number // Amount in cents
  calculated_price?: string // Formatted price
  original_price?: string // Formatted original price
  price_list_id?: string
}

export interface ProductOption {
  id: string
  title: string
  values: string[]
}
