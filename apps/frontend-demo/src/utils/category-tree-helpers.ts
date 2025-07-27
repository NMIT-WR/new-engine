import type { CategoryTreeNode } from '@/lib/server/categories'
import type { LeafParent } from '@/lib/static-data/categories'

/**
 * Find a node by ID in the category tree
 */
export function findNodeById(
  nodes: CategoryTreeNode[],
  targetId: string
): CategoryTreeNode | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node
    }
    if (node.children) {
      const found = findNodeById(node.children, targetId)
      if (found) return found
    }
  }
  return null
}

export const isSelectableCategory = (
  id: string,
  leafIds: Set<string>,
  parentIds: Set<string>
) => leafIds.has(id) || parentIds.has(id)

export const getLeafIdsForCategory = (
  categoryId: string,
  leafIds: Set<string>,
  parentIds: Set<string>,
  leafParents: LeafParent[]
): string[] => {
  if (leafIds.has(categoryId)) return [categoryId]
  if (parentIds.has(categoryId)) {
    const parent = leafParents.find((p) => p.id === categoryId)
    return parent?.leafs || []
  }
  return []
}
