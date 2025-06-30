'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { ProductFilters } from '@/components/organisms/product-filters'
import { ProductGrid } from '@/components/organisms/product-grid'
import { useProducts } from '@/hooks/use-products'
import { useUrlFilters } from '@/hooks/use-url-filters'
import { Breadcrumb } from '@ui/molecules/breadcrumb'
import { Select } from '@ui/molecules/select'
import React,{ Suspense, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { ProductService } from '@/services/product-service'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nejnovější' },
  { value: 'price-asc', label: 'Cena: od nejnižší' },
  { value: 'price-desc', label: 'Cena: od nejvyšší' },
  { value: 'name-asc', label: 'Název: A-Z' },
  { value: 'name-desc', label: 'Název: Z-A' },
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
  const queryClient = useQueryClient()

  // Use URL state for filters, sorting and pagination
  const urlFilters = useUrlFilters()

  // Convert filter state to ProductFilters format
  const productFilters = {
    categories: Array.from(urlFilters.filters.categories) as string[],
    priceRange: urlFilters.filters.priceRange as [number, number],
    sizes: Array.from(urlFilters.filters.sizes) as string[],
    colors: Array.from(urlFilters.filters.colors) as string[],
    onSale: urlFilters.filters.onSale,
    search: urlFilters.searchQuery || undefined,
  }

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

  // Products are already sorted by the backend
  const sortedProducts = products

  // Prefetch next page when we have products
  useEffect(() => {
    if (hasNextPage && products.length > 0) {
      const nextPage = currentPage + 1
      const offset = (nextPage - 1) * pageSize
      
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.list({ 
          page: nextPage, 
          limit: pageSize, 
          filters: productFilters, 
          sort: urlFilters.sortBy 
        }),
        queryFn: () => ProductService.getProducts({ 
          limit: pageSize, 
          offset, 
          filters: productFilters, 
          sort: urlFilters.sortBy 
        }),
      })
    }
  }, [currentPage, hasNextPage, products.length, queryClient, pageSize, productFilters, urlFilters.sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-product-listing-header-margin">
        <Breadcrumb
          items={[
            { label: 'Domů', href: '/' },
            { label: 'Produkty', href: '/products' },
          ]}
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
          products={products}
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
              <p className="text-gray-500">Žádné produkty nenalezeny</p>
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
