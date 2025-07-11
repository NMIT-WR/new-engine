'use client'
import type { HttpTypes } from '@medusajs/types'

import { convertToLocale } from '@lib/util/money'

type CartTotalsProps = {
  cart: HttpTypes.StoreCart
}

const CartTotals = ({ cart }: CartTotalsProps) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    shipping_total,
    gift_card_total,
  } = cart

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2 lg:gap-1">
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Subtotal</p>
          </div>
          <div className="self-end">
            <p>{convertToLocale({ amount: subtotal ?? 0, currency_code })}</p>
          </div>
        </div>
        {!!discount_total && (
          <div className="flex justify-between max-lg:text-xs">
            <div>
              <p>Discount</p>
            </div>
            <div className="self-end">
              <p>
                -{' '}
                {convertToLocale({
                  amount: discount_total ?? 0,
                  currency_code,
                })}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Shipping</p>
          </div>
          <div className="self-end">
            <p>
              {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
            </p>
          </div>
        </div>
        <div className="flex justify-between max-lg:text-xs">
          <div>
            <p>Taxes</p>
          </div>
          <div className="self-end">
            <p>{convertToLocale({ amount: tax_total ?? 0, currency_code })}</p>
          </div>
        </div>
        {!!gift_card_total && (
          <div className="flex justify-between max-lg:text-xs">
            <div>
              <p>Gift card</p>
            </div>
            <div className="self-end">
              <p>
                -{' '}
                {convertToLocale({
                  amount: gift_card_total ?? 0,
                  currency_code,
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between text-md">
        <div>
          <p>Total</p>
        </div>
        <div className="self-end">
          <p>{convertToLocale({ amount: total ?? 0, currency_code })}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-full w-auto bg-black" />
    </div>
  )
}

export default CartTotals
