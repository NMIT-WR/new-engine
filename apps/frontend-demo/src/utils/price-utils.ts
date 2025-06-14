/**
 * Convert price from cents to display currency
 * @param priceInCents - Price in cents (e.g., 2900 for €29.00)
 * @returns Price in display currency (e.g., 29.00)
 */
export function convertCentsToAmount(priceInCents: number): number {
  return priceInCents / 100
}

/**
 * Get price from product variant
 * @param product - Product object
 * @param variantIndex - Variant index (default 0)
 * @returns Price in display currency or 0 if not found
 */
export function getProductPrice(product: any, variantIndex = 0): number {
  const priceInCents =
    product.variants?.[variantIndex]?.prices?.[0]?.amount || 0
  return convertCentsToAmount(priceInCents)
}
