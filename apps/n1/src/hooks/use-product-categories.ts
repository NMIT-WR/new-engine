import { useQuery } from "@tanstack/react-query"
import { cacheConfig } from "@/lib/cache-config"
import { queryKeys } from "@/lib/query-keys"
import {
  getProductCategories,
  type ProductCategory,
} from "@/services/category-service"

type UseProductCategoriesReturn = {
  categories: ProductCategory[]
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  error: string | null
}

export function useProductCategories(): UseProductCategoriesReturn {
  const { data, isLoading, isFetching, isSuccess, error } = useQuery({
    queryKey: queryKeys.productCategories.list(),
    queryFn: ({ signal }) => getProductCategories(signal),
    ...cacheConfig.semiStatic,
  })

  let errorMessage: string | null = null
  if (error) {
    errorMessage = error instanceof Error ? error.message : String(error)
  }

  return {
    categories: data?.product_categories || [],
    isLoading,
    isFetching,
    isSuccess,
    error: errorMessage,
  }
}
