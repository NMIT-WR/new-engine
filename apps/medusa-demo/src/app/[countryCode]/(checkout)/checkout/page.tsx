import { getCartId } from '@lib/data/cookies'
import { CheckoutForm } from '@modules/checkout/components/checkout-form'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Checkout',
}

export default async function Checkout({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const cart = await getCartId()
  if (!cart) {
    return notFound()
  }

  const { countryCode } = await params
  const { step } = await searchParams

  return <CheckoutForm countryCode={countryCode} step={step} />
}
