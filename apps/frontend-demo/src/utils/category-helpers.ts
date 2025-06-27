import type { Category, CategoryTreeNode } from '@/lib/server/categories'

/**
 * Find category by handle in the tree
 */
export function findCategoryByHandle(
  handle: string,
  categories: Category[]
): Category | null {
  return categories.find((cat) => cat.handle === handle) || null
}

/**
 * Get category path (breadcrumb) for a category
 */
export function getCategoryPath(
  categoryHandle: string,
  categories: Category[]
): Category[] {
  const targetCategory = findCategoryByHandle(categoryHandle, categories)
  if (!targetCategory) return []

  const path: Category[] = []
  let current: Category | null = targetCategory

  while (current) {
    path.unshift(current)
    current = current.parent_category_id
      ? categories.find((c) => c.id === current!.parent_category_id) || null
      : null
  }

  return path
}

/**
 * Transform category tree to menu items for UI components
 */
export function categoryTreeToMenuItems(tree: CategoryTreeNode[]): any[] {
  function categoryToMenuItem(category: CategoryTreeNode): any {
    if (category.children && category.children.length > 0) {
      return {
        type: 'submenu',
        value: category.id,
        label: category.name,
        items: category.children.map(categoryToMenuItem),
      }
    }
    return {
      type: 'action',
      value: category.id,
      label: category.name,
    }
  }

  return tree.map(categoryToMenuItem)
}
