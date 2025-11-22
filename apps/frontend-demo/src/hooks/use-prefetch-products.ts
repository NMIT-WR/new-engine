import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useRegions } from "@/hooks/use-region"
import { cacheConfig } from "@/lib/cache-config"
import { queryKeys } from "@/lib/query-keys"
import { getProducts, type ProductListParams } from "@/services/product-service"

type UsePrefetchProductsOptions = {
  enabled?: boolean
  // Allow custom cache config if needed
  cacheStrategy?: keyof typeof cacheConfig
}

const DEFAULT_LIMIT = 12

export function usePrefetchProducts(options?: UsePrefetchProductsOptions) {
  const { selectedRegion } = useRegions()
  const queryClient = useQueryClient()
  const enabled = options?.enabled ?? true
  const cacheStrategy = options?.cacheStrategy ?? "semiStatic"

  const prefetchProducts = useCallback(
    (params?: Omit<ProductListParams, "region_id">) => {
      if (!(enabled && selectedRegion?.id)) {
        return
      }

      const queryParams = {
        ...params,
        region_id: selectedRegion.id,
      }

      queryClient.prefetchQuery({
        queryKey: queryKeys.products.list({
          page: params?.offset
            ? Math.floor(params.offset / (params.limit || DEFAULT_LIMIT)) + 1
            : 1,
          limit: params?.limit,
          filters: params?.filters,
          sort: params?.sort,
          category: params?.category,
          q: params?.q,
          region_id: selectedRegion.id,
        }),
        queryFn: () => getProducts(queryParams),
        ...cacheConfig[cacheStrategy],
      })
    },
    [queryClient, selectedRegion?.id, enabled, cacheStrategy]
  )

  // Prefetch default products page (first page, no filters)
  const prefetchDefaultProducts = useCallback(() => {
    prefetchProducts({
      limit: DEFAULT_LIMIT,
      offset: 0,
      filters: {
        categories: [],
        sizes: [],
      },
      sort: "newest",
    })
  }, [prefetchProducts])

  // Prefetch products for a specific category
  const prefetchCategoryProducts = useCallback(
    (categoryHandle: string) => {
      prefetchProducts({
        category: categoryHandle,
        limit: DEFAULT_LIMIT,
        offset: 0,
        sort: "newest", // Add default sort
      })
    },
    [prefetchProducts]
  )

  // Prefetch next page of current query
  const prefetchNextPage = useCallback(
    (currentParams: ProductListParams, currentPage: number) => {
      const limit = currentParams.limit || DEFAULT_LIMIT
      prefetchProducts({
        ...currentParams,
        offset: currentPage * limit,
      })
    },
    [prefetchProducts]
  )

  return {
    prefetchProducts,
    prefetchDefaultProducts,
    prefetchCategoryProducts,
    prefetchNextPage,
  }
}
