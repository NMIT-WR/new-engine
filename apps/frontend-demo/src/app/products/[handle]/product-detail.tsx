'use client'

import { useState } from 'react'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { Carousel } from 'ui/src/molecules/carousel'
import { FeaturedProducts } from '../../../components/featured-products'
import { ProductInfo } from '../../../components/organisms/product-info'
import { ProductTabs } from '../../../components/organisms/product-tabs'
import { mockProducts } from '../../../data/mock-products'
import type { Product } from '../../../types/product'
import {
  extractProductData,
  getRelatedProducts,
} from '../../../utils/product-utils'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const { price, badges, stockStatus } = extractProductData(product)

  // Get related products
  const relatedProducts = getRelatedProducts(product, mockProducts, 4)

  const carouselImages =
    product.images?.map((img, idx) => ({
      id: `image-${idx}`,
      src: img.url,
      alt: img.alt || product.title,
    })) || []

  return (
    <div className="min-h-screen bg-product-detail-bg">
      <div className="mx-auto max-w-product-detail-max-w px-product-detail-container-x py-product-detail-container-y lg:px-product-detail-container-x-lg lg:py-product-detail-container-y-lg">
        {/* Breadcrumb */}
        <div className="mb-product-detail-breadcrumb-margin">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.title, href: `/products/${product.handle}` },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-product-detail-content-gap">
          {/* Image Section */}
          <div className="relative">
            <Carousel
              slides={carouselImages}
              slideCount={carouselImages.length}
              aspectRatio="portrait"
              loop
            />
          </div>

          {/* Info Section */}
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            badges={badges}
            price={price}
            onVariantChange={setSelectedVariant}
          />
        </div>

        {/* Tabs Section */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <div className="mt-product-detail-related-margin">
          <FeaturedProducts
            title="You May Also Like"
            subtitle="Check out these similar products"
            products={relatedProducts}
          />
        </div>
      </div>
    </div>
  )
}
