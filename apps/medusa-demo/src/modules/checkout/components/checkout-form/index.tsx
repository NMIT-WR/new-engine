'use client'
import { withReactQueryProvider } from '@lib/util/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Icon } from '@/components/Icon'
import { getCheckoutStep } from '@modules/cart/utils/getCheckoutStep'
import Addresses from '@modules/checkout/components/addresses'
import Email from '@modules/checkout/components/email'
import Payment from '@modules/checkout/components/payment'
import Wrapper from '@modules/checkout/components/payment-wrapper'
import Review from '@modules/checkout/components/review'
import Shipping from '@modules/checkout/components/shipping'
import { useCart } from 'hooks/cart'

export const CheckoutForm = withReactQueryProvider<{
  countryCode: string
  step: string | undefined
}>(({ countryCode, step }) => {
  const { data: cart, isPending } = useCart({ enabled: true })
  const router = useRouter()
  React.useEffect(() => {
    if (!step && cart) {
      const checkoutStep = getCheckoutStep(cart)
      router.push(`/${countryCode}/checkout?step=${checkoutStep}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, countryCode, cart])
  if (isPending) {
    return (
      <div className="-ml-[calc(50vw-50%)] absolute top-20 left-0 flex h-screen w-[100vw] items-center justify-center md:top-40 lg:top-0 lg:w-full lg:max-w-[calc(100vw-((50vw-50%)+448px))] xl:max-w-[calc(100vw-((50vw-50%)+540px))]">
        <Icon name="loader" className="w-10 animate-spin md:w-20" />
      </div>
    )
  }

  if (!cart) {
    return null
  }

  return (
    <Wrapper cart={cart}>
      <Email countryCode={countryCode} cart={cart} />
      <Addresses cart={cart} />
      <Shipping cart={cart} />
      <Payment cart={cart} />
      <Review cart={cart} />
    </Wrapper>
  )
})
