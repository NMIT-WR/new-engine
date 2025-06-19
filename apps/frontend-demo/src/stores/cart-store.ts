import { Store } from '@tanstack/react-store'
import { storage, STORAGE_KEYS } from '@/lib/local-storage'

interface CartState {
  cartId: string | null
  isOpen: boolean
}

// Create the cart store
export const cartStore = new Store<CartState>({
  cartId: null,
  isOpen: false,
})

// Helper functions
export function setCartId(cartId: string | null) {
  cartStore.setState((state) => ({
    ...state,
    cartId,
  }))
  
  // Persist to localStorage using centralized utility
  if (cartId) {
    storage.set(STORAGE_KEYS.CART_ID, cartId)
  } else {
    storage.remove(STORAGE_KEYS.CART_ID)
  }
}

export function openCart() {
  cartStore.setState((state) => ({
    ...state,
    isOpen: true,
  }))
}

export function closeCart() {
  cartStore.setState((state) => ({
    ...state,
    isOpen: false,
  }))
}

export function toggleCart() {
  cartStore.setState((state) => ({
    ...state,
    isOpen: !state.isOpen,
  }))
}

// Initialize from localStorage on client side
if (typeof window !== 'undefined') {
  const storedCartId = storage.get<string>(STORAGE_KEYS.CART_ID)
  if (storedCartId) {
    cartStore.setState({ cartId: storedCartId, isOpen: false })
  }
}