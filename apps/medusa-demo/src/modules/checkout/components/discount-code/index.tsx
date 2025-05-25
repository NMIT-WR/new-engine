'use client'

import type { HttpTypes } from '@medusajs/types'
import type React from 'react'

import { Form, InputField } from '@/components/Forms'
import { withReactQueryProvider } from '@lib/util/react-query'
import { codeFormSchema } from '@modules/cart/components/discount-code'
import { SubmitButton } from '@modules/common/components/submit-button'
import { useApplyPromotions } from 'hooks/cart'

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
      <div className="mb-8 flex gap-x-6 gap-y-4 max-sm:flex-col">
        <InputField
          name="code"
          inputProps={{ autoFocus: false, className: 'max-lg:h-12' }}
          placeholder="Discount code"
          className="flex-1"
        />
        <SubmitButton className="h-12 max-h-14 grow-0 lg:h-auto">
          Apply
        </SubmitButton>
      </div>
    </Form>
  )
}

export default withReactQueryProvider(DiscountCode)
