import type { TreeNode } from '@ui/molecules/tree-view'

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

/**
 * Transform Medusa categories to TreeView format
 */
export function categoriesToTreeNodes(
  categories: MedusaCategory[],
  parentId: string | null = null
): TreeNode[] {
  // Filter categories for current level
  const levelCategories = categories
    .filter(
      (cat) => cat.parent_category_id === parentId && cat.is_active !== false
    )
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))

  return levelCategories.map((category) => {
    // Get children recursively
    const children = category.category_children
      ? categoriesToTreeNodes(category.category_children, category.id)
      : categoriesToTreeNodes(categories, category.id)

    const node: TreeNode = {
      id: category.id,
      name: category.name,
      children: children.length > 0 ? children : undefined,
    }

    return node
  })
}

/**
 * Get all category IDs in a tree branch (including parent and all descendants)
 */
export function getAllCategoryIds(node: TreeNode): string[] {
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
  treeData: TreeNode[]
): string[] {
  const allIds = new Set<string>()

  const findAndCollectIds = (nodes: TreeNode[]) => {
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
