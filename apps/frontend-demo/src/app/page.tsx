'use client'
import Link from 'next/link'
import { Image } from 'ui/src/atoms/image'
import { ProductCard } from 'ui/src/molecules/product-card'
import { Hero } from '../components/hero'
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
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="mb-2 font-bold text-3xl">Trending Now</h2>
            <p className="text-gray-600">Check out the most popular items</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
                stockStatus={product.stockStatus}
                badges={product.badges}
                addToCartText="Add to Cart"
                className="justify-between"
                onAddToCart={() => console.log('Add to cart:', product.name)}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-block font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
            >
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="mb-2 font-bold text-3xl">Shop by Category</h2>
            <p className="text-gray-600">Find what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gray-900">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=600&fit=crop"
                alt="Sale banner"
                className="h-full w-full object-cover opacity-50"
              />
            </div>
            <div className="relative px-8 py-16 text-center text-white md:px-16 md:py-24">
              <h2 className="mb-4 font-bold text-4xl md:text-5xl">
                End of Season Sale
              </h2>
              <p className="mb-8 text-xl">Up to 50% off on selected items</p>
              <Link
                href="/sale"
                className="inline-block rounded-md bg-white px-8 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-100"
              >
                Shop Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="mb-2 font-bold text-3xl">New Arrivals</h2>
            <p className="text-gray-600">Fresh styles just dropped</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockProducts.slice(4, 8).map((product) => (
              <ProductCard
                key={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
                stockStatus={product.stockStatus}
                badges={product.badges}
                addToCartText="Add to Cart"
                className="justify-between"
                onAddToCart={() => console.log('Add to cart:', product.name)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
