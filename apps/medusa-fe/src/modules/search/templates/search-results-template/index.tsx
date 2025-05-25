import { Heading, Text } from '@medusajs/ui'

import LocalizedClientLink from '@modules/common/components/localized-client-link'
import RefinementList from '@modules/store/components/refinement-list'
import type { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from '@modules/store/templates/paginated-products'

type SearchResultsTemplateProps = {
  query: string
  ids: string[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

const SearchResultsTemplate = ({
  query,
  ids,
  sortBy,
  page,
  countryCode,
}: SearchResultsTemplateProps) => {
  const pageNumber = page ? Number.parseInt(page) : 1

  return (
    <>
      <div className="flex w-full items-center justify-between border-b px-8 py-6 small:px-14">
        <div className="flex flex-col items-start">
          <Text className="text-ui-fg-muted">Search Results for:</Text>
          <Heading>
            {decodeURI(query)} ({ids.length})
          </Heading>
        </div>
        <LocalizedClientLink
          href="/store"
          className="txt-medium text-ui-fg-subtle hover:text-ui-fg-base"
        >
          Clear
        </LocalizedClientLink>
      </div>
      <div className="flex flex-col p-6 small:flex-row small:items-start">
        {ids.length > 0 ? (
          <>
            <RefinementList sortBy={sortBy || 'created_at'} search />
            <div className="content-container">
              <PaginatedProducts
                productsIds={ids}
                sortBy={sortBy}
                page={pageNumber}
                countryCode={countryCode}
              />
            </div>
          </>
        ) : (
          <Text className="mt-3 ml-8 small:ml-14">No results.</Text>
        )}
      </div>
    </>
  )
}

export default SearchResultsTemplate
