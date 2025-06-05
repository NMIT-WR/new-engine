'use client'

import { useState } from 'react'
import { Badge, type BadgeProps } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Rating } from 'ui/src/atoms/rating'
import { NumericInput } from 'ui/src/molecules/numeric-input'
import { useToast } from 'ui/src/molecules/toast'
import { ColorSwatch } from '../atoms/color-swatch'
import { FilterButton } from '../atoms/filter-button'
import { useCart } from '../../hooks/use-cart'
import type { Product, ProductVariant } from '../../types/product'
import { getColorHex } from '../../utils/color-map'
import { tv } from 'ui/src/utils'

const productInfoStyles = tv({
  slots: {
    root: 'flex flex-col',
    badgeContainer: 'mb-product-info-badge-margin flex flex-wrap gap-product-info-badge-gap',
    title: 'text-product-info-title font-product-info-title mb-product-info-title-margin',
    ratingContainer: 'flex items-center gap-product-info-rating-gap mb-product-info-rating-margin',
    ratingText: 'text-product-info-rating-text',
    priceContainer: 'mb-product-info-price-margin',
    price: 'text-product-info-price font-product-info-price',
    originalPrice: 'text-product-info-original-price line-through ml-product-info-original-price-margin',
    description: 'text-product-info-description mb-product-info-description-margin',
    skuInfo: 'text-product-info-variant-label text-product-info-variant-label mb-product-info-variant-margin',
    variantSection: 'mb-product-info-variant-margin',
    variantLabel: 'text-product-info-variant-label font-product-info-variant-label mb-product-info-variant-label-margin',
    variantOptions: 'flex flex-wrap gap-product-info-variant-gap',
    quantitySection: 'mb-product-info-quantity-margin',
    quantityContainer: 'flex items-center gap-product-info-quantity-gap',
    quantityLabel: 'text-product-info-quantity-label',
    actionContainer: 'flex gap-product-info-action-gap mb-product-info-action-margin',
    stockInfo: 'flex items-center gap-product-info-stock-gap text-product-info-stock',
    stockIconSuccess: 'text-product-info-stock-success',
    stockIconWarning: 'text-product-info-stock-warning',
    stockIconError: 'text-product-info-stock-error',
  },
})

interface ProductInfoProps {
  product: Product
  selectedVariant: ProductVariant | null
  badges: BadgeProps[]
  price: any
  onVariantChange: (variant: ProductVariant) => void
}

export function ProductInfo({ 
  product, 
  selectedVariant,
  badges,
  price,
  onVariantChange
}: ProductInfoProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    return selectedVariant?.options || {}
  })
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const toast = useToast()
  
  const {
    root,
    badgeContainer,
    title,
    ratingContainer,
    ratingText,
    priceContainer,
    price: priceClass,
    originalPrice,
    description,
    skuInfo,
    variantSection,
    variantLabel,
    variantOptions,
    quantitySection,
    quantityContainer,
    quantityLabel,
    actionContainer,
    stockInfo,
    stockIconSuccess,
    stockIconWarning,
    stockIconError,
  } = productInfoStyles()

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
      onVariantChange(newVariant)
    }
  }

  const handleAddToCart = () => {
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
  }

  return (
    <div className={root()}>
      {/* Badges */}
      {badges.length > 0 && (
        <div className={badgeContainer()}>
          {badges.map((badge, idx) => (
            <Badge key={idx} {...badge} />
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className={title()}>{product.title}</h1>

      {/* Rating */}
      {product.rating && (
        <div className={ratingContainer()}>
          <Rating value={product.rating} readOnly />
          <span className={ratingText()}>
            ({product.reviewCount || 0} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className={priceContainer()}>
        <span className={priceClass()}>
          {selectedVariant?.prices?.[0]?.calculated_price || price?.calculated_price}
        </span>
        {selectedVariant?.prices?.[0]?.original_price &&
          selectedVariant.prices[0].original_price !== selectedVariant.prices[0].calculated_price && (
            <span className={originalPrice()}>
              {selectedVariant.prices[0].original_price}
            </span>
          )}
      </div>

      {/* Description */}
      <p className={description()}>
        {product.description}
      </p>

      {/* SKU and Stock Info */}
      {selectedVariant && (
        <div className={skuInfo()}>
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
          <div key={option.id} className={variantSection()}>
            <label className={variantLabel()}>
              {option.title}
            </label>
            
            {isColor ? (
              /* Color swatches */
              <div className={variantOptions()}>
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
              <div className={variantOptions()}>
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
      <div className={quantitySection()}>
        <div className={quantityContainer()}>
          <span className={quantityLabel()}>Quantity:</span>
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
      <div className={actionContainer()}>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={selectedVariant?.inventory_quantity === 0}
          icon="icon-[mdi--cart-plus]"
          onClick={handleAddToCart}
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
      <div className={stockInfo()}>
        {selectedVariant && selectedVariant.inventory_quantity !== undefined && (
          <>
            {selectedVariant.inventory_quantity > 5 && (
              <>
                <Icon
                  icon="icon-[mdi--check-circle]"
                  className={stockIconSuccess()}
                />
                <span>In stock and ready to ship</span>
              </>
            )}
            {selectedVariant.inventory_quantity > 0 && selectedVariant.inventory_quantity <= 5 && (
              <>
                <Icon
                  icon="icon-[mdi--alert-circle]"
                  className={stockIconWarning()}
                />
                <span>Only {selectedVariant.inventory_quantity} left in stock</span>
              </>
            )}
            {selectedVariant.inventory_quantity === 0 && (
              <>
                <Icon
                  icon="icon-[mdi--close-circle]"
                  className={stockIconError()}
                />
                <span>Currently out of stock</span>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}