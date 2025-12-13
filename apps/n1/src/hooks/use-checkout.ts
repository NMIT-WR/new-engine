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

  // Check if checkout is ACTUALLY ready (not just if it CAN be ready)
  const isReady =
    !!cart?.shipping_address?.first_name && // Shipping address IS filled
    !!cart?.shipping_address?.last_name && // Required fields present
    !!cart?.shipping_address?.address_1 &&
    !!cart?.shipping_address?.city &&
    !!cart?.shipping_address?.postal_code &&
    !!shipping.selectedShippingMethodId && // Shipping IS selected
    payment.hasPaymentSessions && // Payment IS initialized
    !shipping.isSettingShipping && // Not currently setting shipping
    !payment.isInitiatingPayment // Not currently initiating payment

  return {
    shipping,
    payment,
    isReady,
  }
}
