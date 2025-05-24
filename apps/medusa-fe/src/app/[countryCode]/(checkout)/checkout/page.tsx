import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import PaymentWrapper from '@modules/checkout/components/payment-wrapper'
import CheckoutForm from '@modules/checkout/templates/checkout-form'
import CheckoutSummary from '@modules/checkout/templates/checkout-summary'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="grid grid-cols-1 gap-x-40 py-12 content-container small:grid-cols-[1fr_416px]">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
