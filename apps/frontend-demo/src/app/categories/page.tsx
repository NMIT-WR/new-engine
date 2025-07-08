'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { useCategories } from '@/hooks/use-categories'
import Link from 'next/link'

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-categories-bg">
        <div className="mx-auto max-w-categories-container-max-w px-categories-container-x-mobile py-categories-section-y-mobile md:px-categories-container-x-desktop md:py-categories-section-y-desktop">
          <div>
            <SkeletonLoader variant="text" size="xl" className="mb-4 w-1/3" />
            <SkeletonLoader variant="text" size="lg" className="mb-8 w-2/3" />
            <div className="grid grid-cols-2 gap-category-grid-gap md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonLoader
                  key={`skeleton-${i}`}
                  variant="box"
                  className="aspect-[4/3] w-full rounded-category-card-radius"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-categories-bg">
        <div className="mx-auto max-w-categories-container-max-w px-categories-container-x-mobile py-categories-section-y-mobile md:px-categories-container-x-desktop md:py-categories-section-y-desktop">
          <p className="text-red-500">Error loading categories: {error}</p>
        </div>
      </div>
    )
  }

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
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group relative overflow-hidden rounded-category-card-radius"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                {/* Using placeholder since categories don't have images in Medusa */}
                <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-600">
                  <span className="text-4xl">📁</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              <div className="absolute bottom-0 left-0 p-category-card-padding">
                <h3 className="font-semibold text-category-item-text text-category-item-title-size">
                  {category.name}
                </h3>
                <p className="text-category-item-count text-category-item-count-size">
                  {category.count > 0 ? `${category.count} items` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
