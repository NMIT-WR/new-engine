'use client'

import { useCurrentRegion } from '@/hooks/use-region'
import { sdk } from '@/lib/medusa-client'
import { queryKeys } from '@/lib/query-keys'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

const CART_ID_KEY = 'medusa_cart_id'

export function CartPrefetch() {
  const queryClient = useQueryClient()
  const { region } = useCurrentRegion()

  useEffect(() => {
    if (!region) return

    // Prefetch cart data
    queryClient.prefetchQuery({
      queryKey: queryKeys.cart(
        typeof window !== 'undefined'
          ? localStorage.getItem(CART_ID_KEY) || undefined
          : undefined
      ),
      queryFn: async () => {
        const cartId =
          typeof window !== 'undefined'
            ? localStorage.getItem(CART_ID_KEY)
            : null

        if (cartId) {
          try {
            const { cart } = await sdk.store.cart.retrieve(cartId)
            console.log(
              '[Cart Prefetch] Retrieved cart:',
              cart.id,
              'with',
              cart.items?.length || 0,
              'items'
            )
            return cart
          } catch (err) {
            // Cart not found, will create new one below
            console.error('[Cart Prefetch] Failed to retrieve cart:', err)
            localStorage.removeItem(CART_ID_KEY)
          }
        }

        // Create new cart
        const { cart: newCart } = await sdk.store.cart.create({
          region_id: region.id,
        })

        localStorage.setItem(CART_ID_KEY, newCart.id)
        return newCart
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })
  }, [queryClient, region])

  return null
}
