import { CartServiceError } from '@/lib/errors'
import { queryKeys } from '@/lib/query-keys'
import {
  type Cart,
  createPaymentCollection,
  getPaymentProviders,
} from '@/services/cart-service'
import type { HttpTypes } from '@medusajs/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type CartMutationError = {
  message: string
  code?: string
}

type UseCheckoutPaymentReturn = {
  paymentProviders?: HttpTypes.StorePaymentProvider[]
  isLoadingProviders: boolean
  isErrorProviders: boolean
  initiatePayment: () => void
  isInitiatingPayment: boolean
  canInitiatePayment: boolean
  hasPaymentCollection: boolean
}

export function useCheckoutPayment(
  cartId?: string,
  regionId?: string,
  cart?: Cart | null
): UseCheckoutPaymentReturn {
  const queryClient = useQueryClient()

  // Fetch available payment providers for region
  const {
    data: paymentProviders,
    isLoading: isLoadingProviders,
    isError: isErrorProviders,
  } = useQuery({
    queryKey: queryKeys.payment.providers(regionId || ''),
    queryFn: () => {
      if (!regionId) {
        throw new CartServiceError('Region ID je povinné', 'VALIDATION_ERROR')
      }
      return getPaymentProviders(regionId)
    },
    enabled: !!regionId,
    staleTime: 5 * 60 * 1000,
  })

  // Initiate payment collection mutation
  const { mutate: initiatePayment, isPending: isInitiatingPayment } =
    useMutation<HttpTypes.StorePaymentCollectionResponse, CartMutationError>({
      mutationFn: () => {
        if (!cartId) {
          throw new CartServiceError('Cart ID je povinné', 'VALIDATION_ERROR')
        }
        return createPaymentCollection(cartId)
      },
      onSuccess: () => {
        // Refresh cart to get payment collection
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() })

        if (process.env.NODE_ENV === 'development') {
          console.log('[useCheckoutPayment] Payment collection created')
        }
      },
      onError: (error) => {
        console.error('[useCheckoutPayment] Failed to initiate payment:', error)
      },
    })

  const hasShippingMethod = !!cart?.shipping_methods?.[0]
  const canInitiatePayment = !!cartId && hasShippingMethod
  const hasPaymentCollection = !!cart?.payment_collection

  return {
    paymentProviders,
    isLoadingProviders,
    isErrorProviders,
    initiatePayment,
    isInitiatingPayment,
    canInitiatePayment,
    hasPaymentCollection,
  }
}
