import { HttpTypes } from "@medusajs/types"

export function getVariantItemsInStock(variant: HttpTypes.StoreProductVariant) {
  // If we don't manage inventory, we can always add to cart
  if (variant && !variant.manage_inventory) {
    return Number.MAX_SAFE_INTEGER
  }

  // If we allow back orders on the variant, we can always add to cart
  if (variant.allow_backorder) {
    return Number.MAX_SAFE_INTEGER
  }

  // If there is inventory available, return the inventory quantity
  if (variant.manage_inventory && (variant.inventory_quantity || 0) > 0) {
    return variant.inventory_quantity!
  }

  // Otherwise, return 0
  return 0
}
