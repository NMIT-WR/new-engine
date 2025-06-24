import { httpClient } from '@/lib/http-client'
import type { Category } from '@/types/product'
import type { MedusaCategory } from '@/utils/category-tree'
import { ROOT_CATEGORY_ORDER } from '@/utils/category-utils'

export interface CategoryTreeNode {
  id: string
  name: string
  handle: string
  description?: string
  children?: CategoryTreeNode[]
}

export class CategoryService {
  /**
   * Fetch all categories
   */
  static async getCategories(): Promise<MedusaCategory[]> {
    const response = await httpClient.get<{ product_categories: any[] }>(
      '/store/product-categories',
      {
        params: {
          include_descendants_tree: true,
          limit: 1000,
        },
      }
    )

    return response.product_categories || []
  }

  /**
   * Fetch single category by handle
   */
  static async getCategory(handle: string): Promise<MedusaCategory> {
    const response = await httpClient.get<{ product_categories: any[] }>(
      '/store/product-categories',
      {
        params: {
          handle,
          include_descendants_tree: true,
        },
      }
    )

    if (!response.product_categories?.length) {
      throw new Error('Category not found')
    }

    return response.product_categories[0]
  }

  /**
   * Get only root categories in preferred order
   */
  static async getRootCategories(): Promise<Category[]> {
    const allCategories = await this.getCategories()

    // Filter root categories
    const rootCategories = allCategories.filter(
      (cat) => !cat.parent_category_id
    )

    // Sort according to preferred order
    const sortedCategories = rootCategories.sort((a, b) => {
      const indexA = ROOT_CATEGORY_ORDER.indexOf(a.name)
      const indexB = ROOT_CATEGORY_ORDER.indexOf(b.name)

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }

      if (indexA !== -1) return -1
      if (indexB !== -1) return 1

      return a.name.localeCompare(b.name)
    })

    // Transform to Category interface
    return sortedCategories.map((cat) => this.transformCategory(cat))
  }

  /**
   * Build hierarchical tree structure from flat category list
   */
  static buildCategoryTree(categories: MedusaCategory[]): CategoryTreeNode[] {
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
    return this.sortCategoryNodes(rootNodes)
  }

  /**
   * Get breadcrumb path for a category
   */
  static async getCategoryPath(handle: string): Promise<Category[]> {
    const category = await this.getCategory(handle)
    const allCategories = await this.getCategories()

    const path: Category[] = []
    let current: MedusaCategory | undefined = category

    while (current) {
      path.unshift(this.transformCategory(current))
      current = current.parent_category_id
        ? allCategories.find((c) => c.id === current!.parent_category_id)
        : undefined
    }

    return path
  }

  /**
   * Transform MedusaCategory to Category interface
   */
  static transformCategory(medusaCategory: MedusaCategory): Category {
    return {
      id: medusaCategory.id,
      name: medusaCategory.name,
      handle: medusaCategory.handle,
      description: medusaCategory.description,
      count: 0, // Will be populated from product counts if needed
    }
  }

  /**
   * Sort category nodes according to preferred order
   */
  private static sortCategoryNodes(
    nodes: CategoryTreeNode[]
  ): CategoryTreeNode[] {
    return nodes.sort((a, b) => {
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
}
