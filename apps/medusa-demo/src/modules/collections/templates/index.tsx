import type { HttpTypes } from '@medusajs/types'
import Image from 'next/image'
import React from 'react'

import { Layout, LayoutColumn } from '@/components/Layout'
import { getCategoriesList } from '@lib/data/categories'
import { getProductTypesList } from '@lib/data/product-types'
import { getRegion } from '@lib/data/regions'
import { collectionMetadataCustomFieldsSchema } from '@lib/util/collections'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import RefinementList from '@modules/store/components/refinement-list'
import type { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from '@modules/store/templates/paginated-products'

export default async function CollectionTemplate({
  sortBy,
  collection,
  category,
  type,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  category?: string[]
  type?: string[]
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? Number.parseInt(page) : 1

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    collection.metadata ?? {}
  )

  const [categories, types, region] = await Promise.all([
    getCategoriesList(0, 100, ['id', 'name', 'handle']),
    getProductTypesList(0, 100, ['id', 'value']),
    getRegion(countryCode),
  ])

  return (
    <>
      <div className="relative mb-8 aspect-[2/1] w-full max-w-full max-md:mt-18 md:mb-19 md:h-screen">
        <Image
          src={
            collectionDetails.data?.collection_page_image?.url ||
            '/images/content/living-room-gray-two-seater-puffy-sofa.png'
          }
          fill
          alt={collection.title + ' image'}
          className="z-0 object-cover"
        />
      </div>
      {collectionDetails.success &&
        ((typeof collectionDetails.data.collection_page_heading === 'string' &&
          collectionDetails.data.collection_page_heading.length > 0) ||
          (typeof collectionDetails.data.collection_page_content === 'string' &&
            collectionDetails.data.collection_page_content.length > 0)) && (
          <Layout className="mb-26 md:mb-36">
            {collectionDetails.data.collection_page_heading && (
              <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
                <h3 className="text-md max-md:mb-6 md:text-2xl">
                  {collectionDetails.data.collection_page_heading}
                </h3>
              </LayoutColumn>
            )}
            {collectionDetails.data.collection_page_content && (
              <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
                <div className="flex flex-col gap-5 md:mt-18 md:gap-9 md:text-md">
                  {collectionDetails.data.collection_page_content
                    .split('\n')
                    .map((p) => p.trim())
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>
              </LayoutColumn>
            )}
          </Layout>
        )}
      <RefinementList
        sortBy={sortBy}
        title={collection.title}
        categories={Object.fromEntries(
          categories.product_categories.map((c) => [c.handle, c.name])
        )}
        category={category}
        types={Object.fromEntries(
          types.productTypes.map((t) => [t.value, t.value])
        )}
        type={type}
      />
      <React.Suspense fallback={<SkeletonProductGrid />}>
        {region && (
          <PaginatedProducts
            sortBy={sortBy}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            categoryId={
              category
                ? categories.product_categories
                    .filter((c) => category.includes(c.handle))
                    .map((c) => c.id)
                : undefined
            }
            typeId={
              type
                ? types.productTypes
                    .filter((t) => type.includes(t.value))
                    .map((t) => t.id)
                : undefined
            }
          />
        )}
      </React.Suspense>
      <div className="pb-10 md:pb-20" />
    </>
  )
}
