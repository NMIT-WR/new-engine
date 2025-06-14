'use client'

import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { useCurrentRegion } from '@/hooks/use-region'
import type { HttpTypes } from '@medusajs/types'
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
  const { data: cart, isLoading, error } = useQuery({
    queryKey: queryKeys.cart(),
    queryFn: async () => {
      const cartId = localStorage.getItem(CART_ID_KEY)

      if (cartId) {
        try {
          const { cart } = await sdk.store.cart.retrieve(cartId, {
            fields: '*items.variant.product,*items.variant.calculated_price',
          })
          return cart
        } catch (err) {
          // Cart not found, will create new one below
          localStorage.removeItem(CART_ID_KEY)
        }
      }

      // Create new cart
      if (!region) {
        throw new Error('No region available')
      }

      const { cart: newCart } = await sdk.store.cart.create({
        region_id: region.id,
      })

      localStorage.setItem(CART_ID_KEY, newCart.id)
      return newCart
    },
    enabled: !!region,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update cart region when region changes
  useEffect(() => {
    if (cart && region && cart.region_id !== region.id) {
      updateRegionMutation.mutate(region.id)
    }
  }, [cart?.region_id, region?.id])

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) => {
      if (!cart) throw new Error('No cart available')
      
      const { cart: updatedCart } = await sdk.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(), updatedCart)
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
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      if (!cart) throw new Error('No cart available')
      
      if (quantity <= 0) {
        await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
        const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id, {
          fields: '*items.variant.product,*items.variant.calculated_price',
        })
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
      queryClient.setQueryData(queryKeys.cart(), updatedCart)
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
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id, {
        fields: '*items.variant.product,*items.variant.calculated_price',
      })
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(), updatedCart)
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
      
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id, {
        fields: '*items.variant.product,*items.variant.calculated_price',
      })
      return updatedCart
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart(), updatedCart)
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
      queryClient.setQueryData(queryKeys.cart(), updatedCart)
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
      queryClient.setQueryData(queryKeys.cart(), updatedCart)
    },
  })

  return {
    // Cart data
    cart,
    isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    
    // UI state
    isOpen,
    toggleCart: () => setIsOpen(prev => !prev),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    
    // Actions
    addItem: (variantId: string, quantity?: number) => 
      addItemMutation.mutate({ variantId, quantity }),
    updateQuantity: (lineItemId: string, quantity: number) => 
      updateQuantityMutation.mutate({ lineItemId, quantity }),
    removeItem: (lineItemId: string) => 
      removeItemMutation.mutate(lineItemId),
    clearCart: () => clearCartMutation.mutate(),
    applyDiscount: (code: string) => applyDiscountMutation.mutate(code),
    refetch: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart() }),
    
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