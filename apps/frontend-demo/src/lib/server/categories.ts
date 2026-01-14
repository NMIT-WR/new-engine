export interface CategoryTreeNode {
  id: string
  name: string
  handle: string
  description?: string
  children?: CategoryTreeNode[]
}
