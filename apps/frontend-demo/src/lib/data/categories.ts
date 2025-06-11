import { sdk } from '@/lib/medusa-client'
import { useQuery } from '@tanstack/react-query'

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

// React Query hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })
}

export function useCategory(handle: string) {
  return useQuery({
    queryKey: ['category', handle],
    queryFn: () => fetchCategory(handle),
    enabled: !!handle,
  })
}
