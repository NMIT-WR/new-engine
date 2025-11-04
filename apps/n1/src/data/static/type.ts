export interface Category {
  id: string
  name: string
  handle: string
  description?: string
  parent_category_id?: string | null
  root_category_id?: string | null
}

export interface CategoryTreeNode {
  id: string
  name: string
  handle: string
  description?: string
  children?: CategoryTreeNode[]
  parent_category_id?: string | null
}

export interface CategoryData {
  allCategories: Category[]
  categoryTree: CategoryTreeNode[]
  rootCategories: Category[]
  categoryMap: Map<string, Category>
}
