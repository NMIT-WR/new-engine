import Link from 'next/link'
import { Image } from 'ui/src/atoms/image'
import { tv } from 'ui/src/utils'
import type { Category } from '../types/product'

const categoryGridVariants = tv({
  slots: {
    root: 'bg-category-section-bg py-category-section-y',
    container: 'mx-auto max-w-category-max-w px-category-container-x flex flex-col gap-category-container-gap',
    header: 'flex flex-col gap-category-header-gap',
    title: 'font-bold text-category-title-size',
    subtitle: 'text-category-subtitle',
    grid: 'grid grid-cols-2 gap-category-grid-gap md:grid-cols-4',
    item: 'group relative overflow-hidden rounded-category-card-radius',
    imageWrapper: 'aspect-[4/3] overflow-hidden',
    image:
      'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
    overlay: 'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent',
    content: 'absolute bottom-0 left-0 p-category-card-padding',
    itemTitle: 'font-semibold text-category-item-title-size text-category-item-text',
    itemCount: 'text-category-item-count-size text-category-item-count',
  },
})

interface CategoryGridProps {
  title: string
  subtitle?: string
  categories: Category[]
}

export function CategoryGrid({
  title,
  subtitle,
  categories,
}: CategoryGridProps) {
  const styles = categoryGridVariants()

  return (
    <section className={styles.root()}>
      <div className={styles.container()}>
        <div className={styles.header()}>
          <h2 className={styles.title()}>{title}</h2>
          {subtitle && <p className={styles.subtitle()}>{subtitle}</p>}
        </div>
        <div className={styles.grid()}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.handle}`}
              className={styles.item()}
            >
              <div className={styles.imageWrapper()}>
                <Image
                  src={category.imageUrl || ''}
                  alt={category.name}
                  className={styles.image()}
                />
              </div>
              <div className={styles.overlay()} />
              <div className={styles.content()}>
                <h3 className={styles.itemTitle()}>{category.name}</h3>
                <p className={styles.itemCount()}>{category.count} items</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
