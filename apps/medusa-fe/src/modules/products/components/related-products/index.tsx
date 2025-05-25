import { listProducts } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import type { HttpTypes } from '@medusajs/types'
import Product from '../product-preview'

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="mb-16 flex flex-col items-center text-center">
        <span className="mb-6 text-base-regular text-gray-600">
          Related products
        </span>
        <p className="max-w-lg text-2xl-regular text-ui-fg-base">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 medium:grid-cols-4 gap-x-6 gap-y-8 small:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
