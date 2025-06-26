'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useProducts } from '@/hooks/use-products-v2'
import { useUrlFilters } from '@/hooks/use-url-filters'
import { sortProducts } from '@/utils/product-filters'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import { Select } from '@ui/molecules/select'
import { Suspense, useMemo } from 'react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

// Loading skeleton for products
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <SkeletonLoader
            variant="box"
            size="fit"
            className="aspect-square w-full"
          />
          <div className="space-y-2">
            <SkeletonLoader variant="text" size="md" className="w-3/4" />
            <SkeletonLoader variant="text" size="sm" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductsPageContent() {
  const pageSize = 12

  // Use URL state for filters, sorting and pagination
  const urlFilters = useUrlFilters()

  // Convert filter state to ProductFilters format
  const productFilters = useMemo(
    () => ({
      categories: Array.from(urlFilters.filters.categories) as string[],
      priceRange: urlFilters.filters.priceRange as [number, number],
      sizes: Array.from(urlFilters.filters.sizes) as string[],
      colors: Array.from(urlFilters.filters.colors) as string[],
      onSale: urlFilters.filters.onSale,
      search: urlFilters.searchQuery || undefined,
    }),
    [urlFilters.filters, urlFilters.searchQuery]
  )

  // Use the v2 products hook with server-side pagination and filtering
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
  })

  // Apply client-side sorting for display
  const sortedProducts = useMemo(() => {
    const sortBy =
      urlFilters.sortBy === 'relevance'
        ? 'newest'
        : urlFilters.sortBy || 'newest'
    return sortProducts(products, sortBy as any)
  }, [products, urlFilters.sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-product-listing-header-margin">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
          ]}
        />
        <h1 className="mb-product-listing-title-margin font-product-listing-title text-product-listing-title">
          All Products
        </h1>
      </div>

      {/* Mobile Filter Button - Sticky */}
      <div className="sticky top-16 z-40 mb-4 lg:hidden">
        <ProductFilters
          filters={urlFilters.filters}
          onFiltersChange={urlFilters.setFilters}
          products={products}
          className="bg-white dark:bg-gray-900 py-2"
        />
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <ProductFilters
            filters={urlFilters.filters}
            onFiltersChange={urlFilters.setFilters}
            products={products}
          />
        </aside>

        {/* Products Grid */}
        <main className="flex-1 w-full">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Showing {products.length} of {totalCount} products
            </p>
            <Select
              value={[urlFilters.sortBy || 'newest']}
              options={SORT_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              clearIcon={false}
              placeholder="Select sorting"
              onValueChange={(details) => {
                const value = details.value[0]
                if (value) urlFilters.setSortBy(value as any)
              }}
              size="md"
            />
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : sortedProducts.length > 0 ? (
            <ProductGrid
              products={sortedProducts}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={urlFilters.setPage}
            />
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function ProductsPageClient() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  )
}
