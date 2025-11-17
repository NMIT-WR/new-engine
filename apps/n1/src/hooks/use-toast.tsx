'use client'

import { toaster } from '@new-engine/ui/molecules/toast'

export { useToast } from '@new-engine/ui/molecules/toast'

const DEFAULT_DURATIONS = {
  success: 3000,
  info: 2500,
  error: 4000,
  warning: 3500,
} as const

// Cart-specific toast messages
export const cartToasts = {
  addSuccess: (productName: string, quantity = 1) => ({
    title: 'Přidáno do košíku',
    description: `${quantity}x ${productName}`,
    type: 'success' as const,
  }),

  removeSuccess: (productName: string) => ({
    title: 'Odebráno z košíku',
    description: productName,
    type: 'info' as const,
  }),

  updateSuccess: () => ({
    title: 'Košík aktualizován',
    type: 'success' as const,
  }),

  createError: () => ({
    title: 'Chyba při vytváření košíku',
    description: 'Zkuste to prosím znovu',
    type: 'error' as const,
  }),

  addError: (error?: string) => ({
    title: 'Nepodařilo se přidat do košíku',
    description: error || 'Zkuste to prosím znovu',
    type: 'error' as const,
  }),

  stockError: () => ({
    title: 'Nedostatečné množství',
    description: 'Produkt není dostupný v požadovaném množství',
    type: 'warning' as const,
  }),

  networkError: () => ({
    title: 'Chyba připojení',
    description: 'Zkontrolujte internetové připojení',
    type: 'error' as const,
  }),

  mergeSuccess: (itemCount: number) => ({
    title: 'Košík sloučen',
    description: `${itemCount} položek přidáno do vašeho košíku`,
    type: 'success' as const,
  }),
}

export function useCartToast() {
  return {
    // Cart-specific toast methods
    addedToCart: (productName: string, quantity = 1, options = {}) => {
      const message = cartToasts.addSuccess(productName, quantity)
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.success,
        ...options,
      })
    },

    removedFromCart: (productName: string, options = {}) => {
      const message = cartToasts.removeSuccess(productName)
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.info,
        ...options,
      })
    },

    cartError: (error?: string, options = {}) => {
      const message = cartToasts.addError(error)
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.error,
        ...options,
      })
    },

    stockWarning: (options = {}) => {
      const message = cartToasts.stockError()
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.warning,
        ...options,
      })
    },

    networkError: (options = {}) => {
      const message = cartToasts.networkError()
      return toaster.create({
        ...message,
        duration: Number.POSITIVE_INFINITY,
        ...options,
      })
    },
  }
}
