import { getPricesForVariant } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { twMerge } from "tailwind-merge"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  className?: string
  regularPriceClassName?: string
}

const LineItemUnitPrice = ({
  item,
  className,
  regularPriceClassName,
}: LineItemUnitPriceProps) => {
  const {
    original_price,
    calculated_price,
    original_price_number,
    calculated_price_number,
  } = item.variant ? (getPricesForVariant(item.variant) ?? {}) : {}
  const hasReducedPrice =
    (calculated_price_number ?? 0) < (original_price_number ?? 0)

  return (
    <div className={className}>
      {hasReducedPrice ? (
        <>
          <p className="text-base sm:text-sm font-semibold text-red-primary">
            {calculated_price}
          </p>
          <p className="text-grayscale-500 line-through">{original_price}</p>
        </>
      ) : (
        <p
          className={twMerge(
            "text-xs sm:text-sm font-semibold",
            regularPriceClassName
          )}
        >
          {calculated_price}
        </p>
      )}
    </div>
  )
}

export default LineItemUnitPrice
