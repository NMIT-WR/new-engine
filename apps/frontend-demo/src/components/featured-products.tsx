import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProductCard } from 'ui/src/molecules/product-card'
import type { Product } from '../types/product'
import { extractProductData } from '../utils/product-utils'

interface FeaturedProductsProps {
  title: string
  subtitle?: string
  products: Product[]
  linkText?: string
  linkHref?: string
}

export function FeaturedProducts({
  title,
  subtitle,
  products,
  linkText = 'View all products',
  linkHref = '/products'
}: FeaturedProductsProps) {
  const router = useRouter()

  return (
    <section className="py-featured-section-y">
      <div className="mx-auto max-w-featured-max-w px-featured-container-x flex flex-col gap-featured-container-gap">
        <div className="flex flex-col gap-featured-header-gap">
          <h2 className="font-bold text-featured-title-size text-featured-title">{title}</h2>
          {subtitle && <p className="text-featured-subtitle">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 gap-featured-grid-gap sm:grid-cols-2 lg:grid-cols-4">
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
                detailButtonText="View"
                onDetailClick={() => router.push(`/products/${product.handle}`)}
                hasWishlistButton={false}
                layout="column"
              />
            )
          })}
        </div>
        {linkText && linkHref && (
          <div className="mt-featured-link-mt text-center">
            <Link href={linkHref} className="inline-block font-medium text-featured-link underline underline-offset-4 hover:text-featured-link-hover">
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
