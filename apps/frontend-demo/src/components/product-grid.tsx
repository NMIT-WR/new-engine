'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Pagination } from 'ui/src/molecules/pagination'
import { ProductCard } from 'ui/src/molecules/product-card'
import type { Product } from '../types/product'
import { extractProductData, getProductPath } from '../utils/product-utils'

interface ProductGridProps {
  products: Product[]
  pageSize?: number
}

export function ProductGrid({ products, pageSize = 9 }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Reset to page 1 when products change (due to filtering)
  useEffect(() => {
    setCurrentPage(1)
  }, [products.length])

  // Calculate pagination
  const totalPages = Math.ceil(products.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentProducts = products.slice(startIndex, endIndex)

  // If current page is out of bounds after filtering, reset to last valid page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  if (products.length === 0) {
    return (
      <div className="text-center py-product-grid-empty-padding">
        <p className="text-product-grid-empty-text">No products found</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-product-grid-gap">
        {currentProducts.map((product) => {
          const { price, displayBadges, stockText } =
            extractProductData(product)

          return (
            <Link
              key={product.id}
              href={getProductPath(product.handle)}
              className="block"
            >
              <ProductCard
                name={product.title}
                price={price?.calculated_price || '€0.00'}
                imageUrl={product.thumbnail || ''}
                badges={displayBadges}
                stockStatus={stockText}
                hasDetailButton
                detailButtonText="View Details"
              />
            </Link>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-product-grid-pagination-margin flex justify-center">
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