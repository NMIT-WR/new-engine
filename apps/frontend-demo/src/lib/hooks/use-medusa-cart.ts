'use client'

import { useCart as useLocalCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { sdk } from '@/lib/medusa-client'
import type { HttpTypes } from '@medusajs/types'
import { useCallback, useEffect, useState } from 'react'

export function useMedusaCart() {
  const { user } = useAuth()
  const localCart = useLocalCart()
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize or retrieve cart
  const initializeCart = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const cartId = localStorage.getItem('medusa_cart_id')

      if (cartId) {
        // Try to retrieve existing cart
        try {
          const { cart } = await sdk.store.cart.retrieve(cartId, {
            fields: '*items.variant.product,*items.variant.calculated_price',
          })
          setCart(cart)
          return
        } catch (err) {
          // Cart not found, create new one
          localStorage.removeItem('medusa_cart_id')
        }
      }

      // Create new cart
      const { cart: newCart } = await sdk.store.cart.create({
        region_id: await getDefaultRegionId(),
      })

      localStorage.setItem('medusa_cart_id', newCart.id)
      setCart(newCart)

      // Sync local cart items to backend
      if (localCart.items.length > 0) {
        await syncLocalToBackend(newCart.id, localCart.items)
        localCart.clearCart() // Clear local storage after sync
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize cart')
    } finally {
      setIsLoading(false)
    }
  }, [localCart])

  // Add item to cart
  const addItem = async (variantId: string, quantity = 1) => {
    if (!cart) return

    try {
      setIsLoading(true)
      const { cart: updatedCart } = await sdk.store.cart.createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
        }
      )
      setCart(updatedCart)
    } catch (err: any) {
      setError(err.message || 'Failed to add item')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Update item quantity
  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (!cart) return

    try {
      setIsLoading(true)
      const { cart: updatedCart } = await sdk.store.cart.updateLineItem(
        cart.id,
        lineItemId,
        { quantity }
      )
      setCart(updatedCart)
    } catch (err: any) {
      setError(err.message || 'Failed to update quantity')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Remove item
  const removeItem = async (lineItemId: string) => {
    if (!cart) return

    try {
      setIsLoading(true)
      await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
      // Refetch cart after deletion
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id)
      setCart(updatedCart)
    } catch (err: any) {
      setError(err.message || 'Failed to remove item')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Apply discount code
  const applyDiscount = async (code: string) => {
    if (!cart) return

    try {
      setIsLoading(true)
      // Apply promo code - Medusa v2 uses promo_codes
      // This might need adjustment based on your Medusa setup
      const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
        // @ts-ignore - Medusa types might not be fully updated
        promo_codes: [code],
      })
      setCart(updatedCart)
    } catch (err: any) {
      setError(err.message || 'Failed to apply discount')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize on mount
  useEffect(() => {
    initializeCart()
  }, [initializeCart, user])

  return {
    cart,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    applyDiscount,
    refetch: initializeCart,
    // Computed values
    itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    subtotal: cart?.subtotal || 0,
    tax: cart?.tax_total || 0,
    total: cart?.total || 0,
  }
}

// Helper functions
async function getDefaultRegionId(): Promise<string> {
  const { regions } = await sdk.store.region.list()
  const euRegion = regions.find((r: any) => r.currency_code === 'eur')
  return euRegion?.id || regions[0].id
}

async function syncLocalToBackend(cartId: string, localItems: any[]) {
  for (const item of localItems) {
    try {
      await sdk.store.cart.createLineItem(cartId, {
        variant_id: item.variantId,
        quantity: item.quantity,
      })
    } catch (err) {
      console.error('Failed to sync item:', item, err)
    }
  }
}
