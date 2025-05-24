import { LocalizedLink } from '@/components/LocalizedLink'
import type { HttpTypes } from '@medusajs/types'

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <>
      {product.collection && (
        <LocalizedLink
          href={`/collections/${product.collection.handle}`}
          className="text-fg-muted text-medium hover:text-fg-subtle dark:text-fg-muted-dark dark:hover:text-fg-subtle-dark"
        >
          <p className="mb-2 text-grayscale-500">{product.collection.title}</p>
        </LocalizedLink>
      )}
      <h2 className="mb-2 text-md md:text-xl">{product.title}</h2>
    </>
  )
}

export default ProductInfo
