import * as React from "react"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import dynamic from "next/dynamic"

const CheckoutSummaryWrapper = dynamic(
  () => import("@modules/checkout/components/checkout-summary-wrapper"),
  { loading: () => <></> }
)

const  MobileCheckoutSummaryWrapper= dynamic(
  () => import("@modules/checkout/components/mobile-checkout-summary-wrapper"),
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
          <div className="flex justify-between items-center h-18">
            <LocalizedLink href="/" className="text-md font-medium">
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
        <LayoutColumn className="flex max-lg:flex-col-reverse lg:justify-between relative">
          <div className="flex-1 pt-8 lg:max-w-125 xl:max-w-150 pb-9 lg:pb-40">
            <LocalizedLink
              href="/"
              className="text-md font-medium mb-16 inline-block max-lg:hidden"
            >
              SofaSocietyCo.
            </LocalizedLink>
            {children}
          </div>
          <div className="sticky top-0 lg:max-w-100 xl:max-w-123 flex-1 py-32 max-lg:hidden z-10 self-start">
            <CheckoutSummaryWrapper />
          </div>
          <div className="absolute right-0 top-0 lg:max-w-[calc((50vw-50%)+448px)] xl:max-w-[calc((50vw-50%)+540px)] -mr-[calc(50vw-50%)] bg-grayscale-50 h-full w-full max-lg:hidden" />
        </LayoutColumn>
      </Layout>
    </>
  )
}
