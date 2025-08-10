'use client'
import { ProductGridSkeleton } from '@/components/molecules/product-grid-skeleton'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useProducts } from '@/hooks/use-products'
import { useRegions } from '@/hooks/use-region'
import { useUrlFilters } from '@/hooks/use-url-filters'
import { queryKeys } from '@/lib/query-keys'
import { getProducts } from '@/services/product-service'
import { Breadcrumb } from '@new-engine/ui/molecules/breadcrumb'
import { Select } from '@new-engine/ui/molecules/select'
import { useQueryClient } from '@tanstack/react-query'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import { Select } from '@ui/molecules/select'
import Link from 'next/link'
import { Suspense, useEffect } from 'react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nejnovější' },
  { value: 'name-asc', label: 'Název: A-Z' },
  { value: 'name-desc', label: 'Název: Z-A' },
]

function ProductsContent() {
  const { selectedRegion } = useRegions()
  const pageSize = 12
  const queryClient = useQueryClient()
  // Use URL state for filters, sorting and pagination
  const urlFilters = useUrlFilters()

  // Convert filter state to ProductFilters format
  const productFilters = {
    categories: Array.from(urlFilters.filters.categories) as string[],
    sizes: Array.from(urlFilters.filters.sizes) as string[],
  }

  const {
    products,
    isLoading,
    totalCount,
    currentPage,
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
  })

  // Prefetch strategic pages when we have products
  useEffect(() => {
    if (products.length > 0) {
      const pagesToPrefetch = []

      // Always prefetch first page (if not current)
      if (currentPage !== 1) {
        pagesToPrefetch.push(1)
      }

      // Prefetch previous pages
      if (hasPrevPage) {
        pagesToPrefetch.push(currentPage - 1)
        // Also prefetch page -2 if it exists
        if (currentPage - 2 >= 1) {
          pagesToPrefetch.push(currentPage - 2)
        }
      }

      // Prefetch next pages
      if (hasNextPage) {
        pagesToPrefetch.push(currentPage + 1)
        // Also prefetch page +2 if it exists
        if (currentPage + 2 <= totalPages) {
          pagesToPrefetch.push(currentPage + 2)
        }
      }

      // Prefetch last page (if known and not current)
      if (totalPages > 1 && currentPage !== totalPages) {
        pagesToPrefetch.push(totalPages)
      }

      // Execute all prefetches
      for (const page of pagesToPrefetch) {
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
      }
    }
  }, [
    currentPage,
    hasNextPage,
    hasPrevPage,
    products.length,
    queryClient,
    pageSize,
    urlFilters.sortBy,
    totalPages,
    selectedRegion?.id,
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
        <aside className="sticky top-20 hidden h-fit w-64 flex-shrink-0 lg:block">
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
            <ProductGrid
              products={products}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={urlFilters.setPage}
            />
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
