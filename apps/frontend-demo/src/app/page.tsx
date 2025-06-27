'use client'
import { SaleBanner } from '@/components/molecules/sale-banner'
import { CategoryGrid } from '@/components/organisms/category-grid'
import { FeaturedProducts } from '@/components/organisms/featured-products'
import { Hero } from '@/components/organisms/hero'
import { homeContent } from '@/data/home-content'
import { useHomeProducts } from '@/hooks/use-products'
import { rootCategories } from '@/lib/static-data/categories'

export default function Home() {
  const {
    hero,
    trending,
    categories: categoriesSection,
    saleBanner,
    newArrivals,
  } = homeContent

  const { featured, newArrivals: newProducts } = useHomeProducts()

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
      <FeaturedProducts
        title={trending.title}
        subtitle={trending.subtitle}
        products={featured}
        linkText={trending.linkText}
        linkHref={trending.linkHref}
      />

      {/* Categories - Grid View */}
      <CategoryGrid
        title={categoriesSection.title}
        subtitle={categoriesSection.subtitle}
        categories={rootCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          handle: cat.handle,
          description: cat.description,
          // Note: count and imageUrl would need to be fetched separately if needed
        }))}
      />

      {/* Categories - Tree View 
      <CategoryTreeSection
        title="Browse All Categories"
        subtitle="Navigate through our complete category hierarchy"
      />*/}

      {/* Banner Section */}
      <SaleBanner
        title={saleBanner.title}
        subtitle={saleBanner.subtitle}
        backgroundImage={saleBanner.backgroundImage}
        linkText={saleBanner.linkText}
        linkHref={saleBanner.linkHref}
      />

      {/* New Arrivals */}
      <FeaturedProducts
        title={newArrivals.title}
        subtitle={newArrivals.subtitle}
        products={newProducts}
        linkHref={newArrivals.linkHref}
      />

      {/* All Products Section 
      <AllProductsSection
        title="Explore Our Collection"
        subtitle="Discover our complete range of products"
        limit={20}
      />*/}
    </div>
  )
}
