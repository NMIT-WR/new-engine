import type { Category } from '@/types/product'

export interface MedusaCategory {
  id: string
  name: string
  handle: string
  description?: string
  parent_category_id?: string | null
  category_children?: MedusaCategory[]
  is_active?: boolean
  rank?: number
}

// Define the preferred order for root categories
export const ROOT_CATEGORY_ORDER = [
  'Pánské',
  'Dámské',
  'Dětské',
  'Oblečení',
  'Cyklo',
  'Moto',
  'Snb-Skate',
  'Ski',
]

// Transform MedusaCategory to Category interface
export function transformToCategory(medusaCategory: MedusaCategory): Category {
  return {
    id: medusaCategory.id,
    name: medusaCategory.name,
    handle: medusaCategory.handle,
    description: medusaCategory.description,
    count: 0, // This will be populated from product counts if needed
  }
}

// Get only root categories in the correct order
export function getRootCategoriesInOrder(
  categories: MedusaCategory[]
): Category[] {
  // Filter only root categories (no parent)
  const rootCategories = categories.filter((cat) => !cat.parent_category_id)

  // Sort according to our preferred order
  const sortedCategories = rootCategories.sort((a, b) => {
    const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
    const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

    // If both are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only one is in the order list, it comes first
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    // Otherwise, sort alphabetically
    return a.name.localeCompare(b.name)
  })

  // Transform to Category interface
  return sortedCategories.map(transformToCategory)
}
