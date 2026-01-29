export type Category = {
  id: string
  name: string
  handle: string
  description?: string
  parent_category_id?: string | null
  root_category_id?: string | null
}

export type CategoryTreeNode = {
  id: string
  name: string
  handle: string
  description?: string
  children?: CategoryTreeNode[]
  parent_category_id?: string | null
}
