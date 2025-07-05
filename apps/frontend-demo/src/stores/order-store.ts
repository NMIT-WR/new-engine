import { Store } from '@tanstack/react-store'

// Using any type for Cart to avoid type conflicts with Medusa
// In production, you would import the proper type from @medusajs/js-sdk
type Cart = any

interface OrderState {
  completedOrder: Cart | null
}

// Create the order store
export const orderStore = new Store<OrderState>({
  completedOrder: null,
})

// Helper functions
export const orderHelpers = {
  // Save current cart data before clearing
  saveCompletedOrder: (cart: Cart) => {
    orderStore.setState(() => ({
      completedOrder: cart,
    }))
  },

  // Clear saved order data
  clearCompletedOrder: () => {
    orderStore.setState(() => ({
      completedOrder: null,
    }))
  },

  // Get order data - returns current cart or saved completed order
  getOrderData: (currentCart: Cart | null): Cart | null => {
    const state = orderStore.state

    // If we have a completed order saved, use that
    if (state.completedOrder) {
      return state.completedOrder
    }

    // Otherwise use current cart
    return currentCart
  },
}
