import React from 'react'

import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import { CollectionsSlider } from '@modules/store/components/collections-slider'
import RefinementList from '@modules/store/components/refinement-list'
import type { SortOptions } from '@modules/store/components/refinement-list/sort-products'

import { getCategoriesList } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import { getProductTypesList } from '@lib/data/product-types'
import { getRegion } from '@lib/data/regions'
import type { HttpTypes } from '@medusajs/types'
import PaginatedProducts from '@modules/store/templates/paginated-products'

const StoreTemplate = async ({
  sortBy,
  collection,
  category,
  type,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection?: string[]
  category?: string[]
  type?: string[]
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? Number.parseInt(page, 10) : 1

  console.log(
    `[StoreTemplate] Rendering for countryCode: '${countryCode}', NODE_ENV: ${process.env.NODE_ENV}`
  )
  const intendedServerBaseUrl =
    process.env.MEDUSA_BACKEND_URL || 'http://medusa-be:9000'
  console.log(
    `[StoreTemplate] Intended SDK Base URL for operations: ${intendedServerBaseUrl}`
  )

  let collections, categories, types, region

  try {
    ;[collections, categories, types, region] = await Promise.all([
      getCollectionsList(0, 100, ['id', 'title', 'handle']),
      getCategoriesList(0, 100, ['id', 'name', 'handle']),
      getProductTypesList(0, 100, ['id', 'value']),
      getRegion(countryCode),
    ])
  } catch (error) {
    console.error('[StoreTemplate] CRITICAL ERROR in Promise.all:', error)
    // in error case variables will be undefined
  }

  // check fetched data
  console.log(
    `[StoreTemplate] Fetched collections, categories, types, region:  ${collections}, ${categories}, ${types}, ${region}`
  )

  const regionIdFromData =
    region && typeof region === 'object' && 'id' in region
      ? (region as HttpTypes.StoreRegion).id
      : 'N/A or region is not an object'
  console.log(
    `[StoreTemplate] Fetched region object: ${JSON.stringify(region)}`
  )
  console.log(`[StoreTemplate] Extracted Region ID: ${regionIdFromData}`)

  const collectionIdForPaginated =
    !collection || !collections?.collections
      ? undefined
      : collections.collections
          .filter((c: HttpTypes.StoreCollection) =>
            collection.includes(c.handle)
          )
          .map((c: HttpTypes.StoreCollection) => c.id)

  const categoryIdForPaginated =
    !category || !categories?.product_categories
      ? undefined
      : categories.product_categories
          .filter((c: HttpTypes.StoreProductCategory) =>
            category.includes(c.handle)
          )
          .map((c: HttpTypes.StoreProductCategory) => c.id)

  const typeIdForPaginated =
    !type || !types?.productTypes
      ? undefined
      : types.productTypes
          .filter((t: HttpTypes.StoreProductType) => type.includes(t.value))
          .map((t: HttpTypes.StoreProductType) => t.id)

  console.log(
    `[StoreTemplate] Props for PaginatedProducts - sortBy: ${sortBy}, page: ${pageNumber}, countryCode: ${countryCode}`
  )

  console.log(
    `[StoreTemplate] Is region valid for PaginatedProducts? ${region ? 'Yes' : 'No'}`
  )

  return (
    <div className="py-26 md:pt-47 md:pb-36">
      <CollectionsSlider />
      <RefinementList
        collections={Object.fromEntries(
          collections?.collections?.map((c: HttpTypes.StoreCollection) => [
            c.handle,
            c.title,
          ]) ?? []
        )}
        collection={collection}
        categories={Object.fromEntries(
          categories?.product_categories?.map(
            (c: HttpTypes.StoreProductCategory) => [c.handle, c.name]
          ) ?? []
        )}
        category={category}
        types={Object.fromEntries(
          types?.productTypes?.map((t: HttpTypes.StoreProductType) => [
            t.value,
            t.value,
          ]) ?? []
        )}
        type={type}
        sortBy={sortBy}
      />
      <React.Suspense fallback={<SkeletonProductGrid />}>
        {region && region.id ? (
          <PaginatedProducts
            sortBy={sortBy}
            page={pageNumber}
            countryCode={countryCode}
            collectionId={collectionIdForPaginated}
            categoryId={categoryIdForPaginated}
            typeId={typeIdForPaginated}
          />
        ) : (
          <div>
            <h1>Region not found</h1>
            <p>(Debug: countryCode={countryCode})</p>
          </div>
        )}
        {!region && (
          <div className="py-16 text-center">
            <p>
              Region data could not be loaded region is falsy. Products cannot
              be displayed.
            </p>
            <p>(Debug: countryCode={countryCode})</p>
          </div>
        )}
      </React.Suspense>
    </div>
  )
}

export default StoreTemplate
