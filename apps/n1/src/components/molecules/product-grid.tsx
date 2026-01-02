import { usePrefetchProduct } from '@/hooks/use-prefetch-product'
import type { Product } from '@/types/product'
import { Badge } from '@techsio/ui-kit/atoms/badge'
import { Pagination } from '@techsio/ui-kit/molecules/pagination'
import { ProductCard } from '@techsio/ui-kit/molecules/product-card'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { ProductCardSkeleton } from '../skeletons/product-card-skeleton'
import { VariantsBox } from './variants-box'

interface ProductGridProps {
  products: Product[]
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
  skeletonCount?: number
}

export const ProductGrid = ({
  products,
  totalCount,
  currentPage = 1,
  pageSize = 24,
  onPageChange,
  isLoading = false,
  skeletonCount = 12,
}: ProductGridProps) => {
  const { delayedPrefetch } = usePrefetchProduct()
  const totalPages = Math.ceil((totalCount || products.length) / pageSize)

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-max-w">
        <div className="grid w-full grid-cols-2 gap-200 md:grid-cols-4">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-300 text-center">
        <p className="text-fg-secondary">Žádné produkty nenalezeny</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <Fragment key={product.id}>
            {index !== 0 &&
              index % 4 === 0 &&
              index + 1 !== products.length && (
                <div className="col-span-full h-[1px] bg-border-secondary md:hidden lg:flex" />
              )}
            {index !== 0 &&
              index % 3 === 0 &&
              index + 1 !== products.length && (
                <div className="col-span-full hidden h-[1px] bg-border-secondary md:flex lg:hidden" />
              )}
            <Link
              className="contents"
              href={`/produkt/${product.handle}`}
              onMouseEnter={() => {
                delayedPrefetch(product.handle, 200)
              }}
            >
              <ProductCard className="row-span-5 grid h-full max-w-3xs cursor-pointer grid-rows-subgrid place-items-center gap-y-100 hover:shadow-lg">
                <div className="flex flex-col gap-200 place-self-start">
                  <ProductCard.Name className="text-center">
                    {product.title}
                  </ProductCard.Name>
                  <ProductCard.Badges className="w-full">
                    {product.badges?.map((badge, index) => (
                      <Badge key={index} {...badge} />
                    ))}
                  </ProductCard.Badges>
                </div>
                <ProductCard.Image
                  as={Image}
                  width={250}
                  height={250}
                  alt={product.title}
                  src={product.imageSrc}
                  className="aspect-square w-auto"
                />
                <div className="flex flex-col items-center gap-300 self-start">
                  <ProductCard.Actions>
                    <VariantsBox variants={product.variants || []} />
                  </ProductCard.Actions>
                </div>
                <ProductCard.Stock status={product.stockValue === 'Skladem' ? 'in-stock' : 'out-of-stock'}>
                  {product.stockValue}
                </ProductCard.Stock>
                <div className="flex w-full flex-col items-center justify-evenly xl:flex-row">
                  <ProductCard.Price>{product.price}</ProductCard.Price>
                  <ProductCard.Actions>
                    {product?.variants && product.variants?.length > 1 ? (
                      <ProductCard.Button buttonVariant="detail">
                        <span className="font-bold uppercase">Detail</span>
                      </ProductCard.Button>
                    ) : (
                      <ProductCard.Button
                        buttonVariant="cart"
                        icon="icon-[mdi--cart-outline]"
                      >
                        <span className="font-bold uppercase">Do košíku</span>
                      </ProductCard.Button>
                    )}
                  </ProductCard.Actions>
                </div>
              </ProductCard>
            </Link>
          </Fragment>
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="mt-700 flex justify-end">
          <Pagination
            count={totalCount || products.length}
            page={currentPage}
            onPageChange={onPageChange}
            pageSize={pageSize}
            siblingCount={0}
            className="sm:hidden"
          />
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
