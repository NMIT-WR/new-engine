import type { StoreProduct } from '@medusajs/types'

export interface StoreProductExtended extends StoreProduct {
  producer?: Producer
}

// Lightweight type for product listing
export interface Product {
  id: string
  title: string
  handle: string
  price?: string
  withoutTax?: string
  badges?: {
    variant: 'new' | 'limited' | 'info' | 'sale' | 'default'
    text: string
  }[]
  imageSrc?: string
  stockStatus?: string
  stockValue?: string
  variants?: string[]
}

// Product image from Medusa
export interface ProductImage {
  id: string
  src: string
}

// Product option value
export interface ProductOptionValue {
  id: string
  value: string
  option_id: string | null | undefined
}

// Product option
export interface ProductOption {
  id: string
  title: string
  product_id: string | null | undefined
  values: ProductOptionValue[]
}

export interface ProductSectionData {
  sectionTitle: string
  products: Product[]
}

export interface ProductVariant {
  id: string
  title: string
  calculated_price?: {
    calculated_amount?: number
    calculated_amount_with_tax?: number
  }
}

export interface ProductDb {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  variants?: ProductVariant[]
  // Computed z transformProduct
  price?: number
  primaryVariant?: ProductVariant
}

// Producer information
export interface Producer {
  id: string
  title: string
  attributes?: Array<{
    value: string
    attributeType?: {
      name: string
    }
  }>
}

export interface ProductVariantDetail {
  id: string
  title: string
  sku?: string | null
  barcode?: string | null
  ean?: string | null
  upc?: string | null
  material?: string | null
  allow_backorder: boolean
  manage_inventory: boolean
  inventory_quantity?: number
  metadata?: {
    images?: Array<{ url: string }>
    thumbnail?: string
    user_code?: string
    attributes?: Array<{ name: string; value: string }>
  }
  calculated_price?: {
    calculated_amount?: number | null
    calculated_amount_with_tax?: number | null
    calculated_amount_without_tax?: number | null
    original_amount?: number | null
    currency_code?: string | null
  }
}

export interface ProductDetail extends Omit<Product, 'variants' | 'images'> {
  description?: string | null
  subtitle?: string | null
  thumbnail?: string | null
  collection_id?: string | null
  type_id?: string | null
  weight?: string | number | null
  material?: string | null
  images: ProductImage[]
  variants: ProductVariantDetail[]
  tags?: Array<{ id: string; value: string }>
  producer?: Producer
}
