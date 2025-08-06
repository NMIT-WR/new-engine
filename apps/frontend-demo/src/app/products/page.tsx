'use client'
import { ProductGridSkeleton } from '@/components/molecules/product-grid-skeleton'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useInfiniteProducts } from '@/hooks/use-infinite-products'
import { useProducts } from '@/hooks/use-products'
import { useRegions } from '@/hooks/use-region'
import { useUrlFilters } from '@/hooks/use-url-filters'
import { queryKeys } from '@/lib/query-keys'
import { getProducts } from '@/services/product-service'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@ui/atoms/button'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import { Select } from '@ui/molecules/select'
import Link from 'next/link'
import { Suspense, useEffect, useRef } from 'react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nejnovější' },
  { value: 'name-asc', label: 'Název: A-Z' },
  { value: 'name-desc', label: 'Název: Z-A' },
]

function ProductsPageContent() {
  const { selectedRegion } = useRegions()
  const pageSize = 12
  const queryClient = useQueryClient()
  const previousPageRef = useRef(1)

  const cache = queryClient
    .getQueryCache()
    .getAll()
    .map((q) => {
      return {
        queryKey: q.queryKey,
        params: q.queryKey[3],
        status: q.state.status,
        // @ts-ignore
        count: q.state.data?.count || 0,
        // @ts-ignore
        productsLength: q.state.data?.products?.length || 0,
        // @ts-ignore
        categories: q.queryKey[3]?.filters?.categories || [],
      }
    })

  // Use URL state for filters, sorting and pagination
  const urlFilters = useUrlFilters()

  // Convert filter state to ProductFilters format
  const productFilters = {
    categories: Array.from(urlFilters.filters.categories) as string[],
    sizes: Array.from(urlFilters.filters.sizes) as string[],
  }

  // Use infinite products for load more functionality
  const {
    products: infiniteProducts,
    isLoading: infiniteLoading,
    totalCount: infiniteTotalCount,
    hasNextPage: infiniteHasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch: refetchInfinite,
  } = useInfiniteProducts({
    pageRange: urlFilters.pageRange,
    limit: pageSize,
    filters: productFilters,
    sort: urlFilters.sortBy === 'relevance' ? undefined : urlFilters.sortBy,
    q: urlFilters.searchQuery || undefined,
    region_id: selectedRegion?.id,
  })

  // Fallback to regular products hook for pagination compatibility
  // Only enable when NOT in range mode to avoid duplicate queries
  const {
    products: regularProducts,
    isLoading: regularLoading,
    totalCount: regularTotalCount,
    currentPage: regularCurrentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useProducts({
    page: urlFilters.page,
    limit: pageSize,
    filters: productFilters,
    sort: urlFilters.sortBy === 'relevance' ? undefined : urlFilters.sortBy,
    q: urlFilters.searchQuery || undefined,
    region_id: selectedRegion?.id,
    enabled: !urlFilters.pageRange.isRange, // Disable when in range mode
  })

  // Detect page range change and reset infinite query when switching between single/range modes
  useEffect(() => {
    const currentPageStart = urlFilters.pageRange.start
    if (currentPageStart !== previousPageRef.current) {
      refetchInfinite()
      previousPageRef.current = currentPageStart
    }
  }, [urlFilters.pageRange.start, refetchInfinite])

  // Use infinite products if we have a range or loaded additional pages
  const shouldUseInfiniteData =
    urlFilters.pageRange.isRange ||
    (urlFilters.pageRange.start === 1 && infiniteProducts.length > pageSize)
  const products = shouldUseInfiniteData ? infiniteProducts : regularProducts
  const isLoading = shouldUseInfiniteData ? infiniteLoading : regularLoading
  const totalCount = shouldUseInfiniteData
    ? infiniteTotalCount
    : regularTotalCount

  // Fix: Use the end of the range for current page when using infinite data
  const currentPage = shouldUseInfiniteData
    ? urlFilters.pageRange.end
    : regularCurrentPage

  // Calculate pagination values based on active data source
  const calculatedTotalPages = Math.ceil(totalCount / pageSize)
  const effectiveTotalPages = shouldUseInfiniteData
    ? calculatedTotalPages
    : totalPages
  const effectiveHasNextPage = shouldUseInfiniteData
    ? infiniteHasNextPage
    : hasNextPage
  const effectiveHasPrevPage = shouldUseInfiniteData
    ? urlFilters.pageRange.start > 1
    : hasPrevPage

  // Prefetch strategic pages when we have products
  useEffect(() => {
    if (products.length > 0) {
      const pagesToPrefetch = []

      // Always prefetch first page (if not current)
      if (currentPage !== 1) {
        pagesToPrefetch.push(1)
      }

      // Prefetch previous pages
      if (effectiveHasPrevPage) {
        pagesToPrefetch.push(currentPage - 1)
        // Also prefetch page -2 if it exists
        if (currentPage - 2 >= 1) {
          pagesToPrefetch.push(currentPage - 2)
        }
      }

      // Prefetch next pages
      if (effectiveHasNextPage) {
        pagesToPrefetch.push(currentPage + 1)
        // Also prefetch page +2 if it exists
        if (currentPage + 2 <= effectiveTotalPages) {
          pagesToPrefetch.push(currentPage + 2)
        }
      }

      // Prefetch last page (if known and not current)
      if (effectiveTotalPages > 1 && currentPage !== effectiveTotalPages) {
        pagesToPrefetch.push(effectiveTotalPages)
      }

      // Execute all prefetches
      pagesToPrefetch.forEach((page) => {
        const offset = (page - 1) * pageSize
        queryClient.prefetchQuery({
          queryKey: queryKeys.products.list({
            page,
            limit: pageSize,
            filters: productFilters,
            sort:
              urlFilters.sortBy === 'relevance' ? undefined : urlFilters.sortBy,
            q: urlFilters.searchQuery || undefined,
            region_id: selectedRegion?.id,
          }),
          queryFn: () =>
            getProducts({
              limit: pageSize,
              offset,
              filters: productFilters,
              sort:
                urlFilters.sortBy === 'relevance'
                  ? undefined
                  : urlFilters.sortBy,
              q: urlFilters.searchQuery || undefined,
              region_id: selectedRegion?.id,
            }),
        })
      })
    }
  }, [
    currentPage,
    effectiveHasNextPage,
    effectiveHasPrevPage,
    products.length,
    queryClient,
    pageSize,
    urlFilters.sortBy,
    effectiveTotalPages,
    selectedRegion?.id,
    urlFilters.searchQuery,
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-product-listing-header-margin">
        <Breadcrumb
          items={[
            { label: 'Domů', href: '/' },
            { label: 'Produkty', href: '/products' },
          ]}
          linkComponent={Link}
        />
        <h1 className="mb-product-listing-title-margin font-product-listing-title text-product-listing-title">
          Všechny produkty
        </h1>
      </div>

      {/* Mobile Filter Button - Sticky */}
      <div className="sticky top-16 z-40 mb-4 sm:static lg:hidden">
        <ProductFilters
          filters={urlFilters.filters}
          onFiltersChange={urlFilters.setFilters}
        />
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <ProductFilters
            filters={urlFilters.filters}
            onFiltersChange={urlFilters.setFilters}
          />
        </aside>

        {/* Products Grid */}
        <main className="w-full flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Zobrazeno {products.length} z {totalCount} produktů
            </p>
            <Select
              value={[urlFilters.sortBy || 'newest']}
              options={SORT_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              clearIcon={false}
              placeholder="Vybrat řazení"
              onValueChange={(details) => {
                const value = details.value[0]
                if (value) urlFilters.setSortBy(value as any)
              }}
              size="sm"
              className="max-w-64"
            />
          </div>

          {isLoading ? (
            <ProductGridSkeleton numberOfItems={12} />
          ) : products.length > 0 ? (
            <div>
              <ProductGrid
                products={products}
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={urlFilters.setPage}
              />

              {/* Load More Button */}
              {infiniteHasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={async () => {
                      // First fetch the next page data
                      await fetchNextPage()
                      // Then update URL without navigation
                      urlFilters.extendPageRange()
                    }}
                    disabled={isFetchingNextPage}
                    variant="primary"
                    size="sm"
                  >
                    {isFetchingNextPage
                      ? `Načítání dalších ${pageSize}...`
                      : `Načíst dalších ${pageSize} produktů`}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">Žádné produkty nenalezeny</p>
            </div>
          )}
        </main>
      </div>
      <Button onClick={() => console.log(products)}>Check</Button>
    </div>
  )
}

export default function ProductsPageClient() {
  return (
    <Suspense fallback={<ProductGridSkeleton numberOfItems={12} />}>
      <ProductsPageContent />
    </Suspense>
  )
}
