import { Layout, LayoutColumn } from '@/components/Layout'
import { getRegion } from '@lib/data/regions'
import { type MeiliSearchProductHit, searchClient } from '@lib/search-client'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import { CollectionsSlider } from '@modules/store/components/collections-slider'
import PaginatedProducts from '@modules/store/templates/paginated-products'
import type { Metadata } from 'next'
import React from 'react'

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ query: string; page: string }>
}

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for products',
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { query, page } = await searchParams

  const pageNumber = page ? Number.parseInt(page, 10) : 1

  const results = await searchClient
    .index('products')
    .search<MeiliSearchProductHit>(query)
  const region = await getRegion(countryCode)

  return (
    <div className="py-26 md:pt-47 md:pb-36">
      <Layout>
        <LayoutColumn>
          <h2 className="mb-8 text-lg md:mb-16 md:text-2xl">
            Search results for &apos;{query}&apos;
          </h2>
        </LayoutColumn>
      </Layout>
      <React.Suspense fallback={<SkeletonProductGrid />}>
        {region && (
          <PaginatedProducts
            sortBy="created_at"
            page={pageNumber}
            countryCode={countryCode}
            collectionId={undefined}
            categoryId={undefined}
            productsIds={results.hits.map((h) => h.id)}
            typeId={undefined}
          />
        )}
      </React.Suspense>
      <CollectionsSlider
        heading="Checkout our collections for more products"
        className="!mb-0 mt-26 md:mt-36"
      />
    </div>
  )
}
