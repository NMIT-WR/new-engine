'use client'

import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { mockProducts } from '@/data/mock-products'
import { useProductListing } from '@/hooks/use-product-listing'
import type { SortOption } from '@/utils/product-filters'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { Select } from 'ui/src/molecules/select'

export default function ProductsPage() {
  const {
    sortBy,
    setSortBy,
    filters,
    setFilters,
    sortedProducts,
    productCount,
    sortOptions,
  } = useProductListing(mockProducts)

  return (
    <div className="min-h-screen bg-product-listing-bg">
      <div className="mx-auto max-w-product-listing-max-w px-product-listing-container-x py-product-listing-container-y lg:px-product-listing-container-x-lg lg:py-product-listing-container-y-lg">
        {/* Header */}
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

        {/* Mobile Filters */}
        <ProductFilters
          className="md:hidden"
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Layout */}
        <div className="gap-product-listing-layout-gap md:flex">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-product-listing-sidebar-width flex-shrink-0 md:block">
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls */}
            <div className="mb-product-listing-controls-margin flex flex-col items-start justify-between gap-product-listing-controls-gap sm:flex-row sm:items-center">
              <p className="text-product-listing-results">
                Showing {sortedProducts.length} products
              </p>
              <div className="flex items-center gap-product-listing-sort-gap">
                <span className="text-product-listing-sort-label text-sm">
                  Sort by:
                </span>
                <Select
                  value={[sortBy]}
                  options={sortOptions}
                  placeholder="Select sorting"
                  clearIcon={false}
                  onValueChange={(details) =>
                    setSortBy((details.value[0] as SortOption) || 'newest')
                  }
                />
              </div>
            </div>

            {/* Product Grid with Pagination */}
            <ProductGrid products={sortedProducts} pageSize={9} />
          </main>
        </div>
      </div>
    </div>
  )
}
