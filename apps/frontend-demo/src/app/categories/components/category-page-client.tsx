'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useProductListing } from '@/hooks/use-product-listing'
import { useProducts } from '@/hooks/use-products'
import { allCategories } from '@/lib/static-data/categories'
import { findCategoryByHandle } from '@/utils/category-helpers'
import type { SortOption } from '@/utils/product-filters'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import { Select } from '@ui/molecules/select'

interface CategoryPageClientProps {
  categoryHandle: string
}

export default function CategoryPageClient({
  categoryHandle,
}: CategoryPageClientProps) {
  // Find category from static data
  const category = findCategoryByHandle(categoryHandle, allCategories)

  // Get all products and filter by category
  const { products: allProducts, isLoading: productsLoading } = useProducts()

  // Filter products by category id or handle
  const categoryProducts = category
    ? allProducts.filter((product) =>
        product.categories?.some(
          (cat) => cat.id === category.id || cat.handle === category.handle
        )
      )
    : []

  const {
    sortBy,
    setSortBy,
    filters,
    setFilters,
    sortedProducts,
    productCount,
    sortOptions,
  } = useProductListing(categoryProducts)

  // Override filters to exclude category filtering since we're already filtered
  const adjustedFilters = {
    ...filters,
    categories: new Set(),
  }

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-product-listing-bg">
        <div className="mx-auto max-w-product-listing-max-w px-product-listing-container-x py-product-listing-container-y">
          <div>
            <SkeletonLoader variant="text" size="xl" className="mb-8 w-48" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader key={i} variant="box" className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-product-listing-bg">
        <div className="mx-auto max-w-product-listing-max-w px-product-listing-container-x py-product-listing-container-y text-center">
          <h1 className="mb-4 font-bold text-2xl">Category Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested category does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-product-listing-bg">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-product-listing-max-w px-product-listing-container-x pt-product-listing-container-y">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            { label: category.name, href: `/categories/${category.handle}` },
          ]}
        />
      </div>

      {/* Main Content */}
      <div
        className="mx-auto max-w-product-listing-max-w px-product-listing-container-x py-product-listing-container-y lg:px-product-listing-container-x-lg"
        id="products"
      >
        {/* Header */}
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

        {/* Mobile Filters */}
        <ProductFilters
          className="md:hidden"
          filters={adjustedFilters}
          onFiltersChange={setFilters}
          hideCategories // Hide category filter since we're already in a category
        />

        {/* Layout */}
        <div className="gap-product-listing-layout-gap md:flex">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden w-product-listing-sidebar-width flex-shrink-0 md:block">
            <ProductFilters
              filters={adjustedFilters}
              onFiltersChange={setFilters}
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
