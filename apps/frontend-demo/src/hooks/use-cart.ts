'use client'

import { useCurrentRegion } from '@/hooks/use-region'
import { cacheConfig } from '@/lib/cache-config'
import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useToast } from 'ui/src/molecules/toast'

const CART_ID_KEY = 'medusa_cart_id'

// Cart hook using React Query
export function useMedusaCart() {
  const { region } = useCurrentRegion()
  const queryClient = useQueryClient()
  const toast = useToast()
  const [isOpen, setIsOpen] = useState(false)

  // Get or create cart
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.cart(
      typeof window !== 'undefined'
        ? localStorage.getItem(CART_ID_KEY) || undefined
        : undefined
    ),
    queryFn: async () => {
      const cartId =
        typeof window !== 'undefined' ? localStorage.getItem(CART_ID_KEY) : null

      if (cartId) {
        try {
          const { cart } = await sdk.store.cart.retrieve(cartId)
          console.log(
            '[Cart Hook] Retrieved cart:',
            cart.id,
            'with',
            cart.items?.length || 0,
            'items'
          )

          // If cart region doesn't match current region, update it instead of creating new
          if (region && cart.region_id !== region.id) {
            console.log(
              '[Cart Hook] Updating cart region from',
              cart.region_id,
              'to',
              region.id
            )
            const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
              region_id: region.id,
            })
            return updatedCart
          }

          return cart
        } catch (err: any) {
          console.error('[Cart Hook] Failed to retrieve cart:', err)
          // Only remove cart ID if it's a 404 (cart not found)
          if (err?.status === 404 || err?.response?.status === 404) {
            console.log(
              '[Cart Hook] Cart not found (404), removing from localStorage'
            )
            if (typeof window !== 'undefined') {
              localStorage.removeItem(CART_ID_KEY)
            }
          } else {
            // For other errors, don't remove cart ID - might be network issue
            console.log(
              '[Cart Hook] Non-404 error, keeping cart ID in localStorage'
            )
            throw err
          }
        }
      }

      // Create new cart
      if (!region) {
        throw new Error('No region available')
      }

      const { cart: newCart } = await sdk.store.cart.create({
        region_id: region.id,
      })

      console.log('[Cart Hook] Created new cart:', newCart.id)
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_ID_KEY, newCart.id)
      }
      return newCart
    },
    enabled: !!region,
    ...cacheConfig.realtime, // 30s stale, 5m gc, refetch on focus
    retry: (failureCount, error: any) => {
      // Don't retry if cart was not found
      if (error?.status === 404) return false
      // Retry up to 3 times for other errors
      return failureCount < 3
    },
  })

  // Update cart region when region changes
  useEffect(() => {
    // Disabled automatic region update - handled in query function
    // This prevents unnecessary cart updates and potential data loss
    /*
    if (cart && region && cart.region_id !== region.id) {
      updateRegionMutation.mutate(region.id)
    }
    */
  }, [cart?.region_id, region?.id])

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async ({
      variantId,
      quantity = 1,
    }: { variantId: string; quantity?: number }) => {
      if (!cart) throw new Error('No cart available')

      const { cart: updatedCart } = await sdk.store.cart.createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
        }
      )
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(updatedCart.id), updatedCart)
      toast.create({
        title: 'Added to cart',
        description: 'Item has been added to your cart',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toast.create({
        title: 'Failed to add item',
        description: error.message,
        type: 'error',
      })
    },
  })

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      lineItemId,
      quantity,
    }: { lineItemId: string; quantity: number }) => {
      if (!cart) throw new Error('No cart available')

      if (quantity <= 0) {
        await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
        const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id)
        return updatedCart
      }

      const { cart: updatedCart } = await sdk.store.cart.updateLineItem(
        cart.id,
        lineItemId,
        { quantity }
      )
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(updatedCart.id), updatedCart)
    },
    onError: (error: Error) => {
      toast.create({
        title: 'Failed to update quantity',
        description: error.message,
        type: 'error',
      })
    },
  })

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (lineItemId: string) => {
      if (!cart) throw new Error('No cart available')

      await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id)
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(updatedCart.id), updatedCart)
      toast.create({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toast.create({
        title: 'Failed to remove item',
        description: error.message,
        type: 'error',
      })
    },
  })

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!cart) throw new Error('No cart available')

      // Remove all items
      for (const item of cart.items || []) {
        await sdk.store.cart.deleteLineItem(cart.id, item.id)
      }

      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id)
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(updatedCart.id), updatedCart)
      toast.create({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
        type: 'success',
      })
    },
  })

  // Apply discount mutation
  const applyDiscountMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!cart) throw new Error('No cart available')

      // @ts-ignore - Medusa v2 types might not be fully updated
      const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
        promo_codes: [code],
      })
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(updatedCart.id), updatedCart)
      toast.create({
        title: 'Discount applied',
        description: 'Your discount code has been applied',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toast.create({
        title: 'Invalid discount code',
        description: error.message,
        type: 'error',
      })
    },
  })

  // Update region mutation (internal use)
  const updateRegionMutation = useMutation({
    mutationFn: async (regionId: string) => {
      if (!cart) throw new Error('No cart available')

      const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
        region_id: regionId,
      })
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(updatedCart.id), updatedCart)
    },
  })

  return {
    // Cart data
    cart,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,

    // UI state
    isOpen,
    toggleCart: () => setIsOpen((prev) => !prev),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),

    // Actions
    addItem: (variantId: string, quantity?: number) =>
      addItemMutation.mutate({ variantId, quantity }),
    updateQuantity: (lineItemId: string, quantity: number) =>
      updateQuantityMutation.mutate({ lineItemId, quantity }),
    removeItem: (lineItemId: string) => removeItemMutation.mutate(lineItemId),
    clearCart: () => clearCartMutation.mutate(),
    applyDiscount: (code: string) => applyDiscountMutation.mutate(code),
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(cart?.id) }),

    // Mutations for direct access
    addItemMutation,
    updateQuantityMutation,
    removeItemMutation,
    clearCartMutation,
    applyDiscountMutation,

    // Computed values
    itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    subtotal: cart?.subtotal || 0,
    tax: cart?.tax_total || 0,
    shipping: cart?.shipping_total || 0,
    discount: cart?.discount_total || 0,
    total: cart?.total || 0,
    items: cart?.items || [],
  }
}

// Re-export as default hook
export { useMedusaCart as useCart }
