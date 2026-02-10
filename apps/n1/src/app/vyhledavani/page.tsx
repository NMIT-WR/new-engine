"use client"

import { Breadcrumb } from "@techsio/ui-kit/molecules/breadcrumb"
import NextLink from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Banner } from "@/components/atoms/banner"
import { Heading } from "@/components/heading"
import { ProductGrid } from "@/components/molecules/product-grid"
import { N1Aside } from "@/components/n1-aside"
import { categoryMap, categoryTree } from "@/data/static/categories"
import { useProducts } from "@/hooks/use-products"
import { PRODUCT_LIMIT } from "@/lib/constants"
import { transformProduct } from "@/utils/transform/transform-product"

const SEARCH_ROUTE = "/vyhledavani"

function parsePage(value: string | null): number {
  if (!value) {
    return 1
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get("q")?.trim() ?? ""
  const currentPage = parsePage(searchParams.get("page"))

  const {
    products: rawProducts,
    totalCount,
    isLoading,
    isFetching,
    error,
  } = useProducts({
    q: query,
    page: currentPage,
    limit: PRODUCT_LIMIT,
    skipIfEmptyQuery: true,
  })

  const products = rawProducts.map(transformProduct)
  const isInitialSearchLoading =
    query.length > 0 &&
    !error &&
    (isLoading || (isFetching && rawProducts.length === 0 && totalCount === 0))

  const handlePageChange = (page: number) => {
    if (!query) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`${SEARCH_ROUTE}?${params.toString()}`, { scroll: true })
  }

  return (
    <div className="relative grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] p-400">
      <header className="col-span-2 row-span-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Vyhledávání", href: SEARCH_ROUTE },
          ]}
          linkAs={NextLink}
          size="lg"
        />
      </header>

      <N1Aside categoryMap={categoryMap} categories={categoryTree} label="Kategorie" />

      <main className="px-300">
        <header className="space-y-300">
          <Heading as="h1">Výsledky vyhledávání</Heading>
          {query ? (
            <p className="text-fg-secondary text-sm">
              Dotaz: <span className="font-semibold">{query}</span>
            </p>
          ) : (
            <p className="text-fg-secondary text-sm">
              Zadej vyhledávací dotaz v headeru.
            </p>
          )}
        </header>

        {query ? (
          <Banner className="my-300" variant="warning">
            <div className="flex items-center gap-100">
              {isInitialSearchLoading ? (
                <span>Vyhledávám produkty...</span>
              ) : (
                <>
                  <span>Nalezeno</span>
                  <span className="font-bold">{totalCount}</span>
                  <span>produktů</span>
                  {isFetching ? (
                    <span className="text-fg-secondary text-xs">
                      (aktualizuji...)
                    </span>
                  ) : null}
                </>
              )}
            </div>
          </Banner>
        ) : null}

        {error ? (
          <div
            className="my-300 rounded-lg border border-danger bg-danger/10 p-300 text-sm"
            role="alert"
          >
            Nepodařilo se načíst výsledky: {error}
          </div>
        ) : null}

        <section>
          {query && !error ? (
            <ProductGrid
              currentPage={currentPage}
              isLoading={isInitialSearchLoading}
              onPageChange={handlePageChange}
              pageSize={PRODUCT_LIMIT}
              products={products}
              skeletonCount={24}
              totalCount={totalCount}
            />
          ) : null}
        </section>
      </main>
    </div>
  )
}
