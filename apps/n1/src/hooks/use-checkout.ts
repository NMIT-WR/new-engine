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
  // Note: We validate billing_address from form - shipping_address is set at checkout time
  const isReady =
    !!cart?.billing_address?.first_name && // Billing address IS filled
    !!cart?.billing_address?.last_name && // Required fields present
    !!cart?.billing_address?.address_1 &&
    !!cart?.billing_address?.city &&
    !!cart?.billing_address?.postal_code &&
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
