'use client'

import { useState } from 'react'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { Select } from 'ui/src/molecules/select'
import { ProductFilters } from '../../components/product-filters'
import { ProductGrid } from '../../components/product-grid'
import { mockProducts } from '../../data/mock-products'
import {
  type FilterState,
  type SortOption,
  filterProducts,
  sortProducts,
} from '../../utils/product-filters'


const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    categories: new Set(),
    sizes: new Set(),
    colors: new Set(),
  })

  // Apply filters and sorting using utility functions
  const filteredProducts = filterProducts(mockProducts, filters)
  const sortedProducts = sortProducts(filteredProducts, sortBy)

  return (
    <div className='min-h-screen bg-product-listing-bg'>
      <div className='mx-auto max-w-product-listing-max-w px-product-listing-container-x py-product-listing-container-y lg:px-product-listing-container-x-lg lg:py-product-listing-container-y-lg'>
        {/* Header */}
        <div className='mb-product-listing-header-margin'>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
            ]}
          />
          <h1 className='text-product-listing-title font-product-listing-title mb-product-listing-title-margin'>All Products</h1>
        </div>

        {/* Mobile Filters */}
        <ProductFilters
          className="md:hidden"
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Layout */}
        <div className='md:flex gap-product-listing-layout-gap'>
          {/* Desktop Sidebar Filters */}
          <aside className='hidden md:block w-product-listing-sidebar-width flex-shrink-0'>
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Main Content */}
          <main className='flex-1'>
            {/* Controls */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-product-listing-controls-gap mb-product-listing-controls-margin'>
              <p className='text-product-listing-results'>
                Showing {sortedProducts.length} products
              </p>
              <div className='flex items-center gap-product-listing-sort-gap'>
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
