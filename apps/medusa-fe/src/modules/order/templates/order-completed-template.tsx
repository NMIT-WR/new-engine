import { Heading } from '@medusajs/ui'
import { cookies as nextCookies } from 'next/headers'

import type { HttpTypes } from '@medusajs/types'
import CartTotals from '@modules/common/components/cart-totals'
import Help from '@modules/order/components/help'
import Items from '@modules/order/components/items'
import OnboardingCta from '@modules/order/components/onboarding-cta'
import OrderDetails from '@modules/order/components/order-details'
import PaymentDetails from '@modules/order/components/payment-details'
import ShippingDetails from '@modules/order/components/shipping-details'

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get('_medusa_onboarding')?.value === 'true'

  return (
    <div className="min-h-[calc(100vh-64px)] py-6">
      <div className="flex h-full w-full max-w-4xl flex-col items-center justify-center gap-y-10 content-container">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex h-full w-full max-w-4xl flex-col gap-4 bg-white py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="mb-4 flex flex-col gap-y-3 text-3xl text-ui-fg-base"
          >
            <span>Thank you!</span>
            <span>Your order was placed successfully.</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            Summary
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
