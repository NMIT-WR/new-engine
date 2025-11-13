import { cacheConfig } from '@/lib/cache-config'
import { queryKeys } from '@/lib/query-keys'
import {
  addToCart,
  createCart,
  getCart,
  removeLineItem,
  updateLineItem,
} from '@/services/cart-service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { useRegion } from './use-region'

/**
 * Hook for accessing active cart
 * Works for both authenticated and guest users
 */
export function useCart() {
  // Remove authentication check - cart should work for everyone
  return useQuery({
    queryKey: queryKeys.cart.active(),
    queryFn: getCart,
    // Cart is always enabled - works for both guest and authenticated users
    enabled: true,
    ...cacheConfig.realtime, // 30s stale, 5min persist
  })
}

/**
 * Hook for creating new cart
 * Automatically uses current region
 */
export function useCreateCart() {
  const queryClient = useQueryClient()
  const { regionId } = useRegion()

  return useMutation({
    mutationFn: () => {
      if (!regionId) throw new Error('Region not available')
      return createCart(regionId)
    },
    onSuccess: (cart) => {
      // Update cart cache with new cart
      queryClient.setQueryData(queryKeys.cart.active(), cart)
    },
  })
}

/**
 * Hook for adding item to cart
 * Uses optimistic updates for instant UI feedback
 */
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cartId, variantId, quantity }: { cartId: string; variantId: string; quantity: number }) =>
      addToCart(cartId, variantId, quantity),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.active() })

      // Snapshot the previous cart
      const previousCart = queryClient.getQueryData(queryKeys.cart.active())

      // Optimistically update cart (best effort - we don't have full item data yet)
      // Real update will come from onSuccess
      // This is mainly to show loading state immediately

      return { previousCart }
    },
    onError: (err, variables, context) => {
      // Rollback to previous cart on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.active(), context.previousCart)
      }
    },
    onSuccess: (cart) => {
      // Update cart cache with real server response
      queryClient.setQueryData(queryKeys.cart.active(), cart)
    },
    onSettled: () => {
      // Always refetch to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() })
    },
  })
}

/**
 * Hook for updating line item quantity
 * Uses optimistic updates for instant UI feedback
 */
export function useUpdateLineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      cartId,
      lineItemId,
      quantity,
    }: {
      cartId: string
      lineItemId: string
      quantity: number
    }) => updateLineItem(cartId, lineItemId, quantity),
    onMutate: async ({ lineItemId, quantity }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.active() })

      // Snapshot previous cart
      const previousCart = queryClient.getQueryData(queryKeys.cart.active())

      // Optimistically update quantity
      queryClient.setQueryData(queryKeys.cart.active(), (old: any) => {
        if (!old || !old.items) return old

        return {
          ...old,
          items: old.items.map((item: any) =>
            item.id === lineItemId ? { ...item, quantity } : item
          ),
        }
      })

      return { previousCart }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.active(), context.previousCart)
      }
    },
    onSuccess: (cart) => {
      // Update with real server response (includes recalculated totals)
      queryClient.setQueryData(queryKeys.cart.active(), cart)
    },
    onSettled: () => {
      // Ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() })
    },
  })
}

/**
 * Hook for removing line item from cart
 * Uses optimistic updates for instant UI feedback
 */
export function useRemoveLineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cartId, lineItemId }: { cartId: string; lineItemId: string }) =>
      removeLineItem(cartId, lineItemId),
    onMutate: async ({ lineItemId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.active() })

      // Snapshot previous cart
      const previousCart = queryClient.getQueryData(queryKeys.cart.active())

      // Optimistically remove item
      queryClient.setQueryData(queryKeys.cart.active(), (old: any) => {
        if (!old || !old.items) return old

        return {
          ...old,
          items: old.items.filter((item: any) => item.id !== lineItemId),
        }
      })

      return { previousCart }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.active(), context.previousCart)
      }
    },
    onSuccess: (cart) => {
      // Update with real server response (includes recalculated totals)
      queryClient.setQueryData(queryKeys.cart.active(), cart)
    },
    onSettled: () => {
      // Ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.active() })
    },
  })
}
