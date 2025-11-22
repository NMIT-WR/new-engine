export type Category = {
  id: string
  name: string
  handle: string
  description?: string
  parent_category_id?: string | null
}

export type CategoryTreeNode = {
  id: string
  name: string
  handle: string
  description?: string
  children?: CategoryTreeNode[]
}

export type CategoryData = {
  allCategories: Category[]
  categoryTree: CategoryTreeNode[]
  rootCategories: Category[]
  categoryMap: Map<string, Category>
}
