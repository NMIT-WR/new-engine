import type { Product } from '../types/product'

export interface ProductCounts {
  sizeCounts: Record<string, number>
  colorCounts: Record<string, number>
  categoryCounts: Array<{
    name: string
    handle: string
    count: number
  }>
}

/**
 * Calculate product counts for filter options
 */
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
    if (product.collection) {
      const key = `${product.collection.handle}:${product.collection.title}`
      categoryCounts[key] = (categoryCounts[key] || 0) + 1
    }
  })

  // Transform category counts to array format
  const categoryArray = Object.entries(categoryCounts).map(([key, count]) => {
    const [handle, name] = key.split(':')
    return { name, handle, count }
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
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
    })
}

/**
 * Get available colors with their counts
 */
export function getColorsWithCounts(
  products: Product[]
): Array<{ color: string; count: number }> {
  const counts = calculateProductCounts(products)
  return Object.entries(counts.colorCounts)
    .map(([color, count]) => ({ color, count }))
    .sort((a, b) => a.color.localeCompare(b.color))
}

/**
 * Filter products based on filter state
 */
export interface FilterState {
  priceRange: [number, number]
  categories: Set<string>
  sizes: Set<string>
  colors: Set<string>
}

export function filterProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  return products.filter((product) => {
    // Price filter
    const price = Number.parseFloat(
      product.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') ||
        '0'
    )
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false
    }

    // Category filter (actually collection filter)
    if (filters.categories.size > 0) {
      // If any collection is selected, products without collection should be hidden
      if (!product.collection?.handle) {
        return false
      }
      // Check if product's collection is in selected filters
      if (!filters.categories.has(product.collection.handle)) {
        return false
      }
    }

    // Size filter
    if (filters.sizes.size > 0) {
      const productSizes = new Set<string>()
      product.variants?.forEach((variant) => {
        if (variant.options?.size) {
          productSizes.add(variant.options.size)
        }
      })
      const hasMatchingSize = Array.from(filters.sizes).some((size) =>
        productSizes.has(size)
      )
      if (!hasMatchingSize) {
        return false
      }
    }

    // Color filter
    if (filters.colors.size > 0) {
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
      const hasMatchingColor = Array.from(filters.colors).some((color) =>
        productColors.has(color)
      )
      if (!hasMatchingColor) {
        return false
      }
    }

    return true
  })
}

/**
 * Sort products based on sort option
 */
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export function sortProducts(
  products: Product[],
  sortBy: SortOption
): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => {
        const priceA = Number.parseFloat(
          a.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') ||
            '0'
        )
        const priceB = Number.parseFloat(
          b.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') ||
            '0'
        )
        return priceA - priceB
      })
      break
    case 'price-desc':
      sorted.sort((a, b) => {
        const priceA = Number.parseFloat(
          a.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') ||
            '0'
        )
        const priceB = Number.parseFloat(
          b.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') ||
            '0'
        )
        return priceB - priceA
      })
      break
    case 'name-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'name-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title))
      break
    // 'newest' is default, no sorting needed
  }

  return sorted
}
