import { type StockStatus, getProductInventory } from '@/lib/inventory'
import type { Product } from '@/types/product'
import type { BadgeProps } from '@ui/atoms/badge'
import type { StoreRegion } from '@medusajs/types'

/**
 * Convert stock status to display text
 */
export function getStockStatusText(status: StockStatus): string {
  switch (status) {
    case 'in-stock':
      return 'Skladem'
    case 'low-stock':
      return 'Malé množství'
    case 'out-of-stock':
      return 'Vyprodáno'
  }
}



/**
 * Extract all common product display data
 */
interface ProductDisplayData {
  price: any // Price object from variant
  badges: BadgeProps[]
  displayBadges: BadgeProps[]
}

export function extractProductData(
  product: Product,
  currencyCode?: string,
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
    if (daysSinceCreated <= 10) {
      badges.push({ variant: 'success' as const, children: 'Nové' })
    }
  }

  
  // Check if any variant has inventory_quantity
  const hasInventoryData = product.variants?.some(v => 
    v.manage_inventory && 'inventory_quantity' in v
  )
  
  if (hasInventoryData) {
    // Check if at least one variant is in stock
    const hasStock = product.variants?.some(v => {
      if (!v.manage_inventory) return true
      if ('inventory_quantity' in v && typeof v.inventory_quantity === 'number') {
        return v.inventory_quantity > 0
      }
      return v.allow_backorder
    })
    
    if (hasStock) {
      badges.push({ variant: 'success' as const, children: 'Skladem' })
    } 
  }
  if (!hasInventoryData) {
    badges.push({ variant: 'danger' as const, children: 'Vyprodáno' })
  }

  return {
    price,
    badges,
    displayBadges: badges,
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
export function formatPrice(price: number, currency = 'Kč'): string {
  return `${currency}${price.toFixed(2)}`
}

/**
 * Get product URL path
 */
export function getProductPath(handle: string): string {
  return `/products/${handle}`
}
