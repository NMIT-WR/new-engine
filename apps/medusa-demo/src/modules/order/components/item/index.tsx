import { LocalizedLink } from '@/components/LocalizedLink'
import type { HttpTypes } from '@medusajs/types'
import LineItemUnitPrice from '@modules/common/components/line-item-unit-price'
import Thumbnail from '@modules/products/components/thumbnail'
import { twMerge } from 'tailwind-merge'

type ItemProps = {
  item: HttpTypes.StoreOrderLineItem
  className?: string
}

const Item = ({ item, className }: ItemProps) => {
  return (
    <div
      className={twMerge(
        'mb-6 flex gap-x-6 gap-y-6 border-grayscale-100 border-b pb-6 last:mb-0 last:border-0 last:pb-0 sm:gap-x-8',
        className
      )}
    >
      <LocalizedLink href={`/products/${item.product_handle}`}>
        <Thumbnail
          thumbnail={item.variant?.product?.thumbnail}
          images={item.variant?.product?.images}
          size="3/4"
          className="w-27 sm:w-37"
        />
      </LocalizedLink>
      <div className="flex flex-1 flex-col">
        <p className="mb-2 sm:text-md">
          <LocalizedLink href={`/products/${item.product_handle}`}>
            {item.product_title}
          </LocalizedLink>
        </p>
        <div className="flex flex-1 flex-col text-xs">
          <div>
            {item.variant?.options?.map((option) => (
              <p className="mb-1" key={option.id}>
                <span className="mr-2 text-grayscale-500">
                  {option.option?.title}:
                </span>
                {option.value}
              </p>
            ))}
          </div>
          <div className="relative flex justify-between gap-x-10 gap-y-6 max-sm:h-full max-sm:flex-col sm:mt-auto sm:items-center">
            <div className="sm:mb-1 sm:self-end">
              <p>
                <span className="mr-2 text-grayscale-500">Quantity:</span>
                {item.quantity}
              </p>
            </div>
            <LineItemUnitPrice
              item={item}
              regularPriceClassName="text-base sm:text-md font-normal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
