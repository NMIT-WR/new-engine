'use client'
import { LocalizedLink } from '@/components/LocalizedLink'
import { NumberField } from '@/components/NumberField'
import { getVariantItemsInStock } from '@lib/util/inventory'
import { withReactQueryProvider } from '@lib/util/react-query'
import type { HttpTypes } from '@medusajs/types'
import ErrorMessage from '@modules/checkout/components/error-message'
import DeleteButton from '@modules/common/components/delete-button'
import LineItemUnitPrice from '@modules/common/components/line-item-unit-price'
import Thumbnail from '@modules/products/components/thumbnail'
import { useUpdateLineItem } from 'hooks/cart'
import * as React from 'react'
import { twMerge } from 'tailwind-merge'

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  className?: string
}

const Item = ({ item, className }: ItemProps) => {
  const { handle } = item.variant?.product ?? {}
  const { mutateAsync, isPending, error } = useUpdateLineItem()
  const maxQuantity = item.variant ? getVariantItemsInStock(item.variant) : 0

  const [quantity, setQuantity] = React.useState(item.quantity)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (quantity !== item.quantity) {
        mutateAsync({ lineId: item.id, quantity })
      }
    }, 500)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, item])

  return (
    <div
      className={twMerge(
        'border-grayscale-100 border-b py-8 lg:last:border-b-0 lg:last:pb-0',
        className
      )}
    >
      <div className="flex gap-6">
        <LocalizedLink href={`/products/${handle}`}>
          <Thumbnail
            thumbnail={item.variant?.product?.thumbnail}
            images={item.variant?.product?.images}
            size="3/4"
            className="w-25 sm:w-30"
          />
        </LocalizedLink>
        <div className="flex flex-grow flex-col justify-between">
          <div>
            <h2 className="font-normal text-base sm:text-md">
              <LocalizedLink href={`/products/${handle}`}>
                {item.product_title}
              </LocalizedLink>
            </h2>
            <p className="text-grayscale-500 text-xs max-sm:mb-4 sm:text-base">
              {item.variant?.title}
            </p>
            <LineItemUnitPrice item={item} className="sm:hidden" />
          </div>
          <NumberField
            size="sm"
            minValue={1}
            maxValue={maxQuantity}
            value={quantity}
            onChange={setQuantity}
            isDisabled={isPending}
            className="w-25"
            aria-label="Quantity"
          />
        </div>
        <div className="flex flex-col items-end justify-between text-right">
          <LineItemUnitPrice item={item} className="max-sm:hidden" />
          <DeleteButton id={item.id} data-testid="product-delete-button" />
        </div>
      </div>
      <ErrorMessage
        error={error?.message}
        data-testid="product-error-message"
      />
    </div>
  )
}

export default withReactQueryProvider(Item)
