'use client'

import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useProductListing } from '@/hooks/use-product-listing'
import { useProducts } from '@/hooks/use-products'
import { useState } from 'react'
import { Badge } from 'ui/src/atoms/badge'
import { ErrorText } from 'ui/src/atoms/error-text'
import { Select } from 'ui/src/molecules/select'

// Loading skeleton for products
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ApiTestPage() {
  const { products, isLoading, error } = useProducts()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const {
    sortBy,
    setSortBy,
    filters,
    setFilters,
    sortedProducts,
    sortOptions,
  } = useProductListing(products)

  // Calculate paginated products
  const totalPages = Math.ceil(sortedProducts.length / pageSize)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 font-bold text-3xl">API Integration Test</h1>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="info">Backend: localhost:9000</Badge>
          <Badge variant={isLoading ? 'warning' : error ? 'danger' : 'success'}>
            {isLoading ? 'Loading...' : error ? 'Error' : 'Connected'}
          </Badge>
          <Badge variant="primary">{`Products: ${products.length}`}</Badge>
        </div>
        {error && (
          <ErrorText showIcon className="mb-4">
            {error}
          </ErrorText>
        )}
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Showing {paginatedProducts.length} of {sortedProducts.length}{' '}
              products
            </p>
            <Select
              value={[sortBy]}
              options={sortOptions.map((opt) => ({
                value: opt.value.toString(),
                label: opt.label,
              }))}
              clearIcon={false}
              placeholder="Select sorting"
              onValueChange={(details) => {
                const value = details.value[0] as any
                if (value) setSortBy(value)
              }}
              size="md"
            />
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : paginatedProducts.length > 0 ? (
            <ProductGrid products={paginatedProducts} />
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
