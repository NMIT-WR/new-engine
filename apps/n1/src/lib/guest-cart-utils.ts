const GUEST_CART_KEY = 'medusa_guest_cart_id'

/**
 * Get guest cart ID from localStorage
 * Used for cart persistence before authentication
 */
export function getGuestCartId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(GUEST_CART_KEY)
}

/**
 * Save guest cart ID to localStorage
 * Called when guest creates a cart
 */
export function setGuestCartId(cartId: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(GUEST_CART_KEY, cartId)
}

/**
 * Clear guest cart ID from localStorage
 * Called after successful merge or cart completion
 */
export function clearGuestCartId(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(GUEST_CART_KEY)
}
