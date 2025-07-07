'use client'
import { useCart } from '@/hooks/use-cart'
import type { Product, ProductVariant } from '@/types/product'
import { Badge, type BadgeProps } from '@ui/atoms/badge'
import { Button } from '@ui/atoms/button'
import { Label } from '@ui/atoms/label'
import { Rating } from '@ui/atoms/rating'
import { NumericInput } from '@ui/molecules/numeric-input'
import { useToast } from '@ui/molecules/toast'
import { useState } from 'react'

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
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const toast = useToast()
  const productVariants = product.variants || []

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.create({
        title: 'Vyberte prosím možnosti',
        description:
          'Před přidáním do košíku vyberte prosím všechny možnosti produktu.',
        type: 'error',
      })
      return
    }

    // Add to cart with variant info
    // The success toast is handled by the cart hook
    addItem(selectedVariant.id, quantity)
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
            ({product.reviewCount || 0} recenzí)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="mb-product-info-price-margin">
        <span className="font-product-info-price text-product-info-price">
          {price}
        </span>
      </div>

      {/* Description */}
      <p className="mb-product-info-description-margin text-product-info-description">
        {product.description}
      </p>

      {/* SKU and Stock Info */}
      {selectedVariant && (
        <div className="mb-product-info-variant-margin text-product-info-variant-label">
          <p>Kód: {selectedVariant.sku}</p>
        </div>
      )}

      {/* Variant Selectors */}
      {productVariants.length > 0 && (
        <div className="mb-product-info-variant-margin">
          <Label className="mb-product-info-variant-label-margin font-product-info-variant-label text-product-info-variant-label">
            Velikosti
          </Label>

          {
            /* Size or other option buttons */
            <div className="flex flex-wrap gap-product-info-variant-gap">
              {productVariants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id

                return (
                  <Button
                    key={variant.id}
                    theme={isSelected ? 'solid' : 'borderless'}
                    size="sm"
                    onClick={() => onVariantChange(variant)}
                    className="roundend-product-btn border"
                  >
                    {variant.title}
                  </Button>
                )
              })}
            </div>
          }
        </div>
      )}

      {/* Quantity */}
      <div className="mb-product-info-quantity-margin">
        <div className="flex items-center gap-product-info-quantity-gap">
          <span className="text-product-info-quantity-label">Množství:</span>
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
          icon="icon-[mdi--cart-plus]"
          onClick={handleAddToCart}
        >
          Přidat do košíku
        </Button>
        <Button variant="secondary" size="lg" icon="icon-[mdi--heart-outline]">
          <span className="sr-only">Přidat do seznamu přání</span>
        </Button>
      </div>
    </div>
  )
}
