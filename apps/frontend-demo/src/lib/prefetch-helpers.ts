import { dehydrate } from '@tanstack/react-query'
import { getProducts } from '@/services/product-service'
import { getQueryClient } from './query-client'
import { queryKeys } from './query-keys'
import {cookies} from 'next/headers'

export async function prefetchProducts(page: number = 1, limit: number = 12) {
  const cookieStore = await cookies()
  const regionId = cookieStore.get('medusa_region_id')?.value
  const queryClient = getQueryClient()
  const offset = (page - 1) * limit
  
  // Prefetch products data
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.list({ page, limit, region_id: regionId }),
    queryFn: () => getProducts({ limit, offset, region_id: regionId }),
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
  const cookieStore = await cookies()
  const regionId = cookieStore.get('medusa_region_id')?.value
  const queryClient = getQueryClient()
  const offset = (page - 1) * limit
  
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.list({ page, limit, filters, sort }),
    queryFn: () => getProducts({ limit, offset, filters, sort, region_id: regionId }),
  })
  
  return dehydrate(queryClient)
}