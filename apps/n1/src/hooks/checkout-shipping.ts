import type { HttpTypes } from "@medusajs/types"
import { useQueryClient } from "@tanstack/react-query"
import { TAX_RATE } from "@/lib/constants"
import { queryKeys } from "@/lib/query-keys"
import { type Cart, type ShippingMethodData } from "@/services/cart-service"
import { checkoutHooks } from "./checkout-hooks"
import { useCartToast } from "./use-toast"

type ShippingMutationContext = {
  previousCart?: Cart
}

export type UseCheckoutShippingReturn = {
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  setShipping: (optionId: string, data?: ShippingMethodData) => void
  isSettingShipping: boolean
  canLoadShipping: boolean
  canSetShipping: boolean
  selectedShippingMethodId?: string
  selectedOption?: HttpTypes.StoreCartShippingOption
}

export function useCheckoutShipping(
  cartId?: string,
  cart?: Cart | null
): UseCheckoutShippingReturn {
  const queryClient = useQueryClient()
  const toast = useCartToast()

  const cartQueryKey = cartId
    ? queryKeys.cart.active({
        cartId,
        regionId: cart?.region_id ?? null,
      })
    : queryKeys.cart.active()

  const canLoadShipping = !!cartId && (cart?.items?.length ?? 0) > 0

  const result = checkoutHooks.useSuspenseCheckoutShipping(
    {
      cartId: cartId ?? "",
      cart,
    },
    {
      onMutate: async (variables: { optionId: string; data?: Record<string, unknown> }) => {
        const { optionId } = variables
        // Cancel outgoing queries to prevent race conditions
        await queryClient.cancelQueries({ queryKey: cartQueryKey })

        // Snapshot previous value for rollback
        const previousCart = queryClient.getQueryData<Cart>(cartQueryKey)

        // Optimistically update cart with new shipping method
        if (previousCart && result.shippingOptions) {
          const selectedOption = result.shippingOptions.find(
            (opt) => opt.id === optionId
          )

          if (selectedOption) {
            // Calculate amount with tax using centralized constant
            const amountWithTax = (selectedOption.amount ?? 0) * (1 + TAX_RATE)

            const optimisticCart: Cart = {
              ...previousCart,
              shipping_methods: [
                {
                  id: `optimistic_${Date.now()}`,
                  cart_id: cartId || "",
                  shipping_option_id: optionId,
                  name: selectedOption.name,
                  amount: selectedOption.amount ?? 0,
                  is_tax_inclusive: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ],
              shipping_total: amountWithTax,
            }

            // Immediately update UI
            queryClient.setQueryData(cartQueryKey, optimisticCart)

            if (process.env.NODE_ENV === "development") {
              console.log("[useCheckoutShipping] Optimistic update applied")
            }
          }
        }

        return { previousCart }
      },
      onSuccess: (updatedCart) => {
        // Replace optimistic data with real server data
        queryClient.setQueryData(cartQueryKey, updatedCart)

        if (process.env.NODE_ENV === "development") {
          console.log("[useCheckoutShipping] Shipping method confirmed:", {
            methodId: updatedCart.shipping_methods?.[0]?.shipping_option_id,
            total: updatedCart.shipping_total,
          })
        }
      },
      onError: (
        _error: unknown,
        _variables: { optionId: string; data?: Record<string, unknown> },
        context: ShippingMutationContext | undefined
      ) => {
        // Rollback to previous cart state
        if (context?.previousCart) {
          queryClient.setQueryData(cartQueryKey, context.previousCart)
        }

        // Show error toast to user
        toast.shippingError()

        if (process.env.NODE_ENV === "development") {
          console.error("[useCheckoutShipping] Failed to set shipping:", _error)
        }
      },
    }
  )

  const canSetShipping = result.shippingOptions.length > 0

  // Wrapper for easier API - accepts optionId and optional data
  const setShipping = (optionId: string, data?: ShippingMethodData) => {
    result.setShippingMethod(optionId, data)
  }

  return {
    shippingOptions: result.shippingOptions,
    setShipping,
    isSettingShipping: result.isSettingShipping,
    canLoadShipping,
    canSetShipping,
    selectedShippingMethodId: result.selectedShippingMethodId,
    selectedOption: result.selectedOption,
  }
}
