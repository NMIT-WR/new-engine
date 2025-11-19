import { CartServiceError, isNotFoundError } from '@/lib/errors'
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

export type CompleteCartResult =
  | { success: true; order: HttpTypes.StoreOrder }
  | {
      success: false
      cart: HttpTypes.StoreCart
      error: {
        message: string
        type: string
        name?: string
      }
    }

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
      throw new CartServiceError(
        'Košík byl načten, ale je prázdný',
        'CART_NOT_FOUND'
      )
    }

    return cart
  } catch (error) {
    // 404 is expected - cart was deleted or expired
    if (isNotFoundError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[CartService] Cart not found, clearing stored ID')
      }
      cartStorage.clearCartId()
      return null
    }

    // Other errors are unexpected
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'CART_NOT_FOUND')
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
      throw new CartServiceError(
        'Region ID je povinné pole',
        'CART_CREATION_FAILED'
      )
    }

    const response = await sdk.store.cart.create({
      region_id: regionId,
      email: options?.email,
      sales_channel_id: options?.salesChannelId,
    })

    if (!response.cart) {
      throw new CartServiceError(
        'Nepodařilo se vytvořit košík',
        'CART_CREATION_FAILED'
      )
    }

    cartStorage.setCartId(response.cart.id)

    if (process.env.NODE_ENV === 'development') {
      console.log('[CartService] Cart created:', response.cart.id)
    }

    return response.cart
  } catch (error) {
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'CART_CREATION_FAILED')
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
      throw new CartServiceError(
        'Cart ID a Variant ID jsou povinné',
        'ITEM_ADD_FAILED'
      )
    }

    if (quantity < 1) {
      throw new CartServiceError(
        'Množství musí být alespoň 1',
        'ITEM_ADD_FAILED'
      )
    }

    const response = await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
      metadata,
    })

    if (!response.cart) {
      throw new CartServiceError(
        'Nepodařilo se přidat položku do košíku',
        'ITEM_ADD_FAILED'
      )
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
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'ITEM_ADD_FAILED')
  }
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<Cart> {
  try {
    if (!cartId || !lineItemId) {
      throw new CartServiceError(
        'Cart ID a Line Item ID jsou povinné',
        'ITEM_UPDATE_FAILED'
      )
    }

    if (quantity < 1) {
      throw new CartServiceError(
        'Množství musí být alespoň 1',
        'ITEM_UPDATE_FAILED'
      )
    }

    const response = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
      quantity,
    })

    if (!response.cart) {
      throw new CartServiceError(
        'Nepodařilo se aktualizovat položku',
        'ITEM_UPDATE_FAILED'
      )
    }

    return response.cart
  } catch (error) {
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'ITEM_UPDATE_FAILED')
  }
}

export async function removeLineItem(
  cartId: string,
  lineItemId: string
): Promise<Cart> {
  try {
    if (!cartId || !lineItemId) {
      throw new CartServiceError(
        'Cart ID a Line Item ID jsou povinné',
        'ITEM_REMOVE_FAILED'
      )
    }

    const response = await sdk.store.cart.deleteLineItem(cartId, lineItemId)

    if (!response.parent) {
      throw new CartServiceError(
        'Nepodařilo se načíst aktualizovaný košík',
        'ITEM_REMOVE_FAILED'
      )
    }

    return response.parent
  } catch (error) {
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'ITEM_REMOVE_FAILED')
  }
}

export async function getShippingOptions(
  cartId: string
): Promise<HttpTypes.StoreCartShippingOption[]> {
  try {
    if (!cartId) {
      throw new CartServiceError('Cart ID je povinné', 'SHIPPING_NOT_AVAILABLE')
    }

    // Use fulfillment.listCartOptions with cart_id
    const response = await sdk.store.fulfillment.listCartOptions({
      cart_id: cartId,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('[CartService] Shipping options:', response.shipping_options)
    }

    return response.shipping_options || []
  } catch (error) {
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'SHIPPING_NOT_AVAILABLE')
  }
}

export async function getPaymentProviders(regionId: string) {
  try {
    if (!regionId) {
      throw new CartServiceError('Region ID je povinné', 'PAYMENT_FAILED')
    }

    const response = await sdk.store.payment.listPaymentProviders({
      region_id: regionId,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(
        '[CartService] Payment providers:',
        response.payment_providers
      )
    }

    return response.payment_providers || []
  } catch (error) {
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'PAYMENT_FAILED')
  }
}

export async function setShippingMethod(
  cartId: string,
  optionId: string
): Promise<Cart> {
  try {
    if (!cartId || !optionId) {
      throw new CartServiceError(
        'Cart ID a Option ID jsou povinné',
        'SHIPPING_SET_FAILED'
      )
    }

    const response = await sdk.store.cart.addShippingMethod(cartId, {
      option_id: optionId,
      data: {},
    })

    if (!response.cart) {
      throw new CartServiceError(
        'Nepodařilo se nastavit způsob dopravy',
        'SHIPPING_SET_FAILED'
      )
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[CartService] Shipping method set:', optionId)
    }

    return response.cart
  } catch (error) {
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'SHIPPING_SET_FAILED')
  }
}

export async function createPaymentCollection(cartId: string) {
  try {
    if (!cartId) {
      throw new CartServiceError('Cart ID je povinné', 'PAYMENT_INIT_FAILED')
    }

    // First, get the cart object
    const { cart } = await sdk.store.cart.retrieve(cartId)

    if (!cart) {
      throw new CartServiceError('Košík nebyl nalezen', 'PAYMENT_INIT_FAILED')
    }

    // Pass the cart object to initiatePaymentSession
    const response = await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: 'pp_system_default',
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('[CartService] Payment collection created')
    }

    return response
  } catch (error) {
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'PAYMENT_INIT_FAILED')
  }
}

export async function completeCart(
  cartId: string
): Promise<CompleteCartResult> {
  try {
    if (!cartId) {
      throw new CartServiceError('Cart ID je povinné', 'ORDER_CREATION_FAILED')
    }

    const response = await sdk.store.cart.complete(cartId)

    // Success case - SDK returned order
    if (response.type === 'order') {
      // Clear cart ID from storage ONLY on success
      cartStorage.clearCartId()

      if (process.env.NODE_ENV === 'development') {
        console.log(
          '[CartService] Cart completed, order created:',
          response.order.id
        )
      }

      return {
        success: true,
        order: response.order,
      }
    }

    // Failure case - SDK returned cart with validation/payment error
    if (process.env.NODE_ENV === 'development') {
      console.warn('[CartService] Cart completion failed:', response.error)
    }

    return {
      success: false,
      cart: response.cart,
      error: response.error,
    }
  } catch (error) {
    // Network errors or unexpected failures
    if (CartServiceError.isCartServiceError(error)) {
      throw error
    }
    throw CartServiceError.fromMedusaError(error, 'ORDER_CREATION_FAILED')
  }
}
