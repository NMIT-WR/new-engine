import { Metadata } from "next"
import CartTemplate from "@modules/cart/templates"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}
export default  function Cart() {

  return <CartTemplate  />
}
