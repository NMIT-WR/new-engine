import { httpClient } from '@/lib/http-client'
import { ROOT_CATEGORY_ORDER } from '@/utils/category-utils'

export interface Category {
  id: string
  name: string
  handle: string
  description?: string
  parent_category_id?: string | null
}

export interface CategoryTreeNode {
  id: string
  name: string
  handle: string
  description?: string
  children?: CategoryTreeNode[]
}

export interface CategoryData {
  allCategories: Category[]
  categoryTree: CategoryTreeNode[]
  rootCategories: Category[]
  categoryMap: Map<string, Category>
}

/**
 * Transform API response to Category
 */
function transformCategory(medusaCategory: any): Category {
  return {
    id: medusaCategory.id,
    name: medusaCategory.name,
    handle: medusaCategory.handle,
    description: medusaCategory.description || undefined,
    parent_category_id: medusaCategory.parent_category_id,
  }
}

/**
 * Build hierarchical tree structure from flat category list
 */
function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>()
  const rootNodes: CategoryTreeNode[] = []

  // First pass: create all nodes
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      children: [],
    })
  })

  // Second pass: build tree structure
  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id)!

    if (cat.parent_category_id) {
      const parent = categoryMap.get(cat.parent_category_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    } else {
      rootNodes.push(node)
    }
  })

  // Sort root nodes according to preferred order
  return rootNodes.sort((a, b) => {
    const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
    const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    return a.name.localeCompare(b.name)
  })
}

/**
 * Fetch all categories from Medusa API
 */
export async function fetchCategoriesFromAPI(): Promise<CategoryData> {
  console.log('[Categories] Fetching from API...')

  const data = await httpClient.get<{ product_categories: any[] }>(
    '/store/product-categories',
    {
      params: {
        limit: 1000, // Get all categories at once
        fields: 'id,name,handle,parent_category_id,description', // Only essential fields
      },
    }
  )

  const allCategories = (data.product_categories || []).map(transformCategory)

  // Create category map for quick lookups
  const categoryMap = new Map<string, Category>()
  allCategories.forEach((cat) => categoryMap.set(cat.id, cat))

  // Filter and sort root categories
  const rootCategories = allCategories
    .filter((cat) => !cat.parent_category_id)
    .sort((a, b) => {
      const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
      const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }

      if (indexA !== -1) return -1
      if (indexB !== -1) return 1

      return a.name.localeCompare(b.name)
    })

  // Build tree structure
  const categoryTree = buildCategoryTree(allCategories)

  console.log(
    `[Categories] Fetched ${allCategories.length} categories (${rootCategories.length} root)`
  )

  return {
    allCategories,
    categoryTree,
    rootCategories,
    categoryMap,
  }
}
