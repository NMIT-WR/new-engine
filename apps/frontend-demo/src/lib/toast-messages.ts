/**
 * Common toast messages for consistency across the app
 * Use with the toast hook: const toast = useToast()
 */

// Cart messages
export const cartMessages = {
  added: {
    title: 'Added to cart',
    description: 'Item has been added to your cart',
    type: 'success' as const,
  },
  
  removed: {
    title: 'Item removed',
    description: 'Item has been removed from your cart',
    type: 'success' as const,
  },
  
  cleared: {
    title: 'Cart cleared',
    description: 'All items have been removed from your cart',
    type: 'success' as const,
  },
  
  discountApplied: {
    title: 'Discount applied',
    description: 'Your discount code has been applied',
    type: 'success' as const,
  },
  
  expired: {
    title: 'Cart expired',
    description: 'Your cart has expired. Please try again.',
    type: 'error' as const,
  },
  
  updateQuantityError: (message?: string) => ({
    title: 'Failed to update quantity',
    description: message || 'Unable to update item quantity',
    type: 'error' as const,
  }),
  
  removeItemError: (message?: string) => ({
    title: 'Failed to remove item',
    description: message || 'Unable to remove item from cart',
    type: 'error' as const,
  }),
  
  clearError: (message?: string) => ({
    title: 'Failed to clear cart',
    description: message || 'Unable to clear cart',
    type: 'error' as const,
  }),
  
  invalidDiscount: (message?: string) => ({
    title: 'Invalid discount code',
    description: message || 'The discount code is not valid',
    type: 'error' as const,
  }),
}

// Inventory messages
export const inventoryMessages = {
  outOfStock: {
    title: 'Out of Stock',
    description: 'This product variant is not available in the requested quantity.',
    type: 'error' as const,
  },
  
  lowStock: (quantity: number) => ({
    title: 'Low Stock',
    description: `Only ${quantity} items left in stock`,
    type: 'warning' as const,
  }),
  
  lastItem: {
    title: 'Last item!',
    description: 'This is the last item in stock',
    type: 'info' as const,
  },
}

// Auth messages
export const authMessages = {
  loginSuccess: (email?: string) => ({
    title: 'Welcome back!',
    description: email ? `You are now logged in as ${email}` : 'You are now logged in',
    type: 'success' as const,
  }),
  
  registerSuccess: {
    title: 'Account created!',
    description: 'Your account has been created successfully',
    type: 'success' as const,
  },
  
  logoutSuccess: {
    title: 'Logged out',
    description: 'You have been logged out successfully',
    type: 'success' as const,
  },
  
  profileUpdated: {
    title: 'Profile updated',
    description: 'Your profile has been updated successfully',
    type: 'success' as const,
  },
  
  passwordChanged: {
    title: 'Password changed',
    description: 'Your password has been changed successfully',
    type: 'success' as const,
  },
  
  authError: (message?: string) => ({
    title: 'Authentication Error',
    description: message || 'Please log in to continue',
    type: 'error' as const,
  }),
}

// General messages
export const generalMessages = {
  networkError: {
    title: 'Connection Error',
    description: 'Unable to connect to the server. Please check your connection.',
    type: 'error' as const,
  },
  
  serverError: {
    title: 'Server Error', 
    description: 'Something went wrong on our end. Please try again later.',
    type: 'error' as const,
  },
  
  validationError: (message?: string) => ({
    title: 'Invalid Input',
    description: message || 'Please check your input and try again.',
    type: 'error' as const,
  }),
  
  genericError: (message?: string) => ({
    title: 'Error',
    description: message || 'An unexpected error occurred. Please try again.',
    type: 'error' as const,
  }),
}

/**
 * Helper to parse error and get appropriate toast message
 */
export function getErrorMessage(error: unknown): { title: string; description: string; type: 'error' } {
  const message = extractErrorMessage(error)
  const lowerMessage = message.toLowerCase()
  
  // Check for specific error types
  if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
    return inventoryMessages.outOfStock
  }
  
  if (lowerMessage.includes('cart') && lowerMessage.includes('not found')) {
    return cartMessages.expired
  }
  
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return generalMessages.networkError
  }
  
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('authentication')) {
    return authMessages.authError(message)
  }
  
  // Default to generic error with original message
  return generalMessages.genericError(message)
}

/**
 * Extract error message from various error formats
 */
function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  
  if (error && typeof error === 'object') {
    const err = error as any
    return err.message || 
           err.response?.data?.message || 
           err.response?.message ||
           err.error?.message ||
           'Unknown error'
  }
  
  return 'Unknown error'
}