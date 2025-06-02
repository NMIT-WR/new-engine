'use client'

import { useState } from 'react'
import { Badge } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Rating } from 'ui/src/atoms/rating'
import { Tabs } from 'ui/src/atoms/tabs'
import { Accordion } from 'ui/src/molecules/accordion'
import { Breadcrumb } from 'ui/src/molecules/breadcrumb'
import { Carousel } from 'ui/src/molecules/carousel'
import { NumericInput } from 'ui/src/molecules/numeric-input'
import { Select } from 'ui/src/molecules/select'
import { useToast } from 'ui/src/molecules/toast'
import { ColorSwatch } from '../../../components/atoms/color-swatch'
import { FilterButton } from '../../../components/atoms/filter-button'
import { FeaturedProducts } from '../../../components/featured-products'
import { mockProducts } from '../../../data/mock-products'
import { useCart } from '../../../hooks/use-cart'
import type { Product } from '../../../types/product'
import {
  extractProductData,
  getRelatedProducts,
} from '../../../utils/product-utils'
import { getColorHex } from '../../../utils/color-map'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Initialize with first variant's options
    return product.variants?.[0]?.options || {}
  })
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { addItem } = useCart()
  const toast = useToast()

  const { price, badges, stockStatus } = extractProductData(product)

  // Get all option types from product
  const optionTypes = product.options || []

  // Find matching variant based on selected options
  const findMatchingVariant = (options: Record<string, string>) => {
    return product.variants?.find((variant) => {
      return Object.entries(options).every(
        ([key, value]) => variant.options?.[key] === value
      )
    })
  }

  // Update selected variant when options change
  const handleOptionChange = (optionTitle: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionTitle.toLowerCase()]: value }
    setSelectedOptions(newOptions)
    const newVariant = findMatchingVariant(newOptions)
    if (newVariant) {
      setSelectedVariant(newVariant)
    }
  }

  // Get related products
  const relatedProducts = getRelatedProducts(product, mockProducts, 4)

  const tabItems = [
    {
      value: 'description',
      label: 'Description',
      content: (
        <div className="space-y-product-detail-tab-content-gap">
          <p className="text-product-detail-tab-content-size text-product-detail-tab-content-fg leading-relaxed">
            {product.longDescription || product.description}
          </p>
          {product.features && product.features.length > 0 && (
            <div className="space-y-product-detail-tab-content-gap">
              <h4 className="text-product-detail-tab-heading-size font-product-detail-tab-heading text-product-detail-tab-heading-fg">
                Key Features
              </h4>
              <ul className="space-y-product-detail-tab-features-gap pl-5">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-product-detail-tab-content-size text-product-detail-tab-content-fg list-disc">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'details',
      label: 'Product Details',
      content: (
        <div className="space-y-product-detail-tab-section-gap">
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-product-detail-tab-content-gap">
              <h4 className="text-product-detail-tab-heading-size font-product-detail-tab-heading text-product-detail-tab-heading-fg">
                Specifications
              </h4>
              <dl className="space-y-product-detail-tab-spec-gap">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-product-detail-tab-spec-gap py-product-detail-tab-table-cell-y border-b border-product-detail-tab-spec-border last:border-0">
                    <dt className="font-product-detail-tab-spec-label text-product-detail-tab-spec-size text-product-detail-tab-spec-label min-w-[var(--spacing-product-detail-tab-spec-label-width)]">
                      {spec.name}
                    </dt>
                    <dd className="text-product-detail-tab-spec-size text-product-detail-tab-spec-value">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="mt-product-detail-tab-accordion-margin">
            <Accordion
              items={[
                {
                  id: 'shipping',
                  value: 'shipping',
                  title: 'Shipping & Returns',
                  content: (
                    <div className="text-product-detail-tab-content-size text-product-detail-tab-content-fg space-y-2">
                      <p>• Free shipping on orders over €50</p>
                      <p>• Express delivery available (1-2 business days)</p>
                      <p>• 30-day return policy</p>
                      <p>• Returns accepted in original condition with tags</p>
                    </div>
                  ),
                },
                {
                  id: 'sizing',
                  value: 'sizing',
                  title: 'Size Guide',
                  content: (
                    <div className="text-product-detail-tab-content-size text-product-detail-tab-content-fg space-y-2">
                      <p>Our products are true to size. If you're between sizes, we recommend sizing up for a comfortable fit.</p>
                      <p className="font-product-detail-tab-spec-label mt-product-detail-tab-spec-gap">Size Chart:</p>
                      <table className="w-full text-product-detail-tab-review-meta">
                        <thead>
                          <tr className="border-b border-product-detail-tab-spec-border">
                            <th className="text-left py-product-detail-tab-table-cell-y">Size</th>
                            <th className="text-left py-product-detail-tab-table-cell-y">EU</th>
                            <th className="text-left py-product-detail-tab-table-cell-y">US</th>
                            <th className="text-left py-product-detail-tab-table-cell-y">UK</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-product-detail-tab-spec-border">
                            <td className="py-product-detail-tab-table-cell-y">S</td>
                            <td className="py-product-detail-tab-table-cell-y">36-38</td>
                            <td className="py-product-detail-tab-table-cell-y">4-6</td>
                            <td className="py-product-detail-tab-table-cell-y">8-10</td>
                          </tr>
                          <tr className="border-b border-product-detail-tab-spec-border">
                            <td className="py-product-detail-tab-table-cell-y">M</td>
                            <td className="py-product-detail-tab-table-cell-y">38-40</td>
                            <td className="py-product-detail-tab-table-cell-y">6-8</td>
                            <td className="py-product-detail-tab-table-cell-y">10-12</td>
                          </tr>
                          <tr className="border-b border-product-detail-tab-spec-border">
                            <td className="py-product-detail-tab-table-cell-y">L</td>
                            <td className="py-product-detail-tab-table-cell-y">40-42</td>
                            <td className="py-product-detail-tab-table-cell-y">8-10</td>
                            <td className="py-product-detail-tab-table-cell-y">12-14</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ),
                },
                {
                  id: 'care',
                  value: 'care',
                  title: 'Care Instructions',
                  content: (
                    <div className="text-product-detail-tab-content-size text-product-detail-tab-content-fg space-y-2">
                      <p>• Machine wash cold with like colors</p>
                      <p>• Do not bleach</p>
                      <p>• Tumble dry low or hang to dry</p>
                      <p>• Cool iron if needed</p>
                      <p>• Do not dry clean</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      value: 'reviews',
      label: `Reviews (${product.reviewCount || 0})`,
      content: (
        <div className="space-y-product-detail-tab-section-gap">
          {product.rating && (
            <div className="bg-product-detail-tab-review-bg p-product-detail-tab-review-card rounded-product-detail-tab-review-bg">
              <div className="flex items-center gap-product-detail-review-rating-gap">
                <Rating value={product.rating} readOnly />
                <span className="text-product-detail-tab-heading-size font-product-detail-tab-heading">
                  {product.rating} out of 5
                </span>
                {product.reviewCount && (
                  <span className="text-product-detail-tab-content-muted">
                    ({product.reviewCount} reviews)
                  </span>
                )}
              </div>
            </div>
          )}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-product-detail-tab-content-gap">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-product-detail-tab-review-border pb-product-detail-tab-content-gap">
                  <div className="flex items-start justify-between mb-product-detail-tab-spec-gap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-product-detail-tab-spec-gap">
                        <Rating value={review.rating} readOnly />
                        <h5 className="font-product-detail-tab-spec-label text-product-detail-tab-spec-size">
                          {review.title}
                        </h5>
                        {review.verified && (
                          <Badge variant="success" size="sm">Verified Purchase</Badge>
                        )}
                      </div>
                      <div className="text-product-detail-tab-review-meta text-product-detail-tab-content-muted">
                        By {review.author} • {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="text-product-detail-tab-content-size text-product-detail-tab-content-fg leading-relaxed">
                    {review.comment}
                  </p>
                  {review.helpful && (
                    <div className="mt-product-detail-tab-spec-gap text-product-detail-tab-review-meta text-product-detail-tab-content-muted">
                      {review.helpful} people found this helpful
                    </div>
                  )}
                </div>
              ))}
              <Button variant="secondary" className="w-full">
                Load More Reviews
              </Button>
            </div>
          ) : (
            <div className="text-center py-product-detail-tab-review-card bg-product-detail-tab-review-bg rounded-product-detail-tab-review-bg">
              <p className="text-product-detail-tab-content-size text-product-detail-tab-content-muted mb-product-detail-tab-content-gap">
                No reviews yet. Be the first to share your experience!
              </p>
              <Button variant="primary">
                Write a Review
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ]

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
          <div className="flex flex-col">
            {/* Badges */}
            {badges.length > 0 && (
              <div className="mb-product-detail-badge-margin flex flex-wrap gap-product-detail-badge-gap">
                {badges.map((badge, idx) => (
                  <Badge key={idx} {...badge} />
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-product-detail-title font-product-detail-title mb-product-detail-title-margin">{product.title}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-product-detail-rating-gap mb-product-detail-rating-margin">
                <Rating value={product.rating} readOnly />
                <span className="text-product-detail-rating-text">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-product-detail-price-margin">
              <span className="text-product-detail-price font-product-detail-price">
                {selectedVariant?.prices?.[0]?.calculated_price || price?.calculated_price}
              </span>
              {selectedVariant?.prices?.[0]?.original_price &&
                selectedVariant.prices[0].original_price !== selectedVariant.prices[0].calculated_price && (
                  <span className="text-product-detail-original-price line-through ml-product-detail-original-price-margin">
                    {selectedVariant.prices[0].original_price}
                  </span>
                )}
            </div>

            {/* Description */}
            <p className="text-product-detail-description mb-product-detail-description-margin">
              {product.description}
            </p>

            {/* SKU and Stock Info */}
            {selectedVariant && (
              <div className="text-sm text-gray-600 mb-4">
                <p>SKU: {selectedVariant.sku}</p>
                {selectedVariant.inventory_quantity !== undefined && (
                  <p>In Stock: {selectedVariant.inventory_quantity} units</p>
                )}
              </div>
            )}

            {/* Variant Selectors */}
            {optionTypes.map((option) => {
              const optionKey = option.title.toLowerCase()
              const isColor = optionKey === 'color' || optionKey === 'colour'
              
              return (
                <div key={option.id} className="mb-product-detail-variant-margin">
                  <label className="text-product-detail-variant-label font-product-detail-variant-label mb-product-detail-variant-label-margin">
                    {option.title}
                  </label>
                  
                  {isColor ? (
                    /* Color swatches */
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const variantWithColor = product.variants?.find(
                          (v) => v.options?.[optionKey] === value
                        )
                        const isSelected = selectedOptions[optionKey] === value
                        const colorHex = variantWithColor?.colorHex || getColorHex(value)
                        
                        return (
                          <ColorSwatch
                            key={value}
                            selected={isSelected}
                            color={colorHex}
                            colorName={value}
                            onClick={() => handleOptionChange(option.title, value)}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    /* Size or other option buttons */
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const isSelected = selectedOptions[optionKey] === value
                        const variantForOption = product.variants?.find(
                          (v) => v.options?.[optionKey] === value
                        )
                        const isOutOfStock = variantForOption?.inventory_quantity === 0
                        
                        return (
                          <FilterButton
                            key={value}
                            variant={isSelected ? 'selected' : 'default'}
                            disabled={isOutOfStock}
                            onClick={() => handleOptionChange(option.title, value)}
                          >
                            {value}
                          </FilterButton>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Quantity */}
            <div className="mb-product-detail-quantity-margin">
              <div className="flex items-center gap-product-detail-quantity-gap">
                <span className="text-product-detail-quantity-label">Quantity:</span>
                <NumericInput
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                  hideControls={false}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-product-detail-action-gap mb-product-detail-action-margin">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={selectedVariant?.inventory_quantity === 0}
                icon="icon-[mdi--cart-plus]"
                onClick={() => {
                  if (!selectedVariant) {
                    toast.create({
                      title: 'Please select options',
                      description: 'Please select all product options before adding to cart.',
                      type: 'error',
                    })
                    return
                  }

                  // Add to cart with variant info
                  addItem(product, {
                    variantId: selectedVariant.id,
                    ...selectedOptions,
                    quantity,
                  })

                  // Show success toast with variant details
                  toast.create({
                    title: 'Added to cart',
                    description: `${product.title} (${selectedVariant.title}) has been added to your cart.`,
                    type: 'success',
                  })
                }}
              >
                {selectedVariant?.inventory_quantity === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon="icon-[mdi--heart-outline]"
              >
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>

            {/* Stock Info */}
            <div className="flex items-center gap-product-detail-stock-gap text-product-detail-stock">
              {selectedVariant && selectedVariant.inventory_quantity !== undefined && (
                <>
                  {selectedVariant.inventory_quantity > 5 && (
                    <>
                      <Icon
                        icon="icon-[mdi--check-circle]"
                        className="text-product-detail-stock-success"
                      />
                      <span>In stock and ready to ship</span>
                    </>
                  )}
                  {selectedVariant.inventory_quantity > 0 && selectedVariant.inventory_quantity <= 5 && (
                    <>
                      <Icon
                        icon="icon-[mdi--alert-circle]"
                        className="text-product-detail-stock-warning"
                      />
                      <span>Only {selectedVariant.inventory_quantity} left in stock</span>
                    </>
                  )}
                  {selectedVariant.inventory_quantity === 0 && (
                    <>
                      <Icon
                        icon="icon-[mdi--close-circle]"
                        className="text-product-detail-stock-error"
                      />
                      <span>Currently out of stock</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-product-detail-tabs-margin">
          <Tabs items={tabItems} defaultValue="description" />
        </div>

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
