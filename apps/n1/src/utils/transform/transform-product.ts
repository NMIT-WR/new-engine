import type {
  Product,
  ProductDetail,
  ProductImage,
  ProductVariantDetail,
  StoreProductExtended,
} from '@/types/product'
import type { StoreProduct } from '@medusajs/types'
import { slugify } from '@new-engine/ui/utils'
import { formatPrice, formatVariants } from '../format/format-product'

export const transformProduct = (product: StoreProduct): Product => {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: formatPrice({ variants: product.variants }),
    withoutTax: formatPrice({ variants: product.variants, tax: false }),
    imageSrc: product.thumbnail || '/placeholder.jpg',
    stockValue: 'Skladem',
    variants: formatVariants(product.variants),
  }
}

const removeDuplicatedImageUrl = (images: ProductImage[]) => {
  const uniqueUrls = new Set<string>()
  return images.filter((img) => {
    if (uniqueUrls.has(img.src)) return false
    uniqueUrls.add(img.src)
    return true
  })
}

// ============================================
// V2 Transform - Optimized for new API structure
// ============================================

export const transformProductDetail = (
  product: StoreProductExtended
): ProductDetail => {
  const variantMetadata = product.variants?.[0]
    ?.metadata as ProductVariantDetail['metadata']
  const variantImages = variantMetadata?.images
  const imagesData: ProductImage[] =
    variantImages && variantImages.length > 0
      ? variantImages.map((img) => ({
          id: slugify(img.url),
          src: img.url,
        }))
      : product.images?.map((img) => ({
          id: img.id,
          src: img.url,
        })) || []

  const images: ProductImage[] = removeDuplicatedImageUrl(imagesData)

  const variants: ProductVariantDetail[] =
    product.variants?.map((variant) => ({
      id: variant.id,
      title: variant.title || '',
      sku: variant.sku,
      barcode: variant.barcode,
      ean: variant.ean,
      upc: variant.upc,
      material: variant.material,
      allow_backorder: variant.allow_backorder ?? false,
      inventory_quantity: variant.inventory_quantity,
      manage_inventory: variant.manage_inventory ?? true,
      metadata: variant.metadata as ProductVariantDetail['metadata'],
      calculated_price: variant.calculated_price
        ? {
            calculated_amount: variant.calculated_price.calculated_amount,
            calculated_amount_with_tax:
              variant.calculated_price.calculated_amount_with_tax,
            calculated_amount_without_tax:
              variant.calculated_price.calculated_amount_without_tax,
            original_amount: variant.calculated_price.original_amount,
            currency_code: variant.calculated_price.currency_code,
          }
        : undefined,
    })) || []

  return {
    // Base Product fields
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: formatPrice({ variants: product.variants }),
    withoutTax: formatPrice({ variants: product.variants, tax: false }),
    imageSrc: product.thumbnail || '/placeholder.jpg',
    stockValue: 'Skladem',

    // Extended fields
    description: product.description,
    subtitle: product.subtitle,
    thumbnail: product.thumbnail,
    collection_id: product.collection_id,
    type_id: product.type_id,
    weight: product.weight,
    material: product.material,

    // Full data
    images,
    variants,
    tags:
      product.tags?.map((tag) => ({
        id: tag.id,
        value: tag.value,
      })) || [],
    // Producer data
    producer: product.producer
      ? {
          id: product.producer.id,
          title: product.producer.title,
          attributes:
            product.producer.attributes?.map((attr) => ({
              value: attr.value,
              attributeType: attr.attributeType
                ? {
                    name: attr.attributeType.name,
                  }
                : undefined,
            })) || [],
        }
      : undefined,
  }
}
