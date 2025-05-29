'use client'

import { useState } from 'react'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { Select } from 'ui/src/molecules/select'
import { tv } from 'ui/src/utils'
import { ProductFilters } from '../../components/product-filters'
import { ProductGrid } from '../../components/product-grid'
import { mockProducts } from '../../data/mock-products'

const productListingVariants = tv({
  slots: {
    root: 'min-h-screen bg-product-listing-bg',
    container:
      'mx-auto max-w-product-listing-max-w px-product-listing-container-x py-product-listing-container-y lg:px-product-listing-container-x-lg lg:py-product-listing-container-y-lg',
    header: 'mb-product-listing-header-margin',
    title:
      'text-product-listing-title font-product-listing-title mb-product-listing-title-margin',
    layoutWrapper: 'md:flex gap-product-listing-layout-gap',
    sidebar: 'hidden md:block w-product-listing-sidebar-width flex-shrink-0',
    main: 'flex-1',
    controls:
      'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-product-listing-controls-gap mb-product-listing-controls-margin',
    resultsText: 'text-product-listing-results',
    sortWrapper: 'flex items-center gap-product-listing-sort-gap',
  },
})

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState('newest')
  const styles = productListingVariants()

  // In real app, this would be filtered based on selected filters and sorted
  const filteredProducts = [...mockProducts]

  // Apply sorting
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => {
      const priceA = Number.parseFloat(
        a.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') || '0'
      )
      const priceB = Number.parseFloat(
        b.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') || '0'
      )
      return priceA - priceB
    })
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => {
      const priceA = Number.parseFloat(
        a.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') || '0'
      )
      const priceB = Number.parseFloat(
        b.variants?.[0]?.prices?.[0]?.calculated_price?.replace('€', '') || '0'
      )
      return priceB - priceA
    })
  } else if (sortBy === 'name-asc') {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy === 'name-desc') {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
  }

  return (
    <div className={styles.root()}>
      <div className={styles.container()}>
        {/* Header */}
        <div className={styles.header()}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
            ]}
          />
          <h1 className={styles.title()}>All Products</h1>
        </div>

        {/* Mobile Filters */}
        <ProductFilters className="md:hidden" />

        {/* Layout */}
        <div className={styles.layoutWrapper()}>
          {/* Desktop Sidebar Filters */}
          <aside className={styles.sidebar()}>
            <ProductFilters />
          </aside>

          {/* Main Content */}
          <main className={styles.main()}>
            {/* Controls */}
            <div className={styles.controls()}>
              <p className={styles.resultsText()}>
                Showing {filteredProducts.length} products
              </p>
              <div className={styles.sortWrapper()}>
                <span className="text-product-listing-sort-label text-sm">
                  Sort by:
                </span>
                <Select
                  value={[sortBy]}
                  options={sortOptions}
                  placeholder="Select sorting"
                  onValueChange={(details) =>
                    setSortBy(details.value[0] || 'newest')
                  }
                />
              </div>
            </div>

            {/* Product Grid with Pagination */}
            <ProductGrid products={filteredProducts} pageSize={9} />
          </main>
        </div>
      </div>
    </div>
  )
}
