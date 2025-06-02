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
import { FeaturedProducts } from '../../../components/featured-products'
import { mockProducts } from '../../../data/mock-products'
import { useCart } from '../../../hooks/use-cart'
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
        <div className="prose max-w-none">
          <p>{product.longDescription || product.description}</p>
          {product.features && product.features.length > 0 && (
            <>
              <h4 className="font-bold">Features:</h4>
              <ul>
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ),
    },
    {
      value: 'details',
      label: 'Product Details',
      content: (
        <div>
          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold mb-4">Specifications</h4>
              <dl className="grid grid-cols-1 gap-3">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex">
                    <dt className="font-medium min-w-[150px]">{spec.name}:</dt>
                    <dd className="text-gray-600">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <Accordion
            items={[
              {
                id: 'shipping',
                value: 'shipping',
                title: 'Shipping & Returns',
                content:
                  'Free shipping on orders over €50. 30-day return policy. Returns accepted in original condition.',
              },
              {
                id: 'sizing',
                value: 'sizing',
                title: 'Size Guide',
                content:
                  'True to size. See our size chart for detailed measurements. If between sizes, we recommend sizing up.',
              },
            ]}
          />
        </div>
      ),
    },
    {
      value: 'reviews',
      label: `Reviews (${product.reviewCount || 0})`,
      content: (
        <div className="space-y-product-detail-review-gap">
          {product.rating && (
            <div className="flex items-center gap-product-detail-review-rating-gap">
              <Rating value={product.rating} readOnly />
              <span>{product.rating} out of 5</span>
              {product.reviewCount && (
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
              )}
            </div>
          )}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Rating value={review.rating} readOnly />
                    <span className="font-semibold">{review.title}</span>
                    {review.verified && (
                      <Badge variant="success">Verified</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    By {review.author} on {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-product-detail-review-placeholder text-sm">
              No reviews yet. Be the first to review!
            </p>
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
                        
                        return (
                          <button
                            key={value}
                            onClick={() => handleOptionChange(option.title, value)}
                            className={`
                              relative w-10 h-10 rounded-full border-2 transition-all
                              ${isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-gray-300'}
                            `}
                            title={value}
                          >
                            <span
                              className="absolute inset-1 rounded-full"
                              style={{
                                backgroundColor: variantWithColor?.colorHex || '#ccc',
                              }}
                            />
                            {isSelected && (
                              <Icon
                                icon="icon-[mdi--check]"
                                className="absolute inset-0 m-auto text-white mix-blend-difference"
                              />
                            )}
                          </button>
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
                          <button
                            key={value}
                            onClick={() => handleOptionChange(option.title, value)}
                            disabled={isOutOfStock}
                            className={`
                              px-4 py-2 border rounded-md transition-all
                              ${isSelected
                                ? 'border-primary bg-primary text-white'
                                : isOutOfStock
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 hover:border-gray-400'
                              }
                            `}
                          >
                            {value}
                          </button>
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
