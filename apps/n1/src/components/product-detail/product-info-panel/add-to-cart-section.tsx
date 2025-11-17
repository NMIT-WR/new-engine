'use client'
import { useAddToCart } from '@/hooks/use-cart'
import { useRegion } from '@/hooks/use-region'
import { useCartToast } from '@/hooks/use-toast'
import type { ProductDetail, ProductVariantDetail } from '@/types/product'
import { Button } from '@new-engine/ui/atoms/button'
import { NumericInput } from '@new-engine/ui/atoms/numeric-input'
import { slugify } from '@new-engine/ui/utils'
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
  const { regionId } = useRegion()
  const toast = useCartToast()

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

    // Check stock availability
    if (
      selectedVariant.inventory_quantity &&
      quantity > selectedVariant.inventory_quantity
    ) {
      toast.stockWarning()
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
