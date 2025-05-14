"use client"
import { HttpTypes, StoreProduct } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NoResults } from "@modules/store/components/no-results.tsx"
import { withReactQueryProvider } from "@lib/util/react-query"
import * as React from "react"
import { useStoreProducts } from "hooks/store"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const PRODUCT_LIMIT = 12
function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  typeId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string | string[]
  categoryId?: string | string[]
  typeId?: string | string[]
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = Array.isArray(collectionId)
      ? collectionId
      : [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId)
      ? categoryId
      : [categoryId]
  }

  if (typeId) {
    queryParams["type_id"] = Array.isArray(typeId) ? typeId : [typeId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const productsQuery = useStoreProducts({
    page,
    queryParams,
    sortBy,
    countryCode,
  })
  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!loadMoreRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && productsQuery.hasNextPage) {
          productsQuery.fetchNextPage()
        }
      },
      { rootMargin: "100px" }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [productsQuery, loadMoreRef])

  if (productsQuery.isPending) {
    return <SkeletonProductGrid />
  }

  return (
    <>
      <Layout className="gap-y-10 md:gap-y-16 mb-16">
        {productsQuery?.data?.pages[0]?.response?.products?.length &&
        (!productsIds || productsIds.length > 0) ? (
          productsQuery?.data?.pages.flatMap((page) => {
            return page?.response?.products.map((p: StoreProduct) => {
              return (
                <LayoutColumn key={p.id} className="md:!col-span-4 !col-span-6">
                  <ProductPreview product={p} />
                </LayoutColumn>
              )
            })
          })
        ) : (
          <NoResults />
        )}
        {productsQuery.hasNextPage && <div ref={loadMoreRef} />}
      </Layout>
    </>
  )
}

export default withReactQueryProvider(PaginatedProducts)
