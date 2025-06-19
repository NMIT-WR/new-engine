import type { Product, ProductVariant } from '@/types/product'
import type { StoreProductVariant, StoreRegion } from '@medusajs/types'

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export interface InventoryInfo {
  status: StockStatus
  quantity: number
  message: string
}

/**
 * Get inventory info for a specific variant
 * This is the single source of truth for variant availability
 */
export function getVariantInventory(
  variant: ProductVariant | StoreProductVariant | undefined | null,
  region?: StoreRegion | null
): InventoryInfo {
  if (!variant) {
    return {
      status: 'out-of-stock',
      quantity: 0,
      message: 'Variant not available',
    }
  }

  // Check if variant has price for the region
  if (region) {
    // For StoreProductVariant (from API)
    if ('calculated_price' in variant) {
      if (!variant.calculated_price) {
        return {
          status: 'out-of-stock',
          quantity: 0,
          message: 'Not available in this region',
        }
      }
    }
    // For ProductVariant (transformed)
    else if ('prices' in variant && variant.prices) {
      const hasRegionPrice = variant.prices.some(
        (p: any) => p.currency_code === region.currency_code
      )
      if (!hasRegionPrice) {
        return {
          status: 'out-of-stock',
          quantity: 0,
          message: 'Not available in this region',
        }
      }
    }
  }

  // Check physical inventory
  const quantity = variant.inventory_quantity || 0

  if (quantity <= 0) {
    return {
      status: 'out-of-stock',
      quantity: 0,
      message: 'Out of Stock',
    }
  }

  if (quantity <= 5) {
    return {
      status: 'low-stock',
      quantity,
      message: `Only ${quantity} left in stock`,
    }
  }

  return {
    status: 'in-stock',
    quantity,
    message: 'In Stock',
  }
}

/**
 * Get overall product inventory status
 * Considers all variants to determine product availability
 */
export function getProductInventory(
  product: Product | undefined | null,
  region?: StoreRegion | null
): InventoryInfo {
  if (!product || !product.variants?.length) {
    return {
      status: 'out-of-stock',
      quantity: 0,
      message: 'Product not available',
    }
  }

  // Calculate total inventory across all variants available in the region
  let totalQuantity = 0
  let hasAnyInStock = false
  let allOutOfStock = true
  let hasAnyRegionPrice = false

  for (const variant of product.variants) {
    const variantInventory = getVariantInventory(variant, region)
    
    // Check if variant is available in region
    if (variantInventory.message === 'Not available in this region') {
      continue // Skip variants not available in this region
    }
    
    hasAnyRegionPrice = true
    totalQuantity += variantInventory.quantity

    if (variantInventory.status !== 'out-of-stock') {
      hasAnyInStock = true
      allOutOfStock = false
    }
  }

  // If no variants have prices for this region
  if (!hasAnyRegionPrice) {
    return {
      status: 'out-of-stock',
      quantity: 0,
      message: 'Not available in this region',
    }
  }

  if (allOutOfStock) {
    return {
      status: 'out-of-stock',
      quantity: 0,
      message: 'Out of Stock',
    }
  }

  if (totalQuantity <= 5) {
    return {
      status: 'low-stock',
      quantity: totalQuantity,
      message: 'Low Stock',
    }
  }

  return {
    status: 'in-stock',
    quantity: totalQuantity,
    message: 'In Stock',
  }
}

/**
 * Check if a specific quantity is available for a variant
 */
export function isQuantityAvailable(
  variant: ProductVariant | StoreProductVariant | undefined | null,
  requestedQuantity: number,
  region?: StoreRegion | null
): boolean {
  if (!variant || requestedQuantity <= 0) {
    return false
  }

  const inventory = getVariantInventory(variant, region)
  return inventory.quantity >= requestedQuantity
}
