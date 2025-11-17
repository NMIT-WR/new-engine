import type {
  Cart,
  CartLineItem,
  OptimisticCart,
  OptimisticLineItem,
} from '@/services/cart-service'

export function isOptimisticCart(
  cart: Cart | OptimisticCart
): cart is OptimisticCart {
  return '_optimistic' in cart && cart._optimistic === true
}

export function isOptimisticLineItem(
  item: CartLineItem | OptimisticLineItem
): item is OptimisticLineItem {
  return '_optimistic' in item && item._optimistic === true
}

export function getOptimisticFlag(
  entity: Cart | CartLineItem | undefined | null
): boolean {
  if (!entity) return false
  return '_optimistic' in entity ? entity._optimistic === true : false
}

export function hasOptimisticItems(
  cart: Cart | OptimisticCart | undefined | null
): boolean {
  if (!cart?.items) return false
  return cart.items.some((item) => getOptimisticFlag(item))
}

export function calculateItemCount(cart: Cart | undefined | null): number {
  if (!cart?.items) return 0
  return cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0)
}

export function isCartEmpty(cart: Cart | undefined | null): boolean {
  return !cart?.items || cart.items.length === 0
}

export function cartHasItems(cart: Cart | undefined | null): boolean {
  return !isCartEmpty(cart)
}
