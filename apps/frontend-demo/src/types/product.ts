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
  metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
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

export interface ProductCategory {
  id: string
  name: string
  handle: string
  parent_category_id?: string
}

export interface ProductVariant {
  id: string
  title: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  inventory_quantity?: number
  prices?: ProductPrice[]
  options?: Record<string, string>
  metadata?: Record<string, unknown>
}

export interface ProductPrice {
  id: string
  currency_code: string
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

// Additional types for categories
export interface Category {
  id: string
  name: string
  handle: string
  imageUrl?: string
  count?: number
  parent_category_id?: string
}

// Type for badge used in UI
export interface ProductBadge {
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  children: string
}
