import { sdk } from '@/lib/medusa-client'

// Fetch all categories
export async function fetchCategories() {
  const { product_categories } = await sdk.store.category.list({
    fields: '*products',
    include_descendants_tree: true,
  })

  return product_categories
}

// Fetch single category
export async function fetchCategory(handle: string) {
  const { product_categories } = await sdk.store.category.list({
    handle,
    fields: '*products',
  })

  return product_categories[0] || null
}
