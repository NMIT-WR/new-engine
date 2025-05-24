import { convertToLocale } from '@lib/util/money'
import type { HttpTypes } from '@medusajs/types'

export const OrderTotals: React.FC<{
  order: HttpTypes.StoreOrder
}> = ({ order }) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    shipping_total,
    discount_total,
    gift_card_total,
  } = order

  return (
    <div className="w-full flex-1 sm:max-w-65">
      <div className="mb-2 flex justify-between gap-4">
        <div className="text-grayscale-500">
          <p>Subtotal</p>
        </div>
        <div className="self-end">
          <p>
            {convertToLocale({
              currency_code: currency_code,
              amount: subtotal ?? 0,
            })}
          </p>
        </div>
      </div>
      {!!discount_total && (
        <div className="mb-2 flex justify-between gap-4">
          <div className="text-grayscale-500">
            <p>Discount</p>
          </div>
          <div className="self-end">
            <p>
              -{' '}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </p>
          </div>
        </div>
      )}
      <div className="mb-2 flex justify-between gap-4">
        <div className="text-grayscale-500">
          <p>Shipping</p>
        </div>
        <div className="self-end">
          <p>
            {convertToLocale({
              currency_code: currency_code,
              amount: shipping_total ?? 0,
            })}
          </p>
        </div>
      </div>
      {!!gift_card_total && (
        <div className="mb-2 flex justify-between gap-4">
          <div className="text-grayscale-500">
            <p>Gift card</p>
          </div>
          <div className="self-end">
            <p>
              -{' '}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </p>
          </div>
        </div>
      )}
      <div className="mt-6 mb-1 flex justify-between gap-4 text-md">
        <div>
          <p>Total</p>
        </div>
        <div className="self-end">
          <p>
            {convertToLocale({
              currency_code: currency_code,
              amount: total ?? 0,
            })}
          </p>
        </div>
      </div>
      <p className="text-grayscale-500 text-xs">
        Including {convertToLocale({ amount: tax_total ?? 0, currency_code })}{' '}
        tax
      </p>
    </div>
  )
}
