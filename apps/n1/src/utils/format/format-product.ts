import type { StoreProduct } from '@medusajs/types'

export const formatPrice = (variants?: StoreProduct['variants']): string => {
  const variant = variants?.[0]
  const price = variant?.calculated_price?.calculated_amount_with_tax
  return price ? `${price.toFixed(0)} Kč` : '0 Kč'
}

export const formatVariants = (
  variants?: StoreProduct['variants']
): string[] => {
  if (!variants || variants.length < 2) return []
  return variants.map((v) => v.title).filter((v): v is string => v !== null)
}
