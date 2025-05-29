'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Pagination } from 'ui/src/molecules/pagination'
import { ProductCard } from 'ui/src/molecules/product-card'
import { tv } from 'ui/src/utils'
import {
  getProductBadges,
  getProductPrice,
  getProductStock,
} from '../data/mock-products'
import type { Product } from '../types/product'

const productGridVariants = tv({
  slots: {
    root: 'w-full',
    grid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-product-grid-gap',
    paginationWrapper: 'mt-product-grid-pagination-margin flex justify-center',
    emptyState: 'text-center py-product-grid-empty-padding',
    emptyText: 'text-product-grid-empty-text',
  },
})

interface ProductGridProps {
  products: Product[]
  pageSize?: number
}

export function ProductGrid({ products, pageSize = 9 }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const styles = productGridVariants()

  // Calculate pagination
  const totalPages = Math.ceil(products.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentProducts = products.slice(startIndex, endIndex)

  if (products.length === 0) {
    return (
      <div className={styles.emptyState()}>
        <p className={styles.emptyText()}>No products found</p>
      </div>
    )
  }

  return (
    <div className={styles.root()}>
      <div className={styles.grid()}>
        {currentProducts.map((product) => {
          const price = getProductPrice(product)
          const badges = getProductBadges(product)
          const stock = getProductStock(product)
          const stockText =
            stock === 'in-stock'
              ? 'In Stock'
              : stock === 'low-stock'
                ? 'Low Stock'
                : 'Out of Stock'

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="block"
            >
              <ProductCard
                name={product.title}
                price={price?.calculated_price || '€0.00'}
                imageUrl={product.thumbnail || ''}
                badges={badges}
                stockStatus={stockText}
                hasDetailButton
                detailButtonText="View Details"
              />
            </Link>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper()}>
          <Pagination
            count={products.length}
            page={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            pageSize={pageSize}
            siblingCount={1}
          />
        </div>
      )}
    </div>
  )
}
