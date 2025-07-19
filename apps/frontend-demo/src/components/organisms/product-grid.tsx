'use client'

import { DemoProductCard } from '@/components/molecules/demo-product-card'
import { useRegions } from '@/hooks/use-region'
import { queryKeys } from '@/lib/query-keys'
import { getProduct } from '@/services/product-service'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/price-utils'
import { extractProductData } from '@/utils/product-utils'
import { useQueryClient } from '@tanstack/react-query'
import { Pagination } from '@ui/molecules/pagination'
import Link from 'next/link'

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
  onPageChange,
}: ProductGridProps) {
  const { selectedRegion } = useRegions()
  const queryClient = useQueryClient()

  const prefetchProduct = (handle: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.product(handle, selectedRegion?.id),
      queryFn: () => getProduct(handle, selectedRegion?.id),
      staleTime: 60 * 60 * 1000,
    })
  }

  // Calculate total pages based on totalCount or products length
  const totalPages = Math.ceil((totalCount || products.length) / pageSize)

  if (products.length === 0) {
    return (
      <div className="py-product-grid-empty-padding text-center">
        <p className="text-product-grid-empty-text">
          Žádné produkty nenalezeny
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-product-grid-gap sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const { displayBadges } = extractProductData(
            product,
            selectedRegion?.currency_code
          )
          // Format the price for display
          // Prices from Medusa are already in dollars/euros, NOT cents
          const formattedPrice = product.price && formatPrice(product.price, selectedRegion?.currency_code)

          return (
            <Link
              key={product.id}
              prefetch={true}
              href={`/products/${product.handle}`}
              onMouseEnter={() => prefetchProduct(product.handle)}
              onTouchStart={() => prefetchProduct(product.handle)}
            >
              <DemoProductCard
                name={product.title}
                price={formattedPrice || 'není k dispozici'}
                imageUrl={product.thumbnail || ''}
                badges={displayBadges}
                className="hover:bg-highlight"
              />
            </Link>
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
