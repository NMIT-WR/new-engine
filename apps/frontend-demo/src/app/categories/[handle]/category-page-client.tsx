'use client'

import { Hero } from '@/components/organisms/hero'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import type { CategoryData } from '@/data/categories-content'
import { mockProducts } from '@/data/mock-products'
import { useProductListing } from '@/hooks/use-product-listing'
import type { SortOption } from '@/utils/product-filters'
import { Select } from 'ui/src/molecules/select'

interface CategoryPageClientProps {
  category: CategoryData
}

export default function CategoryPageClient({
  category,
}: CategoryPageClientProps) {
  // Filter products by category
  const categoryProducts = mockProducts.filter((product) =>
    product.categories?.some((cat) => cat.id === category.id)
  )

  const {
    sortBy,
    setSortBy,
    filters,
    setFilters,
    sortedProducts,
    productCount,
    sortOptions,
  } = useProductListing(categoryProducts, {
    initialFilters: {
      categories: new Set([category.id]),
    },
  })

  // Override filters to exclude category filtering since we're already filtered
  const adjustedFilters = {
    ...filters,
    categories: new Set(),
  }

  return (
    <div className="min-h-screen bg-product-listing-bg">
      {/* Breadcrumb */}

      {/* Category Hero */}
      {category.heroImage && (
        <Hero
          title={category.name}
          subtitle={
            category.description ||
            `Explore our collection of ${category.count} products`
          }
          backgroundImage={category.heroImage}
          primaryAction={{
            label: 'Shop Now',
            href: '#products',
          }}
        />
      )}

      {/* Main Content */}
      <div
        className="mx-auto max-w-product-listing-max-w px-product-listing-container-x py-product-listing-container-y lg:px-product-listing-container-x-lg"
        id="products"
      >
        {/* Header (if no hero image) */}
        {!category.heroImage && (
          <div className="mb-product-listing-header-margin">
            <h1 className="mb-product-listing-title-margin font-product-listing-title text-product-listing-title">
              {category.name}
            </h1>
            {category.description && (
              <p className="max-w-3xl text-body-lg text-foreground-muted">
                {category.description}
              </p>
            )}
          </div>
        )}

        {/* Mobile Filters */}
        <ProductFilters
          className="md:hidden"
          filters={adjustedFilters}
          onFiltersChange={(newFilters) =>
            setFilters({ ...newFilters, categories: new Set([category.id]) })
          }
          hideCategories // Hide category filter since we're already in a category
        />

        {/* Layout */}
        <div className="gap-product-listing-layout-gap md:flex">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-product-listing-sidebar-width flex-shrink-0 md:block">
            <ProductFilters
              filters={adjustedFilters}
              onFiltersChange={(newFilters) =>
                setFilters({
                  ...newFilters,
                  categories: new Set([category.id]),
                })
              }
              hideCategories // Hide category filter since we're already in a category
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls */}
            <div className="mb-product-listing-controls-margin flex flex-col items-start justify-between gap-product-listing-controls-gap sm:flex-row sm:items-center">
              <p className="text-product-listing-results">
                Showing {productCount} of {categoryProducts.length} products
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

            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} pageSize={9} />
            ) : (
              <div className="py-16 text-center">
                <p className="text-foreground-muted text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
