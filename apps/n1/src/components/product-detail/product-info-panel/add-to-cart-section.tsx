'use client'
import { useLeadhub } from '@libs/analytics/leadhub'
import { useMetaPixel } from '@libs/analytics/meta'
import { useAddToCart, useCart } from '@/hooks/use-cart'
import { useRegion } from '@/hooks/use-region'
import { useCartToast } from '@/hooks/use-toast'
import type { ProductDetail, ProductVariantDetail } from '@/types/product'
import { validateAddToCart } from '@/utils/cart/cart-validation'
import { Button } from '@techsio/ui-kit/atoms/button'
import { NumericInput } from '@techsio/ui-kit/atoms/numeric-input'
import { slugify } from '@techsio/ui-kit/utils'
import { useState } from 'react'

export const AddToCartSection = ({
  selectedVariant,
  detail,
}: {
  selectedVariant: ProductVariantDetail
  detail: ProductDetail
}) => {
  const [quantity, setQuantity] = useState(1)
  const { mutate: addToCart, isPending } = useAddToCart()
  const { cart } = useCart()
  const { regionId } = useRegion()
  const toast = useCartToast()
  const { trackAddToCart } = useMetaPixel()
  const { trackSetCart } = useLeadhub()

  const handleAddToCart = async () => {
    // Validate region context
    if (!regionId) {
      toast.cartError('Nelze přidat do košíku bez regionálního kontextu')
      return
    }

    // Validate variant selection
    if (!selectedVariant?.id) {
      toast.cartError('Žádná varianta není vybrána')
      return
    }

    // Validate stock availability (checks current cart + new quantity)
    const validation = validateAddToCart({
      cart,
      variantId: selectedVariant.id,
      quantity,
      inventoryQuantity: selectedVariant.inventory_quantity,
    })

    if (!validation.valid) {
      toast.stockWarningWithDetails(
        validation.availableQuantity,
        validation.requestedTotal
      )
      return
    }

    addToCart(
      {
        variantId: selectedVariant.id,
        quantity,
        autoCreateCart: true,
        metadata: {
          inventory_quantity: selectedVariant.inventory_quantity || 0,
        },
      },
      {
        onSuccess: () => {
          // Meta Pixel - AddToCart tracking
          trackAddToCart({
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: detail.title,
            currency: (
              selectedVariant.calculated_price?.currency_code ?? 'CZK'
            ).toUpperCase(),
            value:
              (selectedVariant.calculated_price?.calculated_amount_with_tax ??
                0) * quantity,
            contents: [
              {
                id: selectedVariant.id,
                quantity,
              },
            ],
          })

          // Leadhub - SetCart tracking
          // Note: Leadhub expects the full cart state, but here we track the added item
          // For full cart sync, consider tracking in a cart provider/effect
          trackSetCart({
            products: [
              {
                product_id: selectedVariant.id,
                quantity,
                value:
                  selectedVariant.calculated_price?.calculated_amount_with_tax ?? 0,
                currency: (
                  selectedVariant.calculated_price?.currency_code ?? 'CZK'
                ).toUpperCase(),
              },
            ],
          })

          toast.addedToCart(detail.title, quantity)
          // Reset quantity after successful add
          setQuantity(1)

          // Dispatch event to open cart popover (optional)
          const event = new CustomEvent('open-cart')
          window.dispatchEvent(event)
        },
        onError: (error) => {
          if (error.message?.includes('stock')) {
            toast.stockWarning()
          } else if (error.message?.includes('network')) {
            toast.networkError()
          } else {
            toast.cartError(error.message)
          }
        },
      }
    )
  }

  const maxQuantity = selectedVariant?.inventory_quantity || 99
  return (
    <div className="flex gap-200">
      <NumericInput
        id={`${slugify(detail.title)}-number-input`}
        min={1}
        max={maxQuantity}
        allowOverflow={false}
        defaultValue={1}
        allowMouseWheel={true}
        value={quantity}
        onChange={setQuantity}
        disabled={isPending}
      >
        <NumericInput.DecrementTrigger />
        <NumericInput.Control className="w-12">
          <NumericInput.Input />
        </NumericInput.Control>
        <NumericInput.IncrementTrigger />
      </NumericInput>
      <Button
        variant="secondary"
        onClick={handleAddToCart}
        disabled={isPending || !selectedVariant?.id || !regionId}
      >
        {isPending ? 'Přidávám...' : 'Přidat do košíku'}
      </Button>
    </div>
  )
}
