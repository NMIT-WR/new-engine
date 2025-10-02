import type { Product } from '@/types/product'
import type { StoreProduct } from '@medusajs/types'
import { formatPrice, formatVariants } from '../format/format-product'

export const transformProduct = (product: StoreProduct): Product => {
  return {
    id: product.id,
    title: product.title,
    price: formatPrice(product.variants),
    imageSrc: product.thumbnail || '/placeholder.jpg',
    stockValue: 'Skladem',
    variants: formatVariants(product.variants),
    /*
      product.variants && product.variants?.length < 2
        ? []
        : product.variants?.map((v) => v.title).filter((v) => v !== null),*/
  }
}
