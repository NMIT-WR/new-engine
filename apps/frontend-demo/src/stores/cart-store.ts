import { Store } from '@tanstack/react-store'
import type { Product } from '../types/product'
import { getProductPrice } from '../utils/price-utils'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

// Helper function to load cart from localStorage
function loadCartFromStorage(): CartState {
  try {
    const stored = localStorage.getItem('cart')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error)
  }
  return { items: [], isOpen: false }
}

// Helper function to save cart to localStorage
function saveCartToStorage(state: CartState) {
  try {
    localStorage.setItem('cart', JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save cart to storage:', error)
  }
}

// Create the cart store
export const cartStore = new Store<CartState>({
  items: [],
  isOpen: false,
})

// Initialize cart from localStorage on client side
if (typeof window !== 'undefined') {
  cartStore.setState(() => loadCartFromStorage())
  
  // Subscribe to changes and persist to localStorage
  cartStore.subscribe(() => {
    saveCartToStorage(cartStore.state)
  })
}

// Helper functions
export const cartHelpers = {
  addItem: (product: Product, options: { size?: string; color?: string; quantity?: number } = {}) => {
    cartStore.setState((state) => {
      const existingItem = state.items.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === options.size &&
          item.selectedColor === options.color
      )

      if (existingItem) {
        // Update quantity if item already exists
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + (options.quantity || 1) }
              : item
          ),
        }
      }

      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${options.size || 'default'}-${options.color || 'default'}`,
        product,
        quantity: options.quantity || 1,
        selectedSize: options.size,
        selectedColor: options.color,
      }

      return {
        ...state,
        items: [...state.items, newItem],
      }
    })
  },

  removeItem: (itemId: string) => {
    cartStore.setState((state) => ({
      ...state,
      items: state.items.filter((item) => item.id !== itemId),
    }))
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      cartHelpers.removeItem(itemId)
      return
    }

    cartStore.setState((state) => ({
      ...state,
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }))
  },

  clearCart: () => {
    cartStore.setState(() => ({
      items: [],
      isOpen: false,
    }))
  },

  toggleCart: () => {
    cartStore.setState((state) => ({
      ...state,
      isOpen: !state.isOpen,
    }))
  },

  getItemCount: () => {
    return cartStore.state.items.reduce((total, item) => total + item.quantity, 0)
  },

  getSubtotal: () => {
    return cartStore.state.items.reduce((total, item) => {
      const price = getProductPrice(item.product)
      return total + price * item.quantity
    }, 0)
  },

  getTax: (subtotal: number, taxRate = 0.21) => {
    return subtotal * taxRate
  },

  getTotal: () => {
    const subtotal = cartHelpers.getSubtotal()
    const tax = cartHelpers.getTax(subtotal)
    const shipping = 0 // Free shipping for now
    return subtotal + tax + shipping
  },
}