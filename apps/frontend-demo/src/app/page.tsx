'use client'
import { ProductGridSkeleton } from '@/components/molecules/product-grid-skeleton'
import { SaleBanner } from '@/components/molecules/sale-banner'
import { CategoryGrid } from '@/components/organisms/category-grid'
import { Hero } from '@/components/organisms/hero'
import { ProductGrid } from '@/components/organisms/product-grid'
import { homeCategories, homeContent } from '@/data/home-content'
import { usePrefetchProducts } from '@/hooks/use-prefetch-products'
import { useProducts } from '@/hooks/use-products'
import { useRegions } from '@/hooks/use-region'
import { getCategoryIdByHandle } from '@/utils/category-helpers'
import { useEffect } from 'react'
import homeImage from '/assets/hero/home.webp'

export default function Home() {
  const { prefetchDefaultProducts } = usePrefetchProducts()
  const { selectedRegion } = useRegions()
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
    category: getCategoryIdByHandle('kratke-rukavy'),
    region_id: selectedRegion?.id,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      prefetchDefaultProducts()
    }, 100)
    return () => clearTimeout(timer)
  }, [prefetchDefaultProducts])

  const featuredProducts = products.slice(0, 4)
  const newProductsList = products.slice(4, 8)

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        backgroundImage={homeImage}
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
          name: cat.name,
          imageUrl: cat.imageUrl,
          leaves: cat.leaves,
          description: cat.description,
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
