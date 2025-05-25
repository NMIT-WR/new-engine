import type { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import StoreTemplate from '@modules/store/templates'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Store',
  description: 'Explore all of our products.',
}

type Params = {
  searchParams: Promise<{
    // <--- Vracíme Promise
    sortBy?: SortOptions
    collection?: string | string[]
    category?: string | string[]
    type?: string | string[]
    page?: string
  }>
  params: Promise<{
    // <--- Vracíme Promise
    countryCode: string
  }>
}

export default async function StorePage({ searchParams, params }: Params) {
  const { countryCode } = await params // <--- Vracíme await
  const { sortBy, page, collection, category, type } = await searchParams // <--- Vracíme await

  console.log(`[StorePage] Rendering for countryCode: '${countryCode}'`)
  // ... (zbytek tvých logů může zůstat prozatím)
  console.log(`[StorePage] NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(
    `[StorePage] Available MEDUSA_BACKEND_URL (server-side env): ${process.env.MEDUSA_BACKEND_URL}`
  )
  console.log(
    `[StorePage] Available NEXT_PUBLIC_MEDUSA_BACKEND_URL (public env): ${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}`
  )
  const intendedServerBaseUrl =
    process.env.MEDUSA_BACKEND_URL || 'http://medusa-be:9000'
  console.log(
    `[StorePage] Intended SDK Base URL for server operations: ${intendedServerBaseUrl}`
  )
  console.log(
    `[StorePage] Search Params: sortBy=${sortBy}, page=${page}, collection=${JSON.stringify(collection)}, category=${JSON.stringify(category)}, type=${JSON.stringify(type)}`
  )

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      collection={
        collection
          ? Array.isArray(collection)
            ? collection
            : [collection]
          : undefined
      }
      category={
        category ? (Array.isArray(category) ? category : [category]) : undefined
      }
      type={type ? (Array.isArray(type) ? type : [type]) : undefined}
    />
  )
}
