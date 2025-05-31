import type { BadgeProps } from 'ui/src/atoms/badge'
import {
  getProductBadges,
  getProductPrice,
  getProductStock,
} from '../data/mock-products'
import type { Product } from '../types/product'

/**
 * Convert stock status to display text
 */
export function getStockStatusText(status: string): string {
  switch (status) {
    case 'in-stock':
      return 'In Stock'
    case 'low-stock':
      return 'Low Stock'
    case 'out-of-stock':
      return 'Out of Stock'
    default:
      return 'Unknown'
  }
}

/**
 * Ensure badges array has at least one item (for layout consistency)
 */
export function ensureBadgesPlaceholder(badges: BadgeProps[]): BadgeProps[] {
  return badges.length > 0
    ? badges
    : [
        {
          variant: 'success' as const,
          children: '\u00A0',
          className: 'invisible',
        },
      ]
}

/**
 * Extract all common product display data
 */
export interface ProductDisplayData {
  price: ReturnType<typeof getProductPrice>
  badges: BadgeProps[]
  displayBadges: BadgeProps[]
  stockStatus: ReturnType<typeof getProductStock>
  stockText: string
}

export function extractProductData(product: Product): ProductDisplayData {
  const price = getProductPrice(product)
  const badges = getProductBadges(product)
  const stockStatus = getProductStock(product)

  return {
    price,
    badges,
    displayBadges: ensureBadgesPlaceholder(badges),
    stockStatus,
    stockText: getStockStatusText(stockStatus),
  }
}

/**
 * Get related products (excluding current product)
 */
export function getRelatedProducts(
  currentProduct: Product,
  allProducts: Product[],
  limit = 4
): Product[] {
  return allProducts.filter((p) => p.id !== currentProduct.id).slice(0, limit)
}

/**
 * Format price display with currency
 */
export function formatPrice(price: number, currency = '€'): string {
  return `${currency}${price.toFixed(2)}`
}

/**
 * Get product URL path
 */
export function getProductPath(handle: string): string {
  return `/products/${handle}`
}
