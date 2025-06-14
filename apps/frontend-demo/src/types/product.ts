// Product types matching Medusa structure
export interface Product {
  id: string
  title: string
  handle: string
  description?: string
  longDescription?: string
  thumbnail?: string
  images?: ProductImage[]
  status: 'draft' | 'published' | 'proposed'
  collection?: ProductCollection
  categories?: ProductCategory[]
  variants?: ProductVariant[]
  options?: ProductOption[]
  specifications?: ProductSpecification[]
  reviews?: ProductReview[]
  rating?: number
  reviewCount?: number
  features?: string[]
  tags?: Array<{ id: string; value: string }>
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

// Main Category type used in components
export interface Category {
  id: string
  name: string
  handle: string
  count?: number
  imageUrl?: string
  description?: string
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
  colorHex?: string
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

// Additional product details types
export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductReview {
  id: string
  rating: number
  title: string
  comment: string
  author: string
  date: string
  verified?: boolean
}
