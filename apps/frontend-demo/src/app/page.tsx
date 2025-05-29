'use client'
import { CategoryGrid } from '../components/category-grid'
import { FeaturedProducts } from '../components/featured-products'
import { Hero } from '../components/hero'
import { SaleBanner } from '../components/sale-banner'
import { categories, mockProducts } from '../data/mock-products'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="New Collection"
        subtitle="Discover the latest trends in fashion"
        backgroundImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop"
        primaryAction={{
          label: 'Shop Now',
          onClick: () => console.log('Shop Now'),
        }}
        secondaryAction={{
          label: 'View Collection',
          onClick: () => console.log('View Collection'),
        }}
      />

      {/* Featured Products */}
      <FeaturedProducts
        title="Trending Now"
        subtitle="Check out the most popular items"
        products={mockProducts.slice(0, 4)}
        linkText="View all products"
        linkHref="/products"
      />

      {/* Categories */}
      <CategoryGrid
        title="Shop by Category"
        subtitle="Find what you're looking for"
        categories={categories}
      />

      {/* Banner Section */}
      <SaleBanner
        title="End of Season Sale"
        subtitle="Up to 50% off on selected items"
        backgroundImage="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=600&fit=crop"
        linkText="Shop Sale"
        linkHref="/sale"
      />

      {/* New Arrivals */}
      <FeaturedProducts
        title="New Arrivals"
        subtitle="Fresh styles just dropped"
        products={mockProducts.slice(4, 8)}
        linkHref="/products"
      />
    </div>
  )
}
