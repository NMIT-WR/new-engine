import type { Cart } from '@/services/cart-service'
import { useCheckoutPayment } from './use-checkout-payment'
import { useCheckoutShipping } from './use-checkout-shipping'

export function useCheckout(
  cartId?: string,
  regionId?: string,
  cart?: Cart | null
) {
  const shipping = useCheckoutShipping(cartId, cart)
  const payment = useCheckoutPayment(cartId, regionId, cart)

  const isReady = shipping.canSetShipping && payment.canInitiatePayment

  return {
    shipping,
    payment,
    isReady,
  }
}
