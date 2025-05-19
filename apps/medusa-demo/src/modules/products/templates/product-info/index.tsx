import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/LocalizedLink"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <>
      {product.collection && (
        <LocalizedLink
          href={`/collections/${product.collection.handle}`}
          className="text-medium text-fg-muted dark:text-fg-muted-dark hover:text-fg-subtle dark:hover:text-fg-subtle-dark"
        >
          <p className="text-grayscale-500 mb-2">{product.collection.title}</p>
        </LocalizedLink>
      )}
      <h2 className="text-md md:text-xl mb-2">{product.title}</h2>
    </>
  )
}

export default ProductInfo
