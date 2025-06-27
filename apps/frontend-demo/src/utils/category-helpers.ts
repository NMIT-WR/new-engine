import type { Category, CategoryTreeNode } from '@/lib/server/categories'
import { ROOT_CATEGORY_ORDER } from './category-utils'

/**
 * Get all category IDs in a tree branch (including parent and all descendants)
 */
export function getAllCategoryIds(node: CategoryTreeNode): string[] {
  const ids = [node.id]

  if (node.children) {
    for (const child of node.children) {
      ids.push(...getAllCategoryIds(child))
    }
  }

  return ids
}

/**
 * Get all category IDs from selected nodes and their descendants
 */
export function getSelectedCategoryIds(
  selectedNodeIds: string[],
  treeData: CategoryTreeNode[]
): string[] {
  const allIds = new Set<string>()

  const findAndCollectIds = (nodes: CategoryTreeNode[]) => {
    for (const node of nodes) {
      if (selectedNodeIds.includes(node.id)) {
        // Add this node and all its descendants
        const branchIds = getAllCategoryIds(node)
        branchIds.forEach((id) => allIds.add(id))
      } else if (node.children) {
        // Continue searching in children
        findAndCollectIds(node.children)
      }
    }
  }

  findAndCollectIds(treeData)
  return Array.from(allIds)
}

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
 * Filter only root categories and sort them
 */
export function getRootCategories(categories: Category[]): Category[] {
  return categories
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
