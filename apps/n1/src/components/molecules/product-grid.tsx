import type { Product } from '@/types/product'
import { Pagination } from '@new-engine/ui/molecules/pagination'
import { ProductCard } from '@new-engine/ui/molecules/product-card'
import { slugify } from '@new-engine/ui/utils'
import Image from 'next/image'
import { Fragment, memo } from 'react'

interface ProductGridProps {
  products: Product[]
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
}

export const ProductGrid = memo(
  ({
    products,
    totalCount,
    currentPage = 1,
    pageSize = 24,
    onPageChange,
  }: ProductGridProps) => {
    const totalPages = Math.ceil((totalCount || products.length) / pageSize)

    if (products.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">Žádné produkty nenalezeny</p>
        </div>
      )
    }

    return (
      <div className="w-full">
        <div className="grid w-full grid-cols-2 gap-200 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <Fragment key={product.id}>
              {index !== 0 &&
                index % 4 === 0 &&
                index + 1 !== products.length && (
                  <div className="col-span-full h-[1px] bg-border-secondary" />
                )}
              <ProductCard
                key={product.title}
                className="row-span-6 grid max-w-[250px] cursor-pointer grid-rows-subgrid place-items-center hover:shadow-lg"
              >
                <div className="flex h-full flex-col items-start gap-200">
                  <ProductCard.Name className="h-full text-balance">
                    {product.title}
                  </ProductCard.Name>
                  <ProductCard.Badges className="w-full">
                    {product.badges?.map((badge) => (
                      <ProductCard.Badge
                        key={slugify(badge.text)}
                        variant={badge.variant}
                      >
                        {badge.text}
                      </ProductCard.Badge>
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
                <div className="flex flex-col items-center gap-200">
                  <ProductCard.Actions>
                    {product.variants?.map((variant) => (
                      <ProductCard.Button
                        key={slugify(variant)}
                        buttonVariant="custom"
                        className="h-7 min-w-7 border border-gray-400 bg-surface px-50 py-50"
                      >
                        <span className="font-normal text-fg-primary text-sm">
                          {variant}
                        </span>
                      </ProductCard.Button>
                    ))}
                  </ProductCard.Actions>
                </div>
                <ProductCard.Stock status="in-stock">
                  {product.stockValue}
                </ProductCard.Stock>
                <div className="flex w-full items-center justify-evenly">
                  <ProductCard.Price>{product.price}</ProductCard.Price>
                  <ProductCard.Actions>
                    <ProductCard.Button
                      buttonVariant="cart"
                      icon="icon-[mdi--cart-outline]"
                    >
                      <span className="font-bold uppercase">Do košíku</span>
                    </ProductCard.Button>
                  </ProductCard.Actions>
                </div>
              </ProductCard>
            </Fragment>
          ))}
        </div>

        {totalPages > 1 && onPageChange && (
          <div className="mt-8 flex justify-center">
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
)
