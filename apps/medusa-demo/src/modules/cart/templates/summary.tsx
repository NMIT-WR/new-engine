"use client"

import { HttpTypes } from "@medusajs/types"

import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"
import CartTotals from "@modules/cart/components/cart-totals"
import DiscountCode from "@modules/cart/components/discount-code"
import { getCheckoutStep } from "@modules/cart/utils/getCheckoutStep"
import { Icon } from "@/components/Icon"
import { useCustomer } from "hooks/customer"
import { withReactQueryProvider } from "@lib/util/react-query"

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
        href={"/checkout?step=" + step}
        isFullWidth
        className="mt-6"
      >
        Proceed to checkout
      </LocalizedButtonLink>
      {!customer && !isPending && (
        <div className="bg-grayscale-50 mt-8 rounded-xs p-4 flex items-center text-grayscale-500 gap-4">
          <Icon name="info" />
          <p>
            Already have an account? No worries, just{" "}
            <LocalizedLink
              href="/auth/login"
              variant="underline"
              className="text-black !p-0"
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
