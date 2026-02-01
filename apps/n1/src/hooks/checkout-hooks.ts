import type { HttpTypes } from "@medusajs/types"
import { createCheckoutHooks } from "@techsio/storefront-data"
import { queryKeys } from "@/lib/query-keys"
import {
  type Cart,
  createPaymentCollection,
  getPaymentProviders,
  getShippingOptions,
  setShippingMethod,
  type ShippingMethodData,
} from "@/services/cart-service"

/**
 * Cart query keys for cache management
 */
const cartQueryKeys = {
  all: () => queryKeys.cart.all(),
  active: (params: { cartId?: string | null; regionId?: string | null }) =>
    queryKeys.cart.active(params),
  detail: (cartId: string) =>
    [...queryKeys.cart.all(), "detail", cartId] as const,
}

/**
 * Checkout hooks factory configuration
 *
 * Creates hooks with full TanStack Query lifecycle support including
 * onMutate for optimistic updates.
 */
export const checkoutHooks = createCheckoutHooks<
  Cart,
  HttpTypes.StoreCartShippingOption,
  HttpTypes.StorePaymentProvider,
  HttpTypes.StorePaymentCollectionResponse,
  Cart
>({
  service: {
    listShippingOptions: (cartId, _signal) => getShippingOptions(cartId),
    addShippingMethod: (cartId, optionId, data) =>
      setShippingMethod(cartId, optionId, data as ShippingMethodData),
    listPaymentProviders: (regionId, _signal) => getPaymentProviders(regionId),
    initiatePaymentSession: createPaymentCollection,
  },
  queryKeyNamespace: "n1",
  cartQueryKeys,
})

export const {
  useCheckoutShipping,
  useSuspenseCheckoutShipping,
  useCheckoutPayment,
  useSuspenseCheckoutPayment,
} = checkoutHooks
