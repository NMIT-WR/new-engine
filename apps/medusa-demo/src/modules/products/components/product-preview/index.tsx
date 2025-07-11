import { LocalizedLink } from '@/components/LocalizedLink'
import { getProductPrice } from '@lib/util/get-product-price'
import type { HttpTypes } from '@medusajs/types'
import Thumbnail from '@modules/products/components/thumbnail'

export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const { cheapestPrice } = getProductPrice({
    product: product,
  })

  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  return (
    <LocalizedLink href={`/products/${product.handle}`}>
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        size="square"
        className="mb-4 md:mb-6"
      />
      <div className="flex justify-between max-md:flex-col">
        <div className="max-md:text-xs">
          <p className="mb-1">{product.title}</p>
          {product.collection && (
            <p className="text-grayscale-500 text-xs max-md:hidden">
              {product.collection.title}
            </p>
          )}
        </div>
        {cheapestPrice ? (
          hasReducedPrice ? (
            <div>
              <p className="font-semibold text-red-primary max-md:text-xs">
                {cheapestPrice.calculated_price}
              </p>
              <p className="text-grayscale-500 line-through max-md:text-xs">
                {cheapestPrice.original_price}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold max-md:text-xs">
                {cheapestPrice.calculated_price}
              </p>
            </div>
          )
        ) : null}
      </div>
    </LocalizedLink>
  )
}
