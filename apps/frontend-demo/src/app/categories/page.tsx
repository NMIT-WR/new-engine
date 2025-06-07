'use client'
import { getCategoriesWithStats } from '../../data/categories-content'

export default function CategoriesPage() {
  const categoriesWithStats = getCategoriesWithStats()

  return (
    <div className="min-h-screen bg-categories-bg">

      {/* Hero section */}
      <section className="mx-auto max-w-categories-container-max-w px-categories-container-x-mobile pb-categories-section-y-mobile md:px-categories-container-x-desktop md:pb-categories-section-y-desktop">
        <h1 className="font-categories-heading text-categories-heading-fg text-categories-heading-size-mobile md:text-categories-heading-size-desktop">
          All Categories
        </h1>
        <p className="mt-categories-hero-gap max-w-categories-description-max-w text-categories-description-fg text-categories-description-size">
          Explore our complete range of products. From everyday essentials to
          statement pieces, find everything you need in one place.
        </p>
      </section>

      {/* Categories grid - reuse the component without wrapper section */}
      <div className="mx-auto max-w-categories-container-max-w px-categories-container-x-mobile pb-categories-section-y-mobile md:px-categories-container-x-desktop md:pb-categories-section-y-desktop">
        <div className="grid grid-cols-2 gap-category-grid-gap md:grid-cols-4">
          {categoriesWithStats.map((category) => (
            <a
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group relative overflow-hidden rounded-category-card-radius"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 left-0 p-category-card-padding">
                <h3 className="font-semibold text-category-item-text text-category-item-title-size">
                  {category.name}
                </h3>
                <p className="text-category-item-count text-category-item-count-size">
                  {category.count} items
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
