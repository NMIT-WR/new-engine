'use client'
import { SkeletonLoader } from '@/components/atoms/skeleton-loader'
import { CategoryGrid } from '@/components/organisms/category-grid'
import { CategoryTreeSection } from '@/components/organisms/category-tree-section'
import { useRootCategories } from '@/hooks/use-categories-v2'

export default function CategoriesPage() {
  const { categories: orderedCategories, isLoading, error } = useRootCategories()

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
                  key={i}
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
      <section className="mx-auto max-w-categories-container-max-w px-categories-container-x-mobile pt-categories-section-y-mobile md:px-categories-container-x-desktop md:pt-categories-section-y-desktop">
        <h1 className="font-categories-heading text-categories-heading-fg text-categories-heading-size-mobile md:text-categories-heading-size-desktop">
          All Categories
        </h1>
        <p className="mt-categories-hero-gap max-w-categories-description-max-w text-categories-description-fg text-categories-description-size">
          Explore our complete range of products. From everyday essentials to
          statement pieces, find everything you need in one place.
        </p>
      </section>

      {/* Categories grid - using the same component as homepage */}
      <CategoryGrid
        categories={orderedCategories}
      />
      
      {/* Category tree view 
      <CategoryTreeSection
        title="Browse by Hierarchy"
        subtitle="Navigate through our category structure"
      />*/}
    </div>
  )
}
