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

  // TODO: Add region-specific inventory when backend supports it
  // For now, use the global inventory_quantity
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

  // Calculate total inventory across all variants
  let totalQuantity = 0
  let hasAnyInStock = false
  let allOutOfStock = true

  for (const variant of product.variants) {
    const variantInventory = getVariantInventory(variant, region)
    totalQuantity += variantInventory.quantity

    if (variantInventory.status !== 'out-of-stock') {
      hasAnyInStock = true
      allOutOfStock = false
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
