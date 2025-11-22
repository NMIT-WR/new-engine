import type { Product } from "@/types/product"

export type ProductCounts = {
  sizeCounts: Record<string, number>
  colorCounts: Record<string, number>
  categoryCounts: Array<{
    id: string
    name: string
    handle: string
    count: number
  }>
}

export function calculateProductCounts(products: Product[]): ProductCounts {
  const sizeCounts: Record<string, number> = {}
  const colorCounts: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {}

  products.forEach((product) => {
    // Count sizes (count products that have this size, not variants)
    const productSizes = new Set<string>()
    product.variants?.forEach((variant) => {
      if (variant.options?.size) {
        productSizes.add(variant.options.size)
      }
    })
    productSizes.forEach((size) => {
      sizeCounts[size] = (sizeCounts[size] || 0) + 1
    })

    // Count colors (count products that have this color, not variants)
    const productColors = new Set<string>()
    product.variants?.forEach((variant) => {
      if (variant.options?.color) {
        productColors.add(variant.options.color)
      }
      // Also check for 'wash' option (for denim products)
      if (variant.options?.wash) {
        productColors.add(variant.options.wash)
      }
      // Also check for 'pattern' option (for patterned products)
      if (variant.options?.pattern) {
        productColors.add(variant.options.pattern)
      }
    })
    productColors.forEach((color) => {
      colorCounts[color] = (colorCounts[color] || 0) + 1
    })

    // Count categories
    product.categories?.forEach((category) => {
      const key = `${category.id}:${category.handle}:${category.name}`
      categoryCounts[key] = (categoryCounts[key] || 0) + 1
    })
  })

  // Transform category counts to array format
  const categoryArray = Object.entries(categoryCounts).map(([key, count]) => {
    const [id, handle, name] = key.split(":")
    return { id, name, handle, count }
  })

  return {
    sizeCounts,
    colorCounts,
    categoryCounts: categoryArray,
  }
}

/**
 * Get available sizes with their counts
 */
export function getSizesWithCounts(
  products: Product[]
): Array<{ size: string; count: number }> {
  const counts = calculateProductCounts(products)
  return Object.entries(counts.sizeCounts)
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => {
      // Sort by standard size order
      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"]
      return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
    })
}

/**
 * Sort products based on sort option
 */
export type SortOption = "newest" | "name-asc" | "name-desc"

export function sortProducts(
  products: Product[],
  sortBy: SortOption
): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case "name-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "name-desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title))
      break
    // 'newest' is default, no sorting needed
  }

  return sorted
}
