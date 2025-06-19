'use client'

import { useCurrentRegion } from '@/hooks/use-region'
import { cacheConfig } from '@/lib/cache-config'
import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { cartStore, setCartId, openCart, closeCart, toggleCart } from '@/stores/cart-store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { useToast } from '@ui/molecules/toast'

// Cart hook using React Query
export function useMedusaCart() {
  const { region } = useCurrentRegion()
  const queryClient = useQueryClient()
  const toast = useToast()
  const cartState = useStore(cartStore)
  const cartId = cartState.cartId
  const isOpen = cartState.isOpen

  // Get or create cart
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.cart(cartId || undefined),
    queryFn: async () => {
      if (cartId) {
        try {
          const { cart } = await sdk.store.cart.retrieve(cartId)

          // If cart region doesn't match current region, update it instead of creating new
          if (region && cart.region_id !== region.id) {
            const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
              region_id: region.id,
            })
            return updatedCart
          }

          return cart
        } catch (err: any) {
          // Only remove cart ID if it's a 404 (cart not found)
          if (err?.status === 404 || err?.response?.status === 404) {
            setCartId(null)
          } else {
            // For other errors, don't remove cart ID - might be network issue
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

      setCartId(newCart.id)
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
      openCart()
    },
    onError: (error: any) => {

      // Parse error message for specific inventory issue
      const errorMessage =
        error?.message || error?.response?.data?.message || 'Unknown error'

      if (errorMessage.toLowerCase().includes('inventory')) {
        toast.create({
          title: 'Out of Stock',
          description:
            'This product variant is not available in the requested quantity.',
          type: 'error',
        })
      } else if (
        errorMessage.toLowerCase().includes('cart') &&
        errorMessage.toLowerCase().includes('not found')
      ) {
        // Cart was likely deleted or expired, clear localStorage and retry
        setCartId(null)
        toast.create({
          title: 'Cart expired',
          description: 'Your cart has expired. Please try again.',
          type: 'error',
        })
        // Invalidate cart query to trigger recreation
        queryClient.invalidateQueries({ queryKey: queryKeys.cart() })
      } else {
        toast.create({
          title: 'Failed to add item',
          description: errorMessage,
          type: 'error',
        })
      }
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
        title: 'Item removed',
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

      // Delete all line items
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
    onError: (error: Error) => {
      toast.create({
        title: 'Failed to clear cart',
        description: error.message,
        type: 'error',
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
    toggleCart,
    openCart,
    closeCart,

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