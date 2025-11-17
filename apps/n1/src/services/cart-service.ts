import { isNotFoundError, logError } from '@/lib/errors'
import { sdk } from '@/lib/medusa-client'
import type { HttpTypes } from '@medusajs/types'

export type Cart = HttpTypes.StoreCart
export type CartLineItem = HttpTypes.StoreCartLineItem
export type CartCreateResponse = HttpTypes.StoreCartResponse
export type CartUpdateResponse = HttpTypes.StoreCartResponse
export type OptimisticCart = Cart & { _optimistic?: boolean }
export type OptimisticLineItem = CartLineItem & {
  _optimistic?: boolean
}

// Single cart storage key - Medusa handles guest/auth distinction
const CART_ID_KEY = 'n1_cart_id'
export const cartStorage = {
  getCartId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(CART_ID_KEY)
  },

  setCartId(cartId: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(CART_ID_KEY, cartId)
  },

  clearCartId(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(CART_ID_KEY)
  },
}

export async function getCart(): Promise<Cart | null> {
  try {
    const cartId = cartStorage.getCartId()

    if (!cartId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[CartService] No cart ID found')
      }
      return null
    }

    const { cart } = await sdk.store.cart.retrieve(cartId)

    if (!cart) {
      throw new Error('Cart retrieved but empty')
    }

    return cart
  } catch (error) {
    if (isNotFoundError(error)) {
      logError('CartService', 'Cart not found, clearing stored ID')
      cartStorage.clearCartId()
      return null
    }
    logError('CartService', 'Failed to fetch cart')
    throw error
  }
}

export async function createCart(
  regionId: string,
  options?: {
    email?: string
    salesChannelId?: string
  }
): Promise<Cart> {
  try {
    if (!regionId) {
      throw new Error('Region ID is required')
    }

    const response = await sdk.store.cart.create({
      region_id: regionId,
      email: options?.email,
      sales_channel_id: options?.salesChannelId,
    })

    if (!response.cart) {
      throw new Error('Failed to create cart - no cart returned')
    }

    cartStorage.setCartId(response.cart.id)

    if (process.env.NODE_ENV === 'development') {
      console.log('[CartService] Cart created:', response.cart.id)
    }

    return response.cart
  } catch (error) {
    logError('CartService', 'Failed to create cart')
    throw error
  }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
  metadata?: Record<string, unknown>
): Promise<Cart> {
  try {
    if (!cartId || !variantId) {
      throw new Error('Cart ID and Variant ID are required')
    }

    if (quantity < 1) {
      throw new Error('Quantity must be at least 1')
    }

    const response = await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
      metadata,
    })

    if (!response.cart) {
      throw new Error('Failed to add item - no cart returned')
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[CartService] Item added to cart:', {
        variantId,
        quantity,
        metadata,
      })
    }

    return response.cart
  } catch (error) {
    logError('CartService', 'Failed to add to cart')
    throw error
  }
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<Cart> {
  try {
    if (!cartId || !lineItemId) {
      throw new Error('Cart ID and Line Item ID are required')
    }

    if (quantity < 1) {
      throw new Error('Quantity must be at least 1')
    }

    const response = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
      quantity,
    })

    if (!response.cart) {
      throw new Error('Failed to update item - no cart returned')
    }

    return response.cart
  } catch (error) {
    logError('CartService', 'Failed to update line item')
    throw error
  }
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<Cart> {
  try {
    if (!cartId || !lineItemId) {
      throw new Error('Cart ID and Line Item ID are required')
    }

    const response = await sdk.store.cart.deleteLineItem(cartId, lineItemId)

    if (!response.parent) {
      throw new Error('Failed to retrieve updated cart')
    }

    return response.parent
  } catch (error) {
    logError('CartService', 'Failed to remove line item')
    throw error
  }
}
