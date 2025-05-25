'use client'
import { withReactQueryProvider } from '@lib/util/react-query'
import CheckoutSummary from '@modules/checkout/templates/checkout-summary'
import SkeletonCheckoutSummary from '@modules/skeletons/templates/skeleton-checkout-summary'
import { useCart } from 'hooks/cart'

function CheckoutSummaryWrapper() {
  const { data: cart, isPending } = useCart({ enabled: true })
  if (isPending || !cart) {
    return <SkeletonCheckoutSummary />
  }

  return <CheckoutSummary cart={cart} />
}

export default withReactQueryProvider(CheckoutSummaryWrapper)
