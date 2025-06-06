'use client'

import { useState } from 'react'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
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
  const { banner, hero, breadcrumbs } = saleContent
  
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
      <div className="bg-sale-banner-bg text-sale-banner-fg py-sale-banner-y text-center mb-sale-banner-bottom">
        <p className="text-sale-banner-size font-sale-banner">
          {banner.icon && <span>{banner.icon} </span>}
          {banner.text}
          {banner.icon && <span> {banner.icon}</span>}
        </p>
      </div>

      {/* Header */}
      <section className="py-sale-header-y border-b border-border">
        <div className="mx-auto max-w-container-max px-container-x">
          <div className="mb-sale-breadcrumb-bottom">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <h1 className="text-sale-title-size font-sale-title text-sale-title-fg">
            {hero.title}
          </h1>
          <p className="text-sale-subtitle-size text-sale-subtitle-fg mt-sale-subtitle-top">
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
            <div className="flex justify-between items-center mb-sale-results-bottom">
              <p className="text-sale-results-size text-sale-results-fg">
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