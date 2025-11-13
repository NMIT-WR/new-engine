import { sdk } from '@/lib/medusa-client'
import type { StoreCart } from '@medusajs/types'

// Export types for reuse in components/hooks
export type { StoreCart } from '@medusajs/types'

/**
 * Get active cart - for now we need to manage cart ID in localStorage
 * TODO: In future, implement server-side cart management for authenticated users
 */
export async function getCart(): Promise<StoreCart | null> {
  try {
    // Get cart ID from localStorage
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('n1_cart_id') : null
    
    if (!cartId) {
      // No cart ID stored yet
      return null
    }

    const { cart } = await sdk.store.cart.retrieve(cartId)

    return cart || null
  } catch (err: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CartService] Failed to fetch cart:', err)
    }
    
    // If cart not found (404), remove the invalid ID from localStorage
    if (err?.status === 404 || err?.response?.status === 404) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('n1_cart_id')
      }
    }
    
    return null
  }
}

/**
 * Create new cart for customer
 * Automatically associates with authenticated customer
 */
export async function createCart(regionId: string): Promise<StoreCart> {
  try {
    const response = await sdk.store.cart.create({
      region_id: regionId,
    })

    if (!response.cart) {
      throw new Error('Nepodařilo se vytvořit košík')
    }

    // Store cart ID in localStorage for future retrieval
    if (typeof window !== 'undefined') {
      localStorage.setItem('n1_cart_id', response.cart.id)
    }

    return response.cart
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CartService] Failed to create cart:', err)
    }
    throw new Error('Nepodařilo se vytvořit košík')
  }
}

/**
 * Add item to cart
 */
export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<StoreCart> {
  try {
    const response = await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    })

    if (!response.cart) {
      throw new Error('Nepodařilo se přidat produkt do košíku')
    }

    return response.cart
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CartService] Failed to add to cart:', err)
    }
    throw new Error('Nepodařilo se přidat produkt do košíku')
  }
}

/**
 * Update line item quantity
 */
export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<StoreCart> {
  try {
    const response = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
      quantity,
    })

    if (!response.cart) {
      throw new Error('Nepodařilo se aktualizovat košík')
    }

    return response.cart
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CartService] Failed to update line item:', err)
    }
    throw new Error('Nepodařilo se aktualizovat košík')
  }
}

/**
 * Remove line item from cart
 */
export async function removeLineItem(cartId: string, lineItemId: string): Promise<StoreCart> {
  try {
    // Delete the line item
    await sdk.store.cart.deleteLineItem(cartId, lineItemId)
    
    // Retrieve the updated cart
    const { cart } = await sdk.store.cart.retrieve(cartId)

    if (!cart) {
      throw new Error('Nepodařilo se načíst aktualizovaný košík')
    }

    return cart
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CartService] Failed to remove line item:', err)
    }
    throw new Error('Nepodařilo se odstranit produkt z košíku')
  }
}

/**
 * Get cart by ID (for guest cart retrieval)
 * Returns null if cart doesn't exist
 */
export async function getCartById(cartId: string): Promise<StoreCart | null> {
  try {
    const { cart } = await sdk.store.cart.retrieve(cartId)

    return cart || null
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CartService] Failed to fetch cart by ID:', err)
    }
    return null
  }
}

/**
 * Merge guest cart items into authenticated customer cart
 *
 * Flow:
 * 1. Get guest cart items
 * 2. Get or create customer cart
 * 3. Transfer all items from guest cart to customer cart
 *
 * @param guestCartId - ID of guest cart to merge
 * @param regionId - Region for creating customer cart if needed
 * @returns Merged customer cart
 */
export async function mergeGuestCart(guestCartId: string, regionId: string): Promise<StoreCart | null> {
  try {
    // Get guest cart
    const guestCart = await getCartById(guestCartId)
    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      // No guest cart or empty - nothing to merge
      return null
    }

    // Get or create customer cart
    let customerCart = await getCart()
    if (!customerCart) {
      customerCart = await createCart(regionId)
    }

    // Transfer all items from guest cart to customer cart
    for (const item of guestCart.items) {
      if (!item.variant_id) continue

      await addToCart(customerCart.id, item.variant_id, item.quantity)
    }

    // Get updated cart with all items
    const mergedCart = await getCart()

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[CartService] Merged ${guestCart.items.length} items from guest cart ${guestCartId}`
      )
    }

    return mergedCart
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CartService] Failed to merge guest cart:', err)
    }
    // Don't throw - merge is best-effort
    // If it fails, user can manually re-add items
    return null
  }
}
