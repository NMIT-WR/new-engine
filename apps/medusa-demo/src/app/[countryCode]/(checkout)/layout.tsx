import { Layout, LayoutColumn } from '@/components/Layout'
import { LocalizedLink } from '@/components/LocalizedLink'
import dynamic from 'next/dynamic'
import type * as React from 'react'

const CheckoutSummaryWrapper = dynamic(
  () => import('@modules/checkout/components/checkout-summary-wrapper'),
  { loading: () => <></> }
)

const MobileCheckoutSummaryWrapper = dynamic(
  () => import('@modules/checkout/components/mobile-checkout-summary-wrapper'),
  { loading: () => <></> }
)
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Layout className="lg:hidden">
        <LayoutColumn>
          <div className="flex h-18 items-center justify-between">
            <LocalizedLink href="/" className="font-medium text-md">
              SofaSocietyCo.
            </LocalizedLink>
            <div>
              <p className="font-semibold">Checkout</p>
            </div>
          </div>
        </LayoutColumn>
      </Layout>
      <div className="w-full bg-grayscale-50 lg:hidden">
        <Layout>
          <LayoutColumn>
            <MobileCheckoutSummaryWrapper />
          </LayoutColumn>
        </Layout>
      </div>
      <Layout>
        <LayoutColumn className="relative flex max-lg:flex-col-reverse lg:justify-between">
          <div className="flex-1 pt-8 pb-9 lg:max-w-125 lg:pb-40 xl:max-w-150">
            <LocalizedLink
              href="/"
              className="mb-16 inline-block font-medium text-md max-lg:hidden"
            >
              SofaSocietyCo.
            </LocalizedLink>
            {children}
          </div>
          <div className="sticky top-0 z-10 flex-1 self-start py-32 max-lg:hidden lg:max-w-100 xl:max-w-123">
            <CheckoutSummaryWrapper />
          </div>
          <div className="-mr-[calc(50vw-50%)] absolute top-0 right-0 h-full w-full bg-grayscale-50 max-lg:hidden lg:max-w-[calc((50vw-50%)+448px)] xl:max-w-[calc((50vw-50%)+540px)]" />
        </LayoutColumn>
      </Layout>
    </>
  )
}
