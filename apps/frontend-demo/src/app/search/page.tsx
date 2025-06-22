'use client'

import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { mockProducts } from '@/data/mock-products'
import { useDebounce } from '@/hooks/use-debounce'
import {
  SEARCH_SORT_OPTIONS,
  useProductListing,
} from '@/hooks/use-product-listing'
import { useMemo, useState } from 'react'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import { Combobox, type ComboboxItem } from '@ui/molecules/combobox'
import { Select } from '@ui/molecules/select'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Create combobox items from products
  const searchItems: ComboboxItem[] = useMemo(() => {
    return mockProducts.map((product) => ({
      value: product.handle,
      label: product.title,
      data: product,
    }))
  }, [])

  // Filter products based on debounced search query
  const searchFilteredProducts = useMemo(() => {
    if (!debouncedSearchQuery) return []

    return mockProducts.filter((product) => {
      const query = debouncedSearchQuery.toLowerCase()
      return (
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.handle.toLowerCase().includes(query)
      )
    })
  }, [debouncedSearchQuery])

  const {
    sortBy,
    setSortBy,
    filters,
    setFilters,
    sortedProducts,
    productCount,
  } = useProductListing(searchFilteredProducts, {
    initialSortBy: 'relevance',
    sortOptions: SEARCH_SORT_OPTIONS,
  })

  const hasSearched = searchQuery.length > 0
  const hasResults = debouncedSearchQuery.length > 0

  return (
    <div className="min-h-screen bg-search-bg">
      <div className="mx-auto max-w-search-max-w px-search-container-x py-search-container-y lg:px-search-container-x-lg lg:py-search-container-y-lg">
        {/* Breadcrumb */}
        <div className="mb-search-breadcrumb-margin">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Search', href: '/search' },
            ]}
          />
        </div>

        {/* Hero Section */}
        <div className="mb-search-hero-margin text-center">
          <h1 className="mb-search-title-margin font-search-title text-search-title">
            Search Products
          </h1>
          <p className="mb-search-subtitle-margin text-search-subtitle">
            Find exactly what you're looking for in our collection
          </p>

          {/* Search Input */}
          <div className="mx-auto mb-search-input-margin max-w-search-input-max-w">
            <Combobox
              placeholder="Search for products..."
              items={searchItems}
              allowCustomValue
              closeOnSelect={false}
              selectionBehavior="replace"
              clearable
              size="lg"
              value={searchQuery ? [searchQuery] : []}
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
        {hasResults && (
          <div className="gap-search-layout-gap md:flex">
            <aside className="hidden w-search-sidebar-width flex-shrink-0 md:block">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </aside>

            <main className="flex-1">
              <div className="mb-search-controls-margin flex flex-col items-start justify-between gap-search-controls-gap sm:flex-row sm:items-center">
                <p className="text-search-results">
                  {sortedProducts.length === 0
                    ? 'No products found'
                    : `${sortedProducts.length} ${
                        sortedProducts.length === 1 ? 'product' : 'products'
                      } found`}
                </p>
                {sortedProducts.length > 0 && (
                  <div className="flex items-center gap-search-sort-gap">
                    <Select
                      options={SEARCH_SORT_OPTIONS}
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
                <div className="py-search-empty-y text-center">
                  <h2 className="mb-search-empty-title-margin font-search-empty-title text-search-empty-title">
                    No results found
                  </h2>
                  <p className="text-search-empty-text">
                    Try adjusting your search or filters to find what you're
                    looking for
                  </p>
                </div>
              )}
            </main>
          </div>
        )}

        {/* Initial State and Loading */}
        {!hasSearched && (
          <div className="py-search-empty-y text-center">
            <p className="text-search-empty-text">
              Start typing to search through our products
            </p>
          </div>
        )}
        
        {/* Show loading state when user is typing but results haven't updated yet */}
        {hasSearched && !hasResults && (
          <div className="py-search-empty-y text-center">
            <p className="text-search-empty-text">Searching...</p>
          </div>
        )}
      </div>
    </div>
  )
}
