import { getProductPrice } from '@lib/util/get-product-price'
import type { HttpTypes } from '@medusajs/types'

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block h-9 w-32 animate-pulse bg-grayscale-50" />
  }

  const hasReducedPrice =
    selectedPrice.calculated_price_number <
    (selectedPrice.original_price_number ?? 0)

  if (hasReducedPrice && variant) {
    return (
      <div>
        <p className="mb-1 text-grayscale-500 text-sm line-through">
          {selectedPrice.original_price}
        </p>
        <p className="mb-8 text-md text-red-primary">
          {selectedPrice.calculated_price}
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="mb-8 text-md">
        {!variant && 'From '}
        {selectedPrice.calculated_price}
      </p>
    </>
  )
}
