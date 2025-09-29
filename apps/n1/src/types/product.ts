export interface Product {
  id: string
  title: string
  price?: string
  badges?: {
    variant: 'new' | 'limited' | 'info' | 'sale' | 'default'
    text: string
  }[]
  imageSrc?: string
  stockStatus?: string
  stockValue?: string
  variants?: string[]
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
