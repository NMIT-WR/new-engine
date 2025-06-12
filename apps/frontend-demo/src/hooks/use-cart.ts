// Re-export the Medusa cart hook as the main cart hook
// This consolidates all cart functionality into one React Query-based solution
export { useCart, useMedusaCart } from './use-medusa-cart'

// Legacy cart store exports for components that might still use them
// These should be migrated to use the new useCart hook
import { cartHelpers, cartStore } from '@/stores/cart-store'
import { useStore } from '@tanstack/react-store'

export function useLocalCart() {
  const state = useStore(cartStore)

  return {
    items: state.items,
    isOpen: state.isOpen,
    itemCount: cartHelpers.getItemCount(),
    subtotal: cartHelpers.getSubtotal(),
    total: cartHelpers.getTotal(),
    addItem: cartHelpers.addItem,
    removeItem: cartHelpers.removeItem,
    updateQuantity: cartHelpers.updateQuantity,
    clearCart: cartHelpers.clearCart,
    toggleCart: cartHelpers.toggleCart,
  }
}
