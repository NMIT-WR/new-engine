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
    type: 'error' as const,
  }),

  stockErrorWithDetails: (available: number, requested: number) => ({
    title: 'Nedostatečné množství',
    description: `Na skladě je pouze ${available} ks, požadováno celkem ${requested} ks`,
    type: 'error' as const,
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

  // Shipping-specific messages
  shippingError: () => ({
    title: 'Chyba při nastavení dopravy',
    description:
      'Nepodařilo se nastavit způsob dopravy. Zkuste to prosím znovu.',
    type: 'error' as const,
  }),

  // Shipping address messages
  shippingAddressSuccess: () => ({
    title: 'Adresa uložena',
    description: 'Dodací adresa byla aktualizována',
    type: 'success' as const,
  }),

  shippingAddressError: () => ({
    title: 'Chyba při ukládání adresy',
    description: 'Nepodařilo se aktualizovat dodací adresu',
    type: 'error' as const,
  }),

  shippingAddressValidation: (fields: string[]) => ({
    title: 'Zkontrolujte adresu',
    description: `Neplatné pole: ${fields.join(', ')}`,
    type: 'warning' as const,
  }),

  // Payment-specific messages
  paymentInitiatedSuccess: () => ({
    title: 'Platba iniciována',
    description: 'Platební session byla úspěšně vytvořena',
    type: 'success' as const,
  }),

  paymentInitiatedError: () => ({
    title: 'Chyba při inicializaci platby',
    description: 'Nepodařilo se vytvořit platební session',
    type: 'error' as const,
  }),

  paymentValidation: (issues: string[]) => ({
    title: 'Nelze iniciovat platbu',
    description: issues.join(', '),
    type: 'warning' as const,
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

    stockWarningWithDetails: (
      available: number,
      requested: number,
      options = {}
    ) => {
      const message = cartToasts.stockErrorWithDetails(available, requested)
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

    shippingError: (options = {}) => {
      const message = cartToasts.shippingError()
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.error,
        ...options,
      })
    },

    // Shipping address toast methods
    shippingAddressSuccess: (options = {}) => {
      const message = cartToasts.shippingAddressSuccess()
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.success,
        ...options,
      })
    },

    shippingAddressError: (options = {}) => {
      const message = cartToasts.shippingAddressError()
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.error,
        ...options,
      })
    },

    shippingAddressValidation: (fields: string[], options = {}) => {
      const message = cartToasts.shippingAddressValidation(fields)
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.warning,
        ...options,
      })
    },

    // Payment toast methods
    paymentInitiatedSuccess: (options = {}) => {
      const message = cartToasts.paymentInitiatedSuccess()
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.success,
        ...options,
      })
    },

    paymentInitiatedError: (options = {}) => {
      const message = cartToasts.paymentInitiatedError()
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.error,
        ...options,
      })
    },

    paymentValidation: (issues: string[], options = {}) => {
      const message = cartToasts.paymentValidation(issues)
      return toaster.create({
        ...message,
        duration: DEFAULT_DURATIONS.warning,
        ...options,
      })
    },
  }
}
