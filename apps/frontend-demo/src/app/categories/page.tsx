import { CategoryGrid } from '@/components/organisms/category-grid'
import { rootCategories } from '@/lib/static-data/categories'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-categories-bg">
      {/* Hero section */}
      <section className="mx-auto max-w-categories-container-max-w px-categories-container-x-mobile pt-categories-section-y-mobile md:px-categories-container-x-desktop md:pt-categories-section-y-desktop">
        <h1 className="font-categories-heading text-categories-heading-fg text-categories-heading-size-mobile md:text-categories-heading-size-desktop">
          Všechny kategorie
        </h1>
        <p className="mt-categories-hero-gap max-w-categories-description-max-w text-categories-description-fg text-categories-description-size">
          Prozkoumejte naši kompletní nabídku produktů. Od každodenních
          nezbyností po výjimečné kousky, najdete vše, co potřebujete, na jednom
          místě.
        </p>
      </section>

      {/* Categories grid - using the same component as homepage */}
      <CategoryGrid 
        categories={rootCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          handle: cat.handle,
          description: cat.description,
          // Note: count and imageUrl would need to be fetched separately if needed
        }))} 
      />

      {/* Category tree view 
      <CategoryTreeSection
        title="Browse by Hierarchy"
        subtitle="Navigate through our category structure"
      />*/}
    </div>
  )
}
