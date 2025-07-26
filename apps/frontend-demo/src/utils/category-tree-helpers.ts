import type { CategoryTreeNode } from '@/lib/server/categories'

/**
 * Get direct children of a category node in the tree
 */
export function getDirectChildren(
  nodeId: string,
  categoryTree: CategoryTreeNode[]
): CategoryTreeNode[] {
  // Helper function to find node and return its children
  function findNodeChildren(
    nodes: CategoryTreeNode[],
    targetId: string
  ): CategoryTreeNode[] | null {
    for (const node of nodes) {
      if (node.id === targetId) {
        return node.children || []
      }
      if (node.children) {
        const found = findNodeChildren(node.children, targetId)
        if (found) return found
      }
    }
    return null
  }

  return findNodeChildren(categoryTree, nodeId) || []
}

/**
 * Find a node by ID in the category tree
 */
export function findNodeById(
  nodeId: string,
  categoryTree: CategoryTreeNode[]
): CategoryTreeNode | null {
  for (const node of categoryTree) {
    if (node.id === nodeId) {
      return node
    }
    if (node.children) {
      const found = findNodeById(nodeId, node.children)
      if (found) return found
    }
  }
  return null
}
