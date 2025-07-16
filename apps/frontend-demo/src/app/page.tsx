'use client'
import { ProductGridSkeleton } from '@/components/molecules/product-grid-skeleton'
import { SaleBanner } from '@/components/molecules/sale-banner'
import { CategoryGrid } from '@/components/organisms/category-grid'
import { Hero } from '@/components/organisms/hero'
import { ProductGrid } from '@/components/organisms/product-grid'
import { homeCategories, homeContent } from '@/data/home-content'
import { useProducts } from '@/hooks/use-products'
import { Button } from '@ui/atoms/button'

export default function Home() {
  const {
    hero,
    trending,
    categories: categoriesSection,
    saleBanner,
    newArrivals,
  } = homeContent
  const { products, isLoading } = useProducts({
    q: 'triko',
    sort: 'newest',
    limit: 8,
    category: 'pcat_01JYERRCMBCA6DTA9D2QK47365',
  })

  const featuredProducts = products.slice(0, 4)
  const newProductsList = products.slice(4, 8)

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        backgroundImage={hero.backgroundImage}
        primaryAction={hero.primaryAction}
        secondaryAction={hero.secondaryAction}
      />

      {/* Featured Products */}
      <div className="mx-auto max-w-layout-max px-4 py-16">
        <div className="mb-4 flex flex-col">
          <h2 className="font-bold text-featured-title text-featured-title-size">
            {trending.title}
          </h2>
          {trending.subtitle && (
            <p className="text-featured-subtitle">{trending.subtitle}</p>
          )}
        </div>
        {isLoading ? (
          <ProductGridSkeleton numberOfItems={4} />
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </div>

      {/* Categories - Grid View */}
      <CategoryGrid
        title={categoriesSection.title}
        subtitle={categoriesSection.subtitle}
        categories={homeCategories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          handle: cat.handle,
          parent_category_id: cat.parent_category_id,
          imageUrl: cat.imageUrl,
          leaves: cat.leaves,
          // Note: count and imageUrl would need to be fetched separately if needed
        }))}
      />

      {/* Banner Section */}
      <SaleBanner
        title={saleBanner.title}
        subtitle={saleBanner.subtitle}
        backgroundImage={saleBanner.backgroundImage}
        linkText={saleBanner.linkText}
        linkHref={saleBanner.linkHref}
      />

      {/* New Arrivals */}
      <div className="mx-auto max-w-layout-max px-4 py-16">
        <div className="mb-4 flex flex-col">
          <h2 className="font-bold text-featured-title text-featured-title-size">
            {newArrivals.title}
          </h2>
          {newArrivals.subtitle && (
            <p className="text-featured-subtitle">{newArrivals.subtitle}</p>
          )}
        </div>
        {isLoading ? (
          <ProductGridSkeleton numberOfItems={4} />
        ) : (
          <ProductGrid products={newProductsList} />
        )}
      </div>
    </div>
  )
}
