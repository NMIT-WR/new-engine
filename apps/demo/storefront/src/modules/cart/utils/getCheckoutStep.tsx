import { HttpTypes } from "@medusajs/types"

export function getCheckoutStep(cart?: HttpTypes.StoreCart) {
  if (!cart?.email) {
    return "email"
  }

  if (!cart?.shipping_address?.address_1) {
    return "delivery"
  }

  if (cart?.shipping_methods?.length === 0) {
    return "shipping"
  }

  if (!cart?.payment_collection) {
    return "payment"
  }

  return "review"
}
