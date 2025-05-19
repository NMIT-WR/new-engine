"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

import { Form, InputField } from "@/components/Forms"
import { codeFormSchema } from "@modules/cart/components/discount-code"
import { SubmitButton } from "@modules/common/components/submit-button"
import { useApplyPromotions } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const applyPromotions = useApplyPromotions()

  const { promotions = [] } = cart
  const addPromotionCode = async (values: { code: string }) => {
    if (!values.code) {
      return
    }
    const codes = promotions
      .filter((p) => p.code === undefined)
      .map((p) => p.code!)
    codes.push(values.code)

    await applyPromotions.mutateAsync(codes)
  }

  return (
    <Form onSubmit={addPromotionCode} schema={codeFormSchema}>
      <div className="flex max-sm:flex-col gap-x-6 gap-y-4 mb-8">
        <InputField
          name="code"
          inputProps={{ autoFocus: false, className: "max-lg:h-12" }}
          placeholder="Discount code"
          className="flex-1"
        />
        <SubmitButton className="lg:h-auto max-h-14 grow-0 h-12">
          Apply
        </SubmitButton>
      </div>
    </Form>
  )
}

export default withReactQueryProvider(DiscountCode)
