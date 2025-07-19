import { DemoProductCard } from '@/components/molecules/demo-product-card'
import { useRegions } from '@/hooks/use-region'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/price-utils'
import { extractProductData } from '@/utils/product-utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  linkText = 'Zobrazit všechny produkty',
  linkHref = '/products',
}: FeaturedProductsProps) {
  const router = useRouter()
  const { selectedRegion } = useRegions()

  return (
    <section className="py-featured-section-y">
      <div className="mx-auto flex max-w-featured-max-w flex-col gap-featured-container-gap px-featured-container-x">
        <div className="flex flex-col gap-featured-header-gap">
          <h2 className="font-bold text-featured-title text-featured-title-size">
            {title}
          </h2>
          {subtitle && <p className="text-featured-subtitle">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-2 gap-featured-grid-gap sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const { displayBadges } = extractProductData(product, selectedRegion?.currency_code)
            const formattedPrice = product.price && formatPrice(product.price, selectedRegion?.currency_code)


            return (
              <Link key={product.id} href={`/products/${product.handle}`}>
                <DemoProductCard
                  imageUrl={product.thumbnail || ''}
                  name={product.title}
                  price={formattedPrice || 'není k dispozici'}
                  stockStatus=""
                  badges={displayBadges}
                  layout="column"
                  className="hover:bg-surface-hover"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
