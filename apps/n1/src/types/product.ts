export interface Product {
  id: string
  title: string
  price: string
  badges?: {
    variant: 'new' | 'limited' | 'info' | 'sale' | 'default'
    text: string
  }[]
  imageSrc: string
  stockStatus?: string
  stockValue?: string
  variants?: string[]
}

export interface ProductSectionData {
  sectionTitle: string
  products: Product[]
}
