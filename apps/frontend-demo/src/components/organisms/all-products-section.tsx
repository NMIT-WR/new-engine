'use client'

import { useProducts } from '@/hooks/use-products'
import { extractProductData } from '@/utils/product-utils'
import { Button } from '@ui/atoms/button'
import { ProductCard } from '@ui/molecules/product-card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AllProductsSectionProps {
  title?: string
  subtitle?: string
  limit?: number
}

export function AllProductsSection({
  title = 'Všechny produkty',
  subtitle,
  limit = 20,
}: AllProductsSectionProps) {
  const { products, isLoading, totalCount } = useProducts({ limit })
  const router = useRouter()

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">Načítání produktů...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="font-bold text-3xl">{title}</h2>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
            <p className="mt-1 text-gray-500 text-sm">
              Zobrazeno {products.length} z {totalCount} produktů
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => {
            const { price, displayBadges, stockText } =
              extractProductData(product)

            return (
              <ProductCard
                key={product.id}
                imageUrl={product.thumbnail || ''}
                name={product.title}
                price={price?.calculated_price || ''}
                stockStatus={stockText}
                badges={displayBadges}
                hasCartButton={false}
                hasDetailButton={true}
                detailButtonText="Zobrazit"
                onDetailClick={() => router.push(`/products/${product.handle}`)}
                hasWishlistButton={false}
                layout="column"
              />
            )
          })}
        </div>

        {totalCount > limit && (
          <div className="mt-8 text-center">
            <Link href="/products">
              <Button size="lg">Zobrazit všech {totalCount} produktů</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
