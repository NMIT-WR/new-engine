import { dehydrate } from '@tanstack/react-query'
import { getProducts } from '@/services/product-service'
import { getQueryClient } from './query-client'
import { queryKeys } from './query-keys'

export async function prefetchProducts(page: number = 1, limit: number = 12) {
  const queryClient = getQueryClient()
  const offset = (page - 1) * limit
  
  // Prefetch products data
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.list({ page, limit }),
    queryFn: () => getProducts({ limit, offset }),
  })
  
  return dehydrate(queryClient)
}

export async function prefetchProductsWithFilters({
  page = 1,
  limit = 12,
  filters,
  sort,
}: {
  page?: number
  limit?: number
  filters?: any
  sort?: string
}) {
  const queryClient = getQueryClient()
  const offset = (page - 1) * limit
  
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.list({ page, limit, filters, sort }),
    queryFn: () => getProducts({ limit, offset, filters, sort }),
  })
  
  return dehydrate(queryClient)
}