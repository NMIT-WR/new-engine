import { cartHelpers, cartStore } from '@/stores/cart-store'
import { useStore } from '@tanstack/react-store'

export function useCart() {
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
