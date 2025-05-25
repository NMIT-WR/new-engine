import CartTemplate from '@modules/cart/templates'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'View your cart',
}
export default function Cart() {
  return <CartTemplate />
}
