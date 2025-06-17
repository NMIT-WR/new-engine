import { type StockStatus, getProductInventory } from '@/lib/inventory'
import type { Product } from '@/types/product'
import type { StoreRegion } from '@medusajs/types'
import type { BadgeProps } from '@ui/atoms/badge'

/**
 * Convert stock status to display text
 */
export function getStockStatusText(status: StockStatus): string {
  switch (status) {
    case 'in-stock':
      return 'In Stock'
    case 'low-stock':
      return 'Low Stock'
    case 'out-of-stock':
      return 'Out of Stock'
  }
}


/**
 * Extract all common product display data
 */
export interface ProductDisplayData {
  price: any // Price object from variant
  badges: BadgeProps[]
  displayBadges: BadgeProps[]
  stockStatus: StockStatus
  stockText: string
  stockQuantity: number
}

export function extractProductData(
  product: Product,
  currencyCode?: string,
  region?: StoreRegion | null
): ProductDisplayData {
  // For API products, find the price that matches the current currency
  const firstVariant = product.variants?.[0]
  let price = null

  if (firstVariant?.prices && currencyCode) {
    // Try to find a price matching the current currency
    price = firstVariant.prices.find((p) => p.currency_code === currencyCode)
    // If not found, use the first available price
    if (!price && firstVariant.prices.length > 0) {
      price = firstVariant.prices[0]
    }
  }

  // Generate badges based on product data
  const badges: BadgeProps[] = []

  // Sale badge - check if there's a calculated vs original price difference
  if (
    price?.original_price &&
    price?.calculated_price &&
    price.calculated_price !== price.original_price
  ) {
    const originalAmount =
      typeof price.original_price === 'string'
        ? Number.parseFloat(price.original_price.replace(/[^0-9.-]+/g, ''))
        : price.original_price
    const calculatedAmount =
      typeof price.calculated_price === 'string'
        ? Number.parseFloat(price.calculated_price.replace(/[^0-9.-]+/g, ''))
        : price.calculated_price

    if (originalAmount > calculatedAmount) {
      const discount = Math.round(
        ((originalAmount - calculatedAmount) / originalAmount) * 100
      )
      badges.push({ variant: 'danger' as const, children: `-${discount}%` })
    }
  }

  // New badge - check if product was created recently (within 7 days)
  if (product.created_at) {
    const createdDate = new Date(product.created_at)
    const daysSinceCreated =
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated <= 7) {
      badges.push({ variant: 'success' as const, children: 'New' })
    }
  }

  const inventory = getProductInventory(product, region)

  // Stock status badge - always show stock status
  if (inventory.status === 'out-of-stock') {
    badges.push({ variant: 'danger' as const, children: 'Out of Stock' })
  } else if (inventory.status === 'low-stock') {
    badges.push({ variant: 'warning' as const, children: 'Low Stock' })
  } else {
    badges.push({ variant: 'success' as const, children: 'In Stock' })
  }

  return {
    price,
    badges,
    displayBadges: badges, // Don't use placeholder since we always have stock badge
    stockStatus: inventory.status,
    stockText: inventory.message,
    stockQuantity: inventory.quantity,
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
