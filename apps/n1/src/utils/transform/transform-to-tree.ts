import type { CategoryTreeNode } from '@/data/static/type'
import type { TreeNode } from '@new-engine/ui/molecules/tree-view'

export const transformToTree = (nodes: CategoryTreeNode[]): TreeNode[] => {
  return nodes.map((node) => ({
    id: node.id,
    name: node.name,
    handle: node.handle,
    children: node.children ? transformToTree(node.children) : [],
  }))
}
