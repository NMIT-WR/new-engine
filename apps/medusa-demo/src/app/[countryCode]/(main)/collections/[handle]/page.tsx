import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  getCollectionByHandle,
  getCollectionsList,
} from '@lib/data/collections'
import { listRegions } from '@lib/data/regions'
import { collectionMetadataCustomFieldsSchema } from '@lib/util/collections'
import type { StoreCollection, StoreRegion } from '@medusajs/types'
import CollectionTemplate from '@modules/collections/templates'
import type { SortOptions } from '@modules/store/components/refinement-list/sort-products'

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    category?: string | string[]
    type?: string | string[]
    page?: string
    sortBy?: SortOptions
  }>
}

export async function generateStaticParams() {
  const { collections } = await getCollectionsList()

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.flatMap((r) => r.countries?.map((c) => c.iso_2))
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes?.flatMap((countryCode: string) =>
    collectionHandles.map((handle: string | undefined) => ({
      countryCode,
      handle,
    }))
  )

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params

  const collection = await getCollectionByHandle(handle, [
    'id',
    'title',
    'metadata',
  ])

  if (!collection) {
    notFound()
  }

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    collection.metadata ?? {}
  )

  const metadata = {
    title: `${collection.title} | Medusa Store`,
    description:
      collectionDetails.success && collectionDetails.data.description
        ? collectionDetails.data.description
        : `${collection.title} collection`,
  } as Metadata

  return metadata
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle, countryCode } = await params
  const { sortBy, page, category, type } = await searchParams

  const collection = await getCollectionByHandle(handle, [
    'id',
    'title',
    'metadata',
  ])

  if (!collection) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={countryCode}
      category={
        category ? (Array.isArray(category) ? category : [category]) : undefined
      }
      type={type ? (Array.isArray(type) ? type : [type]) : undefined}
    />
  )
}
