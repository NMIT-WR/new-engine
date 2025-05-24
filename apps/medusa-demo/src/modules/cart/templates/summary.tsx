'use client'

import type { HttpTypes } from '@medusajs/types'

import { Icon } from '@/components/Icon'
import { LocalizedButtonLink, LocalizedLink } from '@/components/LocalizedLink'
import { withReactQueryProvider } from '@lib/util/react-query'
import CartTotals from '@modules/cart/components/cart-totals'
import DiscountCode from '@modules/cart/components/discount-code'
import { getCheckoutStep } from '@modules/cart/utils/getCheckoutStep'
import { useCustomer } from 'hooks/customer'

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  const { data: customer, isPending } = useCustomer()

  return (
    <>
      <CartTotals cart={cart} className="lg:pt-8" />
      <DiscountCode cart={cart} />
      <LocalizedButtonLink
        href={'/checkout?step=' + step}
        isFullWidth
        className="mt-6"
      >
        Proceed to checkout
      </LocalizedButtonLink>
      {!customer && !isPending && (
        <div className="mt-8 flex items-center gap-4 rounded-xs bg-grayscale-50 p-4 text-grayscale-500">
          <Icon name="info" />
          <p>
            Already have an account? No worries, just{' '}
            <LocalizedLink
              href="/auth/login"
              variant="underline"
              className="!p-0 text-black"
            >
              log in.
            </LocalizedLink>
          </p>
        </div>
      )}
    </>
  )
}

export default withReactQueryProvider(Summary)
