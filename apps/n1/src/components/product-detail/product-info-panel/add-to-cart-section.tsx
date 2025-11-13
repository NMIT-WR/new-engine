'use client'

import { useState } from 'react'
import { useAddToCart, useCart, useCreateCart } from '@/hooks/use-cart'
import { useRegion } from '@/hooks/use-region'
import type { ProductDetail, ProductVariantDetail } from '@/types/product'
import { Button } from '@new-engine/ui/atoms/button'
import { NumericInput } from '@new-engine/ui/atoms/numeric-input'
import { slugify } from '@new-engine/ui/utils'

export const AddToCartSection = ({
  selectedVariant,
  detail,
}: {
  selectedVariant: ProductVariantDetail
  detail: ProductDetail
}) => {
  const [quantity, setQuantity] = useState(1)
  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { mutate: createCart, isPending: isCreating } = useCreateCart()
  const { data: cart } = useCart()
  const { regionId } = useRegion()

  const handleAddToCart = async () => {
    // Validate region context
    if (!regionId) {
      console.error('Cannot add to cart without region context')
      return
    }

    // Validate variant selection
    if (!selectedVariant?.id) {
      console.error('No variant selected')
      return
    }

    // Check stock availability
    if (selectedVariant.inventory_quantity && quantity > selectedVariant.inventory_quantity) {
      console.error(`Only ${selectedVariant.inventory_quantity} items in stock`)
      return
    }

    // Get or create cart
    let cartId = cart?.id

    if (!cartId) {
      // Create new cart if none exists
      createCart(undefined, {
        onSuccess: (newCart) => {
          // Add to the newly created cart
          addToCart(
            {
              cartId: newCart.id,
              variantId: selectedVariant.id,
              quantity,
            },
            {
              onSuccess: () => {
                console.log(`Added ${quantity}x ${detail.title} to cart`)
                // Reset quantity after successful add
                setQuantity(1)

                // Dispatch event to open cart popover (optional)
                const event = new CustomEvent('open-cart')
                window.dispatchEvent(event)
              },
              onError: (error) => {
                console.error('Failed to add to cart:', error)
              },
            }
          )
        },
        onError: (error) => {
          console.error('Failed to create cart:', error)
        }
      })
    } else {
      // Add to existing cart
      addToCart(
        {
          cartId,
          variantId: selectedVariant.id,
          quantity,
        },
        {
          onSuccess: () => {
            console.log(`Added ${quantity}x ${detail.title} to cart`)
            // Reset quantity after successful add
            setQuantity(1)

            // Dispatch event to open cart popover (optional)
            const event = new CustomEvent('open-cart')
            window.dispatchEvent(event)
          },
          onError: (error) => {
            console.error('Failed to add to cart:', error)
          },
        }
      )
    }
  }

  // Check if item is already in cart
  const itemInCart = cart?.items?.find(
    item => item.variant_id === selectedVariant?.id
  )

  const maxQuantity = selectedVariant?.inventory_quantity || 99
  const isPending = isAdding || isCreating

  return (
    <div className="flex gap-200">
      <NumericInput
        id={`${slugify(detail.title)}-number-input`}
        min={1}
        max={maxQuantity}
        allowOverflow={false}
        allowMouseWheel={true}
        value={quantity}
        onValueChange={(details) => setQuantity(Number(details.value))}
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
        {itemInCart && (
          <span className="ml-2 text-xs opacity-70">
            ({itemInCart.quantity} v košíku)
          </span>
        )}
      </Button>
    </div>
  )
}