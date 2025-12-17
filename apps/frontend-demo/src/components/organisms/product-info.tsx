'use client'
import { SafeHtmlContent } from '@/components/safe-html-content'
import { useCart } from '@/hooks/use-cart'
import type { Product, ProductVariant } from '@/types/product'
import { sortVariantsBySize } from '@/utils/variant-utils'
import { Badge, type BadgeProps } from '@ui/atoms/badge'
import { Button } from '@ui/atoms/button'
import { Label } from '@ui/atoms/label'
import { NumericInput } from '@ui/atoms/numeric-input'
import { Rating } from '@ui/atoms/rating'
import { useToast } from '@ui/molecules/toast'
import { useState } from 'react'

interface ProductInfoProps {
  product: Product
  selectedVariant: ProductVariant | null
  badges: BadgeProps[]
  price: string | number
  priceWithTax?: string | number
  onVariantChange: (variant: ProductVariant) => void
}

export function ProductInfo({
  product,
  selectedVariant,
  badges,
  price,
  priceWithTax,
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
    addItem(selectedVariant.id, validQuantity)
  }

  const validQuantity =
    typeof quantity === 'number' && !Number.isNaN(quantity) ? quantity : 1

  return (
    <div className="flex flex-col">
      {/* Badges */}
      {badges.length > 0 && (
        <div className="mb-product-info-badge-margin flex flex-wrap gap-product-info-badge-gap">
          {badges.map((badge, idx) => (
            <Badge key={`badge-${badge.variant}-${idx}`} {...badge} />
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="mb-product-info-title-margin font-product-info-title text-product-info-title-size">
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

      {/* Description */}
      <SafeHtmlContent
        content={product.description}
        className="mb-product-info-description-margin text-product-info-description"
      />

      {/* Variant Selectors */}
      {productVariants.length > 1 && (
        <div className="mb-product-info-variant-margin">
          <Label className="mb-product-info-variant-label-margin font-medium text-md">
            Vyberte Velikost
          </Label>

          {
            /* Size or other option buttons */
            <div className="flex flex-wrap gap-100">
              {sortVariantsBySize(productVariants).map((variant) => {
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

      {/* Price */}
      <div className="mb-product-info-price-margin flex flex-col gap-100">
        {!!priceWithTax && (
          <span className="font-product-info-price text-product-info-price-size">
            {priceWithTax}
          </span>
        )}
        <span className="text-fg-secondary text-sm">bez DPH {price}</span>
      </div>

      {/* Actions */}
      <div className="mb-product-info-action-margin flex gap-product-info-action-gap">
        <Button
          variant="primary"
          size="sm"
          className=""
          icon="icon-[mdi--cart-plus]"
          onClick={handleAddToCart}
        >
          Přidat do košíku
        </Button>{' '}
        <NumericInput
          value={validQuantity}
          onChange={setQuantity}
          min={1}
          max={10}
          hideControls={false}
          size="sm"
          className="h-fit w-24 py-0"
        />
        <Button variant="secondary" size="sm" icon="icon-[mdi--heart-outline]">
          <span className="sr-only">Přidat do seznamu přání</span>
        </Button>
      </div>
    </div>
  )
}
