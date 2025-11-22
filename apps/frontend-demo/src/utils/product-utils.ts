import type { BadgeProps } from "@new-engine/ui/atoms/badge"
import type { StockStatus } from "@/lib/inventory"
import type { Product } from "@/types/product"

/**
 * Convert stock status to display text
 */
export function getStockStatusText(status: StockStatus): string {
  switch (status) {
    case "in-stock":
      return "Skladem"
    case "low-stock":
      return "Malé množství"
    case "out-of-stock":
      return "Vyprodáno"
  }
}

/**
 * Extract all common product display data
 */
type ProductDisplayData = {
  badges: BadgeProps[]
  displayBadges: BadgeProps[]
}

export function extractProductData(
  product: Product,
  _currencyCode?: string
): ProductDisplayData {
  // For API products, find the price that matches the current currency
  const primaryVariant = product.primaryVariant

  // Generate badges based on product data
  const badges: BadgeProps[] = []

  // New badge - check if product was created recently (within 7 days)
  if (product.created_at) {
    const createdDate = new Date(product.created_at)
    const daysSinceCreated =
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated <= 10) {
      badges.push({ variant: "success" as const, children: "Nové" })
    }
  }

  if (primaryVariant) {
    if (!primaryVariant.manage_inventory) {
      badges.push({ variant: "success" as const, children: "Skladem" })
    } else if (typeof primaryVariant.inventory_quantity === "number") {
      if (primaryVariant.inventory_quantity > 0) {
        badges.push({ variant: "success" as const, children: "Skladem" })
      }
    } else if (primaryVariant.allow_backorder) {
      badges.push({ variant: "warning" as const, children: "Na objednávku" })
    } else {
      badges.push({ variant: "danger" as const, children: "Vyprodáno" })
    }
  }
  if (!primaryVariant) {
    badges.push({ variant: "danger" as const, children: "Vyprodáno" })
  }
  return {
    badges,
    displayBadges: badges,
  }
}

/**
 * Format price display with currency
 */
export function formatPrice(price: number, currency = "Kč"): string {
  return `${currency}${price.toFixed(2)}`
}

/**
 * Get product URL path
 */
export function getProductPath(handle: string): string {
  return `/products/${handle}`
}
