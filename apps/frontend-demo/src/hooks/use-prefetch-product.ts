import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useRegion } from "@/hooks/region-hooks"
import { queryKeys } from "@/lib/query-keys"
import { getProduct } from "@/services/product-service"

export function usePrefetchProduct(enabled?: boolean) {
  const { selectedRegion } = useRegion()
  const queryClient = useQueryClient()
  const enabledPrefetch = enabled ?? true

  const prefetchProduct = useCallback(
    (handle: string) => {
      if (!enabledPrefetch) {
        return
      }
      queryClient.prefetchQuery({
        queryKey: queryKeys.product(handle, selectedRegion?.id),
        queryFn: async () => {
          const product = await getProduct(handle, selectedRegion?.id)
          return product
        },
        staleTime: 60 * 60 * 1000,
      })
    },
    [queryClient, selectedRegion?.id, enabledPrefetch]
  )

  return prefetchProduct
}
