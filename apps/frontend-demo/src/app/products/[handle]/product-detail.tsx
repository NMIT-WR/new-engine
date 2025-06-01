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
import { tv } from 'ui/src/utils'
import { FeaturedProducts } from '../../../components/featured-products'
import { mockProducts } from '../../../data/mock-products'
import { useCart } from '../../../hooks/use-cart'
import type { Product } from '../../../types/product'
import {
  extractProductData,
  getRelatedProducts,
} from '../../../utils/product-utils'

const productDetailVariants = tv({
  slots: {
    root: 'min-h-screen bg-product-detail-bg',
    container:
      'mx-auto max-w-product-detail-max-w px-product-detail-container-x py-product-detail-container-y lg:px-product-detail-container-x-lg lg:py-product-detail-container-y-lg',
    breadcrumb: 'mb-product-detail-breadcrumb-margin',
    content: 'grid grid-cols-1 lg:grid-cols-2 gap-product-detail-content-gap',
    imageSection: 'relative',
    infoSection: 'flex flex-col',
    badgeContainer:
      'mb-product-detail-badge-margin flex flex-wrap gap-product-detail-badge-gap',
    title:
      'text-product-detail-title font-product-detail-title mb-product-detail-title-margin',
    ratingWrapper:
      'flex items-center gap-product-detail-rating-gap mb-product-detail-rating-margin',
    ratingText: 'text-product-detail-rating-text',
    priceSection: 'mb-product-detail-price-margin',
    price: 'text-product-detail-price font-product-detail-price',
    originalPrice:
      'text-product-detail-original-price line-through ml-product-detail-original-price-margin',
    description:
      'text-product-detail-description mb-product-detail-description-margin',
    variantSection: 'mb-product-detail-variant-margin',
    variantLabel:
      'text-product-detail-variant-label font-product-detail-variant-label mb-product-detail-variant-label-margin',
    quantitySection: 'mb-product-detail-quantity-margin',
    quantityWrapper: 'flex items-center gap-product-detail-quantity-gap',
    quantityLabel: 'text-product-detail-quantity-label',
    actionSection:
      'flex gap-product-detail-action-gap mb-product-detail-action-margin',
    stockInfo:
      'flex items-center gap-product-detail-stock-gap text-product-detail-stock',
    tabsSection: 'mt-product-detail-tabs-margin',
    relatedSection: 'mt-product-detail-related-margin',
  },
})

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const styles = productDetailVariants()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const toast = useToast()

  const { price, badges, stockStatus } = extractProductData(product)

  // Get available sizes and colors from variants
  const sizes =
    product.options?.find((opt) => opt.title === 'Size')?.values || []
  const colors =
    product.options?.find((opt) => opt.title === 'Color')?.values || []

  // Get related products
  const relatedProducts = getRelatedProducts(product, mockProducts, 4)

  const tabItems = [
    {
      value: 'description',
      label: 'Description',
      content: (
        <div className="prose max-w-none">
          <p>{product.description}</p>
          <h4 className="font-bold">Features:</h4>
          <ul>
            <li>Premium quality materials</li>
            <li>Comfortable fit</li>
            <li>Machine washable</li>
            <li>Available in multiple sizes</li>
          </ul>
        </div>
      ),
    },
    {
      value: 'details',
      label: 'Product Details',
      content: (
        <Accordion
          items={[
            {
              id: 'materials',
              value: 'materials',
              title: 'Materials & Care',
              content:
                'Made from 100% organic cotton. Machine wash cold, tumble dry low.',
            },
            {
              id: 'shipping',
              value: 'shipping',
              title: 'Shipping & Returns',
              content:
                'Free shipping on orders over €50. 30-day return policy.',
            },
            {
              id: 'sizing',
              value: 'sizing',
              title: 'Size Guide',
              content:
                'True to size. See our size chart for detailed measurements.',
            },
          ]}
        />
      ),
    },
    {
      value: 'reviews',
      label: 'Reviews (24)',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Rating value={4.5} readOnly />
            <span>4.5 out of 5</span>
          </div>
          <p className="text-gray-600 text-sm">
            No reviews yet. Be the first to review!
          </p>
        </div>
      ),
    },
  ]

  const carouselImages =
    product.images?.map((img, idx) => ({
      id: `image-${idx}`,
      src: img.url,
      alt: product.title,
    })) || []

  return (
    <div className={styles.root()}>
      <div className={styles.container()}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb()}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.title, href: `/products/${product.handle}` },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className={styles.content()}>
          {/* Image Section */}
          <div className={styles.imageSection()}>
            <Carousel
              slides={carouselImages}
              slideCount={carouselImages.length}
              aspectRatio="portrait"
              loop
            />
          </div>

          {/* Info Section */}
          <div className={styles.infoSection()}>
            {/* Badges */}
            {badges.length > 0 && (
              <div className={styles.badgeContainer()}>
                {badges.map((badge, idx) => (
                  <Badge key={idx} {...badge} />
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className={styles.title()}>{product.title}</h1>

            {/* Rating */}
            <div className={styles.ratingWrapper()}>
              <Rating value={4.5} readOnly />
              <span className={styles.ratingText()}>(24 reviews)</span>
            </div>

            {/* Price */}
            <div className={styles.priceSection()}>
              <span className={styles.price()}>{price?.calculated_price}</span>
              {price?.original_price &&
                price.original_price !== price.calculated_price && (
                  <span className={styles.originalPrice()}>
                    {price.original_price}
                  </span>
                )}
            </div>

            {/* Description */}
            <p className={styles.description()}>{product.description}</p>

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className={styles.variantSection()}>
                <label htmlFor="size" className={styles.variantLabel()}>
                  Size
                </label>
                <Select
                  value={selectedSize ? [selectedSize] : []}
                  options={sizes.map((size) => ({ value: size, label: size }))}
                  placeholder="Select size"
                  onValueChange={(details) =>
                    setSelectedSize(details.value[0] || '')
                  }
                />
              </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className={styles.variantSection()}>
                <label htmlFor="color" className={styles.variantLabel()}>
                  Color
                </label>
                <Select
                  value={selectedColor ? [selectedColor] : []}
                  options={colors.map((color) => ({
                    value: color,
                    label: color,
                  }))}
                  placeholder="Select color"
                  onValueChange={(details) =>
                    setSelectedColor(details.value[0] || '')
                  }
                />
              </div>
            )}

            {/* Quantity */}
            <div className={styles.quantitySection()}>
              <div className={styles.quantityWrapper()}>
                <span className={styles.quantityLabel()}>Quantity:</span>
                <NumericInput
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={10}
                />
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionSection()}>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={stockStatus === 'out-of-stock'}
                icon="icon-[mdi--cart-plus]"
                onClick={() => {
                  // Validate size/color selection if required
                  if (sizes.length > 0 && !selectedSize) {
                    alert('Please select a size')
                    return
                  }
                  if (colors.length > 0 && !selectedColor) {
                    alert('Please select a color')
                    return
                  }

                  // Add to cart
                  addItem(product, {
                    size: selectedSize,
                    color: selectedColor,
                    quantity,
                  })

                  // Show success toast
                  toast.create({
                    title: 'Added to cart',
                    description: `${product.title} has been added to your cart.`,
                    type: 'success',
                  })
                }}
              >
                {stockStatus === 'out-of-stock'
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
            <div className={styles.stockInfo()}>
              {stockStatus === 'in-stock' && (
                <>
                  <Icon
                    icon="icon-[mdi--check-circle]"
                    className="text-green-600"
                  />
                  <span>In stock and ready to ship</span>
                </>
              )}
              {stockStatus === 'low-stock' && (
                <>
                  <Icon
                    icon="icon-[mdi--alert-circle]"
                    className="text-orange-600"
                  />
                  <span>Only a few left in stock</span>
                </>
              )}
              {stockStatus === 'out-of-stock' && (
                <>
                  <Icon
                    icon="icon-[mdi--close-circle]"
                    className="text-red-600"
                  />
                  <span>Currently out of stock</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className={styles.tabsSection()}>
          <Tabs items={tabItems} defaultValue="description" />
        </div>

        {/* Related Products */}
        <div className={styles.relatedSection()}>
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
