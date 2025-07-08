import type { Category } from '@/types/product'
import { Image } from '@ui/atoms/image'
import Link from 'next/link'

interface CategoryGridProps {
  title?: string
  subtitle?: string
  categories: Category[]
}

export function CategoryGrid({
  title,
  subtitle,
  categories,
}: CategoryGridProps) {
  const leaves = categories.map((category) => category.leaves)
  const CategoryCard = ({ category }: { category: Category }) => {
    const param = category.leaves?.join(',')
    const content = (
      <>
        <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
          {category.imageUrl && (
            <Image
              src={category.imageUrl}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-category-card-padding">
          <h3 className="font-semibold text-category-item-text text-category-item-title-size">
            {category.name}
          </h3>
          <p className="text-category-item-count text-category-item-count-size">
            Prohlédnout produkty
          </p>
        </div>
      </>
    )

    return (
      <Link
        key={category.id}
        prefetch={true}
        href={`/products?categories=${param}`}
        className="group relative overflow-hidden rounded-category-card-radius"
      >
        {content}
      </Link>
    )
  }

  return (
    <section className="bg-category-section-bg py-category-section-y">
      <div className="mx-auto flex max-w-category-max-w flex-col gap-category-container-gap px-category-container-x">
        {title && (
          <div className="flex flex-col gap-category-header-gap">
            <h2 className="font-bold text-category-title-size">{title}</h2>
            {subtitle && <p className="text-category-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-category-grid-gap md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
