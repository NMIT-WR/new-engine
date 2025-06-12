'use client'

import { ColorSwatch } from '@/components/atoms/color-swatch'
import { useCart } from '@/hooks/use-cart'
import type { Product, ProductVariant } from '@/types/product'
import { getColorHex } from '@/utils/color-map'
import { useState } from 'react'
import { Badge, type BadgeProps } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Label } from 'ui/src/atoms/label'
import { Rating } from 'ui/src/atoms/rating'
import { NumericInput } from 'ui/src/molecules/numeric-input'
import { useToast } from 'ui/src/molecules/toast'

interface ProductInfoProps {
  product: Product
  selectedVariant: ProductVariant | null
  badges: BadgeProps[]
  price: string
  onVariantChange: (variant: ProductVariant) => void
}

export function ProductInfo({
  product,
  selectedVariant,
  badges,
  price,
  onVariantChange,
}: ProductInfoProps) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    return selectedVariant?.options || {}
  })
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const toast = useToast()

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
    const newOptions = {
      ...selectedOptions,
      [optionTitle.toLowerCase()]: value,
    }
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
    addItem(selectedVariant.id, quantity)

    // Show success toast with variant details
    toast.create({
      title: 'Added to cart',
      description: `${product.title} (${selectedVariant.title}) has been added to your cart.`,
      type: 'success',
    })
  }

  return (
    <div className="flex flex-col">
      {/* Badges */}
      {badges.length > 0 && (
        <div className="mb-product-info-badge-margin flex flex-wrap gap-product-info-badge-gap">
          {badges.map((badge, idx) => (
            <Badge key={idx} {...badge} />
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="mb-product-info-title-margin font-product-info-title text-product-info-title">
        {product.title}
      </h1>

      {/* Rating */}
      {product.rating && (
        <div className="mb-product-info-rating-margin flex items-center gap-product-info-rating-gap">
          <Rating value={product.rating} readOnly />
          <span className="text-product-info-rating-text">
            ({product.reviewCount || 0} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="mb-product-info-price-margin">
        <span className="font-product-info-price text-product-info-price">
          {selectedVariant?.prices?.[0]?.calculated_price || price}
        </span>
        {selectedVariant?.prices?.[0]?.original_price &&
          selectedVariant.prices[0].original_price !==
            selectedVariant.prices[0].calculated_price && (
            <span className="ml-product-info-original-price-margin text-product-info-original-price line-through">
              {selectedVariant.prices[0].original_price}
            </span>
          )}
      </div>

      {/* Description */}
      <p className="mb-product-info-description-margin text-product-info-description">
        {product.description}
      </p>

      {/* SKU and Stock Info */}
      {selectedVariant && (
        <div className="mb-product-info-variant-margin text-product-info-variant-label">
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
          <div key={option.id} className="mb-product-info-variant-margin">
            <Label className="mb-product-info-variant-label-margin font-product-info-variant-label text-product-info-variant-label">
              {option.title}
            </Label>

            {isColor ? (
              /* Color swatches */
              <div className="flex flex-wrap gap-product-info-variant-gap">
                {option.values.map((value) => {
                  const variantWithColor = product.variants?.find(
                    (v) => v.options?.[optionKey] === value
                  )
                  const isSelected = selectedOptions[optionKey] === value
                  const colorHex =
                    variantWithColor?.colorHex || getColorHex(value)

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
              <div className="flex flex-wrap gap-product-info-variant-gap">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[optionKey] === value
                  const variantForOption = product.variants?.find(
                    (v) => v.options?.[optionKey] === value
                  )
                  const isOutOfStock =
                    variantForOption?.inventory_quantity === 0

                  return (
                    <Button
                      key={value}
                      theme={isSelected ? 'solid' : 'borderless'}
                      size="sm"
                      disabled={isOutOfStock}
                      onClick={() => handleOptionChange(option.title, value)}
                      className="roundend-product-btn border"
                    >
                      {value}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Quantity */}
      <div className="mb-product-info-quantity-margin">
        <div className="flex items-center gap-product-info-quantity-gap">
          <span className="text-product-info-quantity-label">Quantity:</span>
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
      <div className="mb-product-info-action-margin flex gap-product-info-action-gap">
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
        <Button variant="secondary" size="lg" icon="icon-[mdi--heart-outline]">
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>

      {/* Stock Info */}
      <div className="flex items-center gap-product-info-stock-gap text-product-info-stock">
        {selectedVariant &&
          selectedVariant.inventory_quantity !== undefined && (
            <>
              {selectedVariant.inventory_quantity > 5 && (
                <>
                  <Icon
                    icon="icon-[mdi--check-circle]"
                    className="text-product-info-stock-success"
                  />
                  <span>In stock and ready to ship</span>
                </>
              )}
              {selectedVariant.inventory_quantity > 0 &&
                selectedVariant.inventory_quantity <= 5 && (
                  <>
                    <Icon
                      icon="icon-[mdi--alert-circle]"
                      className="text-product-info-stock-warning"
                    />
                    <span>
                      Only {selectedVariant.inventory_quantity} left in stock
                    </span>
                  </>
                )}
              {selectedVariant.inventory_quantity === 0 && (
                <>
                  <Icon
                    icon="icon-[mdi--close-circle]"
                    className="text-product-info-stock-error"
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
