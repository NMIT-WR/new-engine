import { getProductsListWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { useInfiniteQuery } from "@tanstack/react-query"

export const useStoreProducts = ({
  page,
  queryParams,
  sortBy,
  countryCode,
}: {
  page: number
  queryParams: HttpTypes.StoreProductListParams
  sortBy: SortOptions | undefined
  countryCode: string
}) => {
  return useInfiniteQuery({
    initialPageParam: page,
    queryKey: ["products", queryParams, sortBy, countryCode],
    queryFn: async ({ pageParam }) => {
      return getProductsListWithSort({
        page: pageParam,
        queryParams,
        sortBy,
        countryCode,
      })
    },
    getNextPageParam: (lastPage: {
      response: { products: HttpTypes.StoreProduct[]; count: number }
      nextPage: number | null
      queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
    }) => {
      if (!lastPage.nextPage) {
        return undefined
      }
      return (
        Math.ceil(lastPage.nextPage / (lastPage.queryParams?.limit || 12)) + 1
      )
    },
  })
}
