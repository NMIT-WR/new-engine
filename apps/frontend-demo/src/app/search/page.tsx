'use client'

import { useMemo, useState } from 'react'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { Combobox, type ComboboxItem } from 'ui/src/molecules/combobox'
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
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption | 'relevance'>('relevance')
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    categories: new Set(),
    sizes: new Set(),
    colors: new Set(),
  })


  // Create combobox items from products
  const searchItems: ComboboxItem[] = useMemo(() => {
    return mockProducts.map((product) => ({
      value: product.handle,
      label: product.title,
      data: product,
    }))
  }, [])

  // Filter products based on search query
  const searchFilteredProducts = useMemo(() => {
    if (!searchQuery) return []

    return mockProducts.filter((product) => {
      const query = searchQuery.toLowerCase()
      return (
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.handle.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  // Apply filters and sorting
  const filteredProducts = filterProducts(searchFilteredProducts, filters)
  const sortedProducts = sortProducts(
    filteredProducts,
    sortBy === 'relevance' ? 'newest' : sortBy
  )

  const hasSearched = searchQuery.length > 0

  return (
    <div className='min-h-screen bg-search-bg'>
      <div className='mx-auto max-w-search-max-w px-search-container-x py-search-container-y lg:px-search-container-x-lg lg:py-search-container-y-lg'>
        {/* Breadcrumb */}
        <div className='mb-search-breadcrumb-margin'>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Search', href: '/search' },
            ]}
          />
        </div>

        {/* Hero Section */}
        <div className='text-center mb-search-hero-margin'>
          <h1 className='text-search-title font-search-title mb-search-title-margin'>Search Products</h1>
          <p className='text-search-subtitle mb-search-subtitle-margin'>
            Find exactly what you're looking for in our collection
          </p>

          {/* Search Input */}
          <div className='max-w-search-input-max-w mx-auto mb-search-input-margin'>
            <Combobox
              placeholder="Search for products..."
              items={searchItems}
              allowCustomValue
              closeOnSelect={false}
              selectionBehavior="replace"
              clearable
              size="lg"
              onChange={(value) => {
                // When item is selected from dropdown
                const selectedValue = Array.isArray(value) ? value[0] : value
                if (selectedValue) {
                  // Find the product by handle and use its title
                  const selectedProduct = mockProducts.find(
                    (p) => p.handle === selectedValue
                  )
                  setSearchQuery(
                    selectedProduct ? selectedProduct.title : selectedValue
                  )
                }
              }}
              onInputValueChange={(value) => {
                // When user types in the input - this is crucial for typing to work
                setSearchQuery(value)
              }}
            />
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className='md:flex gap-search-layout-gap'>
            <aside className='hidden md:block w-search-sidebar-width flex-shrink-0'>
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            <main className='flex-1'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-search-controls-gap mb-search-controls-margin'>
                <p className='text-search-results'>
                  {sortedProducts.length === 0
                    ? 'No products found'
                    : `${sortedProducts.length} ${
                        sortedProducts.length === 1 ? 'product' : 'products'
                      } found`}
                </p>
                {sortedProducts.length > 0 && (
                  <div className='flex items-center gap-search-sort-gap'>
                    <Select
                      options={sortOptions}
                      value={[sortBy]}
                      clearIcon={false}
                      onValueChange={({ value }) => {
                        const selectedValue = Array.isArray(value)
                          ? value[0]
                          : value
                        if (selectedValue) {
                          setSortBy(selectedValue as typeof sortBy)
                        }
                      }}
                      placeholder="Sort by"
                    />
                  </div>
                )}
              </div>

              {sortedProducts.length > 0 ? (
                <ProductGrid products={sortedProducts} />
              ) : (
                <div className='text-center py-search-empty-y'>
                  <h2 className='text-search-empty-title font-search-empty-title mb-search-empty-title-margin'>No results found</h2>
                  <p className='text-search-empty-text'>
                    Try adjusting your search or filters to find what you're
                    looking for
                  </p>
                </div>
              )}
            </main>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className='text-center py-search-empty-y'>
            <p className='text-search-empty-text'>
              Start typing to search through our products
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
