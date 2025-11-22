'use client'
import { ProductGridSkeleton } from '@/components/molecules/product-grid-skeleton'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useInfiniteProducts } from '@/hooks/use-infinite-products'
import { usePrefetchPages } from '@/hooks/use-prefetch-pages'
import { useProducts } from '@/hooks/use-products'
import { useRegions } from '@/hooks/use-region'
import { useUrlFilters } from '@/hooks/use-url-filters'
import { Button } from '@new-engine/ui/atoms/button'
import { Breadcrumb } from '@new-engine/ui/molecules/breadcrumb'
import { Select } from '@new-engine/ui/molecules/select'
import Link from 'next/link'
import { Suspense, useEffect, useRef } from 'react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nejnovější' },
  { value: 'name-asc', label: 'Název: A-Z' },
  { value: 'name-desc', label: 'Název: Z-A' },
]

function ProductsContent() {
  const { selectedRegion } = useRegions()
  const pageSize = 12
  const previousPageRef = useRef(1)

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

  // Use prefetch hook for page prefetching
  usePrefetchPages({
    currentPage,
    hasNextPage: effectiveHasNextPage,
    hasPrevPage: effectiveHasPrevPage,
    productsLength: products.length,
    pageSize,
    sortBy: urlFilters.sortBy,
    totalPages: effectiveTotalPages,
    regionId: selectedRegion?.id,
    searchQuery: urlFilters.searchQuery,
    filters: productFilters,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-product-listing-header-margin">
        <Breadcrumb
          items={[
            { label: 'Domů', href: '/' },
            { label: 'Produkty', href: '/products' },
          ]}
          linkAs={Link}
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
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 flex-shrink-0 overflow-y-auto lg:block">
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
              {
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={async () => {
                      // First fetch the next page data
                      await fetchNextPage()
                      // Then update URL without navigation
                      urlFilters.extendPageRange()
                    }}
                    disabled={!infiniteHasNextPage || isFetchingNextPage}
                    variant="primary"
                    size="sm"
                  >
                    {isFetchingNextPage
                      ? `Načítání dalších ${pageSize}...`
                      : `Načíst dalších ${pageSize} produktů`}
                  </Button>
                </div>
              }
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">Žádné produkty nenalezeny</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton numberOfItems={12} />}>
      <ProductsContent />
    </Suspense>
  )
}
