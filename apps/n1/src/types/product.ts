import type { BadgeProps } from '@new-engine/ui/atoms/badge'

export interface Product {
  id: string
  title: string
  price: string
  badges?: BadgeProps[]
  imageSrc: string
  stockStatus?: string
}

export interface ProductSectionData {
  sectionTitle: string
  products: Product[]
}
