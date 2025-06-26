/**
 * Convert price from cents to display currency
 * @param priceInCents - Price in cents (e.g., 2900 for €29.00)
 * @returns Price in display currency (e.g., 29.00)
 * @deprecated Medusa v2 prices are already in major units, not cents
 */
function convertCentsToAmount(priceInCents: number): number {
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

/**
 * Currency symbol mapping
 */
const currencySymbols: Record<string, string> = {
  CZK: 'Kč',
  EUR: '€',
  USD: '$',
  GBP: '£',
  SEK: 'kr',
  DKK: 'kr',
  NOK: 'kr',
  PLN: 'zł',
}

/**
 * Format price with currency
 * @param amount - Price amount in major units (dollars/euros, not cents)
 * @param currencyCode - ISO currency code (e.g., 'EUR', 'USD')
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currencyCode = 'CZK'): string {
  const symbol = currencySymbols[currencyCode.toUpperCase()] || currencyCode

  // For currencies that typically place symbol after (Nordic, Czech, Polish)
  if (
    ['SEK', 'DKK', 'NOK', 'PLN', 'CZK'].includes(currencyCode.toUpperCase())
  ) {
    return `${amount.toFixed(2)} ${symbol}`
  }

  // Default: symbol before amount
  return `${symbol}${amount.toFixed(2)}`
}
