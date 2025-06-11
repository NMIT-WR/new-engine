'use client'
import { SaleBanner } from '@/components/molecules/sale-banner'
import { CategoryGrid } from '@/components/organisms/category-grid'
import { FeaturedProducts } from '@/components/organisms/featured-products'
import { Hero } from '@/components/organisms/hero'
import { homeContent } from '@/data/home-content'
import { categories, mockProducts } from '@/data/mock-products'

export default function Home() {
  const {
    hero,
    trending,
    categories: categoriesSection,
    saleBanner,
    newArrivals,
  } = homeContent

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
        products={mockProducts.slice(0, 4)}
        linkText={trending.linkText}
        linkHref={trending.linkHref}
      />

      {/* Categories */}
      <CategoryGrid
        title={categoriesSection.title}
        subtitle={categoriesSection.subtitle}
        categories={categories}
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
      <FeaturedProducts
        title={newArrivals.title}
        subtitle={newArrivals.subtitle}
        products={mockProducts.slice(4, 8)}
        linkHref={newArrivals.linkHref}
      />
    </div>
  )
}
