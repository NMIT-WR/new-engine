"use client"
import { useEffect } from "react"
import { ProductGridSkeleton } from "@/components/molecules/product-grid-skeleton"
import { SaleBanner } from "@/components/molecules/sale-banner"
import { CategoryGrid } from "@/components/organisms/category-grid"
import { Hero } from "@/components/organisms/hero"
import { ProductGrid } from "@/components/organisms/product-grid"
import { homeCategories, homeContent } from "@/data/home-content"
import { usePrefetchProducts, useProducts } from "@/hooks/product-hooks"
import { getCategoryIdByHandle } from "@/utils/category-helpers"
import homeImage from "../../assets/hero/home.webp"

export default function Home() {
  const { prefetchFirstPage } = usePrefetchProducts()
  const {
    hero,
    trending,
    categories: categoriesSection,
    saleBanner,
    newArrivals,
  } = homeContent
  const { products, isLoading } = useProducts({
    q: "triko",
    sort: "newest",
    limit: 8,
    category: getCategoryIdByHandle("kratke-rukavy"),
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      prefetchFirstPage({ limit: 12, sort: "newest" })
    }, 100)
    return () => clearTimeout(timer)
  }, [prefetchFirstPage])

  const featuredProducts = products.slice(0, 4)
  const newProductsList = products.slice(4, 8)

  return (
    <div>
      <Hero
        backgroundImage={homeImage}
        primaryAction={hero.primaryAction}
        secondaryAction={hero.secondaryAction}
        subtitle={hero.subtitle}
        title={hero.title}
      />

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

      <CategoryGrid
        categories={homeCategories.map((cat) => ({
          name: cat.name,
          imageUrl: cat.imageUrl,
          leaves: cat.leaves,
          description: cat.description,
        }))}
        subtitle={categoriesSection.subtitle}
        title={categoriesSection.title}
      />

      <SaleBanner
        backgroundImage={saleBanner.backgroundImage}
        linkHref={saleBanner.linkHref}
        linkText={saleBanner.linkText}
        subtitle={saleBanner.subtitle}
        title={saleBanner.title}
      />

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
