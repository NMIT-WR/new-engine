'use client'
import { withReactQueryProvider } from '@lib/util/react-query'
import MobileCheckoutSummary from '@modules/checkout/templates/mobile-checkout-summary'
import SkeletonMobileCheckoutSummaryTrigger from '@modules/skeletons/components/skeleton-mobile-summary-trigger'
import { useCart } from 'hooks/cart'
function MobileCheckoutSummaryWrapper() {
  const { data: cart, isPending } = useCart({ enabled: true })
  if (isPending || !cart) {
    return <SkeletonMobileCheckoutSummaryTrigger />
  }

  return <MobileCheckoutSummary cart={cart} />
}

export default withReactQueryProvider(MobileCheckoutSummaryWrapper)
