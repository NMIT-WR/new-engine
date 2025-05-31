import Link from 'next/link'
import { ProductCard } from 'ui/src/molecules/product-card'
import { tv } from 'ui/src/utils'
import type { Product } from '../types/product'
import { extractProductData } from '../utils/product-utils'

const featuredProductsVariants = tv({
  slots: {
    root: 'py-featured-section-y',
    container:
      'mx-auto max-w-featured-max-w px-featured-container-x flex flex-col gap-featured-container-gap',
    header: 'flex flex-col gap-featured-header-gap',
    title: 'font-bold text-featured-title-size text-featured-title',
    subtitle: 'text-featured-subtitle',
    grid: 'grid grid-cols-1 gap-featured-grid-gap sm:grid-cols-2 lg:grid-cols-4',
    linkWrapper: 'mt-featured-link-mt text-center',
    link: 'inline-block font-medium text-featured-link underline underline-offset-4 hover:text-featured-link-hover',
  },
})

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
  linkHref = '/products',
}: FeaturedProductsProps) {
  const styles = featuredProductsVariants()

  return (
    <section className={styles.root()}>
      <div className={styles.container()}>
        <div className={styles.header()}>
          <h2 className={styles.title()}>{title}</h2>
          {subtitle && <p className={styles.subtitle()}>{subtitle}</p>}
        </div>
        <div className={styles.grid()}>
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
                hasCartButton={true}
                cartButtonText="Add to Cart"
                layout="column"
              />
            )
          })}
        </div>
        {linkText && linkHref && (
          <div className={styles.linkWrapper()}>
            <Link href={linkHref} className={styles.link()}>
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
