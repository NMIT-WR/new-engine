import { listProducts } from '@lib/data/products'
import type { HttpTypes } from '@medusajs/types'
import { Text } from '@medusajs/ui'

import InteractiveLink from '@modules/common/components/interactive-link'
import ProductPreview from '@modules/products/components/product-preview'

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: '*variants.calculated_price',
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="py-12 content-container small:py-24">
      <div className="mb-8 flex justify-between">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-24 small:grid-cols-3 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
