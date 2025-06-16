'use client'

import { useCurrentRegion } from '@/hooks/use-region'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/price-utils'
import { extractProductData } from '@/utils/product-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Pagination } from 'ui/src/molecules/pagination'
import { ProductCard } from 'ui/src/molecules/product-card'

interface ProductGridProps {
  products: Product[]
  pageSize?: number
}

export function ProductGrid({ products, pageSize = 9 }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { region } = useCurrentRegion()
  const navigate = useRouter()

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

  /*const handleNavigate = (handle: string) => {  
    navigate.push(`/products/${handle}`)
  }*/

  if (products.length === 0) {
    return (
      <div className="py-product-grid-empty-padding text-center">
        <p className="text-product-grid-empty-text">No products found</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-product-grid-gap sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentProducts.map((product) => {
          const { price, displayBadges, stockText, stockStatus } =
            extractProductData(product, region?.currency_code, region)

          // Format the price for display
          // Prices from Medusa are already in dollars/euros, NOT cents
          const formattedPrice =
            price?.calculated_price !== undefined &&
            typeof price.calculated_price === 'number'
              ? formatPrice(price.calculated_price, region?.currency_code)
              : price?.amount !== undefined && typeof price.amount === 'number'
                ? formatPrice(price.amount, region?.currency_code)
                : 'Price not available'

          return (
            <ProductCard
              key={product.id}
              name={product.title}
              price={formattedPrice}
              imageUrl={product.thumbnail || ''}
              badges={displayBadges}
              stockStatus="" // Empty since we show stock in badges
              hasDetailButton
              onDetailClick={() => navigate.push(`/products/${product.handle}`)}
              detailButtonText="View Details"
            />
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
