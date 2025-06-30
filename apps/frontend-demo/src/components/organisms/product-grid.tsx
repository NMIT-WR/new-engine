'use client'

import { useCurrentRegion } from '@/hooks/use-region'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/price-utils'
import { extractProductData } from '@/utils/product-utils'
import { Pagination } from '@ui/molecules/pagination'
import { ProductCard } from '@ui/molecules/product-card'
import { useRouter } from 'next/navigation'

interface ProductGridProps {
  products: Product[]
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
}

export function ProductGrid({ 
  products, 
  totalCount,
  currentPage = 1,
  pageSize = 12,
  onPageChange 
}: ProductGridProps) {
  const { region } = useCurrentRegion()
  const navigate = useRouter()

  // Calculate total pages based on totalCount or products length
  const totalPages = Math.ceil((totalCount || products.length) / pageSize)

  if (products.length === 0) {
    return (
      <div className="py-product-grid-empty-padding text-center">
        <p className="text-product-grid-empty-text">Žádné produkty nenalezeny</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-product-grid-gap sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const { price, displayBadges } =
            extractProductData(product, region?.currency_code, region)

          // Format the price for display
          // Prices from Medusa are already in dollars/euros, NOT cents
          const formattedPrice =
            price?.calculated_price !== undefined &&
            typeof price.calculated_price === 'number'
              ? formatPrice(price.calculated_price, region?.currency_code)
              : price?.amount !== undefined && typeof price.amount === 'number'
                ? formatPrice(price.amount, region?.currency_code)
                : 'Cena není k dispozici'

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
              detailButtonText="Zobrazit detaily"
            />
          )
        })}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="mt-product-grid-pagination-margin flex justify-center">
          {/* Mobile pagination with no siblings */}
          <Pagination
            count={totalCount || products.length}
            page={currentPage}
            onPageChange={onPageChange}
            pageSize={pageSize}
            siblingCount={0}
            className="sm:hidden"
          />
          {/* Desktop pagination with siblings */}
          <Pagination
            count={totalCount || products.length}
            page={currentPage}
            onPageChange={onPageChange}
            pageSize={pageSize}
            siblingCount={1}
            className="hidden sm:flex"
          />
        </div>
      )}
    </div>
  )
}
