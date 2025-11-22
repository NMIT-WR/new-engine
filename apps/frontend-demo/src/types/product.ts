// Product types matching Medusa structure
export type Product = {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  images?: ProductImage[]
  status: "draft" | "published" | "proposed"
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
  priceWithTax?: number
  primaryVariant?: ProductVariant
}

export type ProductImage = {
  id: string
  url: string
  alt?: string
}

export type ProductCollection = {
  id: string
  title: string
  handle: string
}

// Main Category type used in components
export type Category = {
  id: string
  name: string
  handle: string
  parent_category_id?: string
  count?: number
  imageUrl?: string
  description?: string
  leaves?: string[]
}

export type ProductCategory = {
  id: string
  name: string
  handle: string
  parent_category_id?: string
}

export type HomeCategory = {
  name: string
  leaves: string[]
  imageUrl: string
  description: string
}

export type ProductVariant = {
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

export type ProductPrice = {
  id: string
  currency_code: string
  calculated_amount?: number // Amount in dollars/euros
  calculated_amount_with_tax?: number
  amount: number // Amount in cents
  calculated_price?: string // Formatted price
  original_price?: string // Formatted original price
  price_list_id?: string
}

export type ProductOption = {
  id: string
  title: string
  values: string[]
}
