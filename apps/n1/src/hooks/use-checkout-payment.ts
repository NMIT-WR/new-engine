import { useCartToast } from '@/hooks/use-toast'
import { CACHE_TIMES } from '@/lib/constants'
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
  initiatePayment: (providerId: string) => void
  isInitiatingPayment: boolean
  canInitiatePayment: boolean
  hasPaymentCollection: boolean
  hasPaymentSessions: boolean
}

export function useCheckoutPayment(
  cartId?: string,
  regionId?: string,
  cart?: Cart | null
): UseCheckoutPaymentReturn {
  const queryClient = useQueryClient()
  const toast = useCartToast()

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
    staleTime: CACHE_TIMES.PAYMENT_PROVIDERS_STALE,
  })

  // Initiate payment collection mutation
  const { mutate: initiatePayment, isPending: isInitiatingPayment } =
    useMutation<
      HttpTypes.StorePaymentCollectionResponse,
      CartMutationError,
      string
    >({
      mutationFn: (providerId: string) => {
        if (!cartId) {
          throw new CartServiceError('Cart ID je povinné', 'VALIDATION_ERROR')
        }
        if (!providerId) {
          throw new CartServiceError(
            'Provider ID je povinné',
            'VALIDATION_ERROR'
          )
        }
        return createPaymentCollection(cartId, providerId)
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

        // Show error toast
        toast.paymentInitiatedError()
      },
    })

  const hasShippingMethod = !!cart?.shipping_methods?.[0]
  const canInitiatePayment = !!cartId && hasShippingMethod
  const hasPaymentCollection = !!cart?.payment_collection
  const hasPaymentSessions =
    (cart?.payment_collection?.payment_sessions?.length || 0) > 0

  return {
    paymentProviders,
    isLoadingProviders,
    isErrorProviders,
    initiatePayment,
    isInitiatingPayment,
    canInitiatePayment,
    hasPaymentCollection,
    hasPaymentSessions,
  }
}
