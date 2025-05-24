'use client'

import type { HttpTypes } from '@medusajs/types'
import type React from 'react'

import { Form, InputField } from '@/components/Forms'
import { withReactQueryProvider } from '@lib/util/react-query'
import { SubmitButton } from '@modules/common/components/submit-button'
import { useApplyPromotions } from 'hooks/cart'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart
  className?: string
}

export const codeFormSchema = z.object({
  code: z.string().min(1),
})

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart, className }) => {
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
      <div className={twMerge('mt-10 flex gap-2', className)}>
        <InputField
          name="code"
          inputProps={{ autoFocus: false, uiSize: 'md' }}
          placeholder="Discount code"
          className="flex flex-1 flex-col"
        />
        <SubmitButton>Apply</SubmitButton>
      </div>
    </Form>
  )
}

export default withReactQueryProvider(DiscountCode)
