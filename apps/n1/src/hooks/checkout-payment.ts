import type { HttpTypes } from "@medusajs/types"
import { useCartToast } from "@/hooks/use-toast"
import { type Cart } from "@/services/cart-service"
import { checkoutHooks } from "./checkout-hooks"

export type UseCheckoutPaymentReturn = {
  paymentProviders: HttpTypes.StorePaymentProvider[]
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
  const toast = useCartToast()

  const result = checkoutHooks.useSuspenseCheckoutPayment(
    {
      cartId,
      regionId: regionId ?? cart?.region_id ?? undefined,
      cart,
    },
    {
      onSuccess: () => {
        if (process.env.NODE_ENV === "development") {
          console.log("[useCheckoutPayment] Payment collection created")
        }
      },
      onError: (error) => {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "[useCheckoutPayment] Failed to initiate payment:",
            error
          )
        }

        // Show error toast
        toast.paymentInitiatedError()
      },
    }
  )

  return {
    paymentProviders: result.paymentProviders,
    initiatePayment: result.initiatePayment,
    isInitiatingPayment: result.isInitiatingPayment,
    canInitiatePayment: result.canInitiatePayment,
    hasPaymentCollection: result.hasPaymentCollection,
    hasPaymentSessions: result.hasPaymentSessions,
  }
}
