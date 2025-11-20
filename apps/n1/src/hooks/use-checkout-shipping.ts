import { cacheConfig } from '@/lib/cache-config'
import { CartServiceError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import {
  type Cart,
  getShippingOptions,
  setShippingMethod,
} from '@/services/cart-service'
import type { HttpTypes } from '@medusajs/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type CartMutationError = {
  message: string
  code?: string
}

type CartMutationContext = {
  previousCart?: Cart
}

export type UseCheckoutShippingReturn = {
  shippingOptions?: HttpTypes.StoreCartShippingOption[]
  isLoadingShipping: boolean
  isErrorShipping: boolean
  setShipping: (optionId: string) => void
  isSettingShipping: boolean
  canLoadShipping: boolean
  canSetShipping: boolean
  selectedShippingMethodId?: string
}

export function useCheckoutShipping(
  cartId?: string,
  cart?: Cart | null
): UseCheckoutShippingReturn {
  const queryClient = useQueryClient()

  // Fetch shipping options for cart
  const {
    data: shippingOptions,
    isLoading: isLoadingShipping,
    isError: isErrorShipping,
  } = useQuery({
    queryKey: queryKeys.cart.shippingOptions(cartId || ''),
    queryFn: () => {
      if (!cartId) {
        throw new CartServiceError('Cart ID je povinné', 'VALIDATION_ERROR')
      }
      return getShippingOptions(cartId)
    },
    enabled: !!cartId && (cart?.items?.length ?? 0) > 0,
    ...cacheConfig.realtime, // Shipping options can change based on cart
  })

  // Set shipping method mutation
  const { mutate: setShipping, isPending: isSettingShipping } = useMutation<
    Cart,
    CartMutationError,
    string,
    CartMutationContext
  >({
    mutationFn: (optionId: string) => {
      if (!cartId) {
        throw new CartServiceError('Cart ID je povinné', 'VALIDATION_ERROR')
      }
      return setShippingMethod(cartId, optionId)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.active() })

      const previousCart = queryClient.getQueryData<Cart>(
        queryKeys.cart.active()
      )

      return { previousCart }
    },
    onSuccess: (updatedCart) => {
      // Update cart cache with shipping method
      queryClient.setQueryData(queryKeys.cart.active(), updatedCart)

      if (process.env.NODE_ENV === 'development') {
        console.log('[useCheckoutShipping] Shipping method set')
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.active(), context.previousCart)
      }
      console.error('[useCheckoutShipping] Failed to set shipping:', error)
    },
    onSettled: () => {
      // Refresh cart and shipping options
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart.shippingOptions(cartId || ''),
      })
    },
  })

  const canLoadShipping = !!cartId && (cart?.items?.length ?? 0) > 0
  const canSetShipping = !!shippingOptions && shippingOptions.length > 0
  const selectedShippingMethodId =
    cart?.shipping_methods?.[0]?.shipping_option_id

  return {
    shippingOptions,
    isLoadingShipping,
    isErrorShipping,
    setShipping,
    isSettingShipping,
    canLoadShipping,
    canSetShipping,
    selectedShippingMethodId,
  }
}
