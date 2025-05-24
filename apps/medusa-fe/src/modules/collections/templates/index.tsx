import { Suspense } from 'react'

import type { HttpTypes } from '@medusajs/types'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import RefinementList from '@modules/store/components/refinement-list'
import type { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from '@modules/store/templates/paginated-products'

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? Number.parseInt(page) : 1
  const sort = sortBy || 'created_at'

  return (
    <div className="flex flex-col py-6 content-container small:flex-row small:items-start">
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{collection.title}</h1>
        </div>
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
