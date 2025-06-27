// Mock static category data for development
// This will be replaced by real data from generate:categories script

import type { Category, CategoryTreeNode } from '@/lib/server/categories'

export interface StaticCategoryData {
  allCategories: Category[]
  categoryTree: CategoryTreeNode[]
  rootCategories: Category[]
  categoryMap: Record<string, Category>
  generatedAt: string
}

// Mock data based on your ROOT_CATEGORY_ORDER
const mockCategories: Category[] = [
  // Root categories
  { id: '1', name: 'Pánské', handle: 'panske', parent_category_id: undefined },
  { id: '2', name: 'Dámské', handle: 'damske', parent_category_id: undefined },
  { id: '3', name: 'Dětské', handle: 'detske', parent_category_id: undefined },
  {
    id: '4',
    name: 'Oblečení',
    handle: 'obleceni',
    parent_category_id: undefined,
  },
  { id: '5', name: 'Cyklo', handle: 'cyklo', parent_category_id: undefined },
  { id: '6', name: 'Moto', handle: 'moto', parent_category_id: undefined },
  {
    id: '7',
    name: 'Snb-Skate',
    handle: 'snb-skate',
    parent_category_id: undefined,
  },
  { id: '8', name: 'Ski', handle: 'ski', parent_category_id: undefined },

  // Some subcategories for Pánské
  {
    id: '11',
    name: 'Trička',
    handle: 'panske-tricka',
    parent_category_id: '1',
  },
  {
    id: '12',
    name: 'Kalhoty',
    handle: 'panske-kalhoty',
    parent_category_id: '1',
  },
  { id: '13', name: 'Bundy', handle: 'panske-bundy', parent_category_id: '1' },

  // Some subcategories for Dámské
  { id: '21', name: 'Šaty', handle: 'damske-saty', parent_category_id: '2' },
  { id: '22', name: 'Sukně', handle: 'damske-sukne', parent_category_id: '2' },
  {
    id: '23',
    name: 'Halenky',
    handle: 'damske-halenky',
    parent_category_id: '2',
  },
]

// Build tree structure
function buildTree(categories: Category[]): CategoryTreeNode[] {
  const categoryMap = new Map<string, CategoryTreeNode>()
  const rootNodes: CategoryTreeNode[] = []

  // Create nodes
  categories.forEach((cat) => {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      children: [],
    })
  })

  // Build tree
  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id)!
    if (cat.parent_category_id) {
      const parent = categoryMap.get(cat.parent_category_id)
      if (parent) {
        parent.children!.push(node)
      }
    } else {
      rootNodes.push(node)
    }
  })

  return rootNodes
}

const categoryMap: Record<string, Category> = {}
mockCategories.forEach((cat) => {
  categoryMap[cat.id] = cat
})

const data: StaticCategoryData = {
  allCategories: mockCategories,
  categoryTree: buildTree(mockCategories),
  rootCategories: mockCategories.filter((cat) => !cat.parent_category_id),
  categoryMap,
  generatedAt: new Date().toISOString(),
}

export default data
export const { allCategories, categoryTree, rootCategories } = data
