'use client'
import { useState } from 'react'
import { ProductFilters } from '../../components/product-filters'
import { ProductGrid } from '../../components/product-grid'
import { mockProducts } from '../../data/mock-products'
import { saleContent } from '../../data/sale-content'
import {
  type FilterState,
  type SortOption,
  filterProducts,
  sortProducts,
} from '../../utils/product-filters'

export default function SalePage() {
  const { banner, hero } = saleContent

  // Get only sale products
  const saleProducts = mockProducts.filter((product) =>
    product.tags?.some((tag) => tag.value.toLowerCase() === 'sale')
  )

  const [filters, setFilters] = useState<FilterState>({
    categories: new Set(),
    priceRange: [0, 300],
    colors: new Set(),
    sizes: new Set(),
  })

  const [sortBy, setSortBy] = useState<SortOption>('price-asc')

  // Apply filters to sale products
  let filteredProducts = filterProducts(saleProducts, filters)
  filteredProducts = sortProducts(filteredProducts, sortBy)

  return (
    <>
      {/* Sale Banner */}
      <div className="mb-sale-banner-bottom bg-sale-banner-bg py-sale-banner-y text-center text-sale-banner-fg">
        <p className="font-sale-banner text-sale-banner-size">
          {banner.icon && <span>{banner.icon} </span>}
          {banner.text}
          {banner.icon && <span> {banner.icon}</span>}
        </p>
      </div>

      {/* Header */}
      <section className="border-border border-b py-sale-header-y">
        <div className="mx-auto max-w-container-max px-container-x">
          <h1 className="font-sale-title text-sale-title-fg text-sale-title-size">
            {hero.title}
          </h1>
          <p className="mt-sale-subtitle-top text-sale-subtitle-fg text-sale-subtitle-size">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-container-max px-container-x">
        <div className="flex gap-sale-layout-gap py-sale-content-y">
          {/* Filters Sidebar */}
          <aside className="w-sale-sidebar-width flex-shrink-0">
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-sale-results-bottom flex items-center justify-between">
              <p className="text-sale-results-fg text-sale-results-size">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'} on sale
              </p>
            </div>
            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </section>
    </>
  )
}
