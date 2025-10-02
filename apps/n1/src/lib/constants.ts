import { leafCategories, leafParents, rootCategories } from "@/data/static/categories"

export const ROOT_CATEGORIES = rootCategories.map((cat) => {
  return {
    id: cat.id,
    handle: cat.handle
  }
})

export const CATEGORIES_LEAFS_IDS = ROOT_CATEGORIES.map((cat) => {
  const children = leafCategories.filter((leaf) => leaf.root_category_id === cat.id).map((leaf) => leaf.id)
  return {
    handle: cat.handle,
    children
  }
})

export const VALID_CATEGORY_ROUTES = [
  ...ROOT_CATEGORIES.map((cat) => cat.handle),
  ...leafParents.map((parent) => parent.handle),
  ...leafCategories.map((leaf) => leaf.handle)
]

export const CATEGORY_MAP: Record<string, string[]> = {
  panske: CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'panske')?.children || [],
  damske: CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'damske')?.children || [],
  detske: CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'detske')?.children || [],
  'obleceni-category-347': CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'obleceni-category-347')?.children || [],
  'cyklo-category-378': CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'cyklo-category-378')?.children || [],
  'moto-category-424': CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'moto-category-424')?.children || [],
  'snb-skate-category-448': CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'snb-skate-category-448')?.children || [],
  'ski-category-466': CATEGORIES_LEAFS_IDS.find((cat) => cat.handle === 'ski-category-466')?.children || [],
}

// Extended category map including all categories (root, parent, and leaf)
export const CATEGORY_MAP_EXTENDED: Record<string, string[]> = Object.fromEntries([
  // Root categories (all leaf IDs in root category)
  ...rootCategories.map(root => [
    root.handle,
    leafCategories
      .filter(leaf => leaf.root_category_id === root.id)
      .map(leaf => leaf.id)
  ]),

  // Parent categories (leafs array from leafParents)
  ...leafParents.map(parent => [
    parent.handle,
    parent.leafs
  ]),

  // Leaf categories (no children - return own ID as array)
  ...leafCategories.map(leaf => [
    leaf.handle,
    [leaf.id]
  ])
])

export const PRODUCT_FIELDS = '*variants.calculated_price' as const
export const PRODUCT_LIMIT = 24 as const
