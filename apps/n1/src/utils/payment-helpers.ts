/**
 * Payment method helpers for user-friendly display
 */

export type PaymentMethodInfo = {
  id: string
  label: string
  description: string
  icon: string
  fee?: string
  timing?: string
}

/**
 * Maps backend payment provider IDs to user-friendly Czech labels and descriptions
 */
export const PAYMENT_METHOD_MAP: Record<string, PaymentMethodInfo> = {
  pp_system_default: {
    id: 'pp_system_default',
    label: 'Při převzetí',
    description: 'Zaplatíte hotově nebo kartou při převzetí zboží',
    icon: '💵',
    fee: 'Zdarma',
    timing: 'Platba při doručení',
  },
  pp_stripe_stripe: {
    id: 'pp_stripe_stripe',
    label: 'Online kartou',
    description: 'Okamžitá platba kartou Visa, Mastercard nebo Maestro',
    icon: '💳',
    fee: 'Zdarma',
    timing: 'Platba ihned',
  },
  pp_manual: {
    id: 'pp_manual',
    label: 'Bankovní převod',
    description: 'Převod na účet obchodu s variabilním symbolem',
    icon: '🏦',
    fee: 'Zdarma',
    timing: 'Do 2 pracovních dnů',
  },
  pp_qr_payment: {
    id: 'pp_qr_payment',
    label: 'QR platba',
    description: 'Rychlá platba naskenováním QR kódu v mobilní aplikaci',
    icon: '📱',
    fee: 'Zdarma',
    timing: 'Platba ihned',
  },
  pp_paypal: {
    id: 'pp_paypal',
    label: 'PayPal',
    description: 'Platba přes váš PayPal účet',
    icon: '🅿️',
    fee: 'Zdarma',
    timing: 'Platba ihned',
  },
  pp_gopay: {
    id: 'pp_gopay',
    label: 'GoPay',
    description: 'Online platba přes GoPay bránu',
    icon: '🟢',
    fee: 'Zdarma',
    timing: 'Platba ihned',
  },
  pp_comgate: {
    id: 'pp_comgate',
    label: 'Comgate',
    description: 'Platba kartou nebo bankovním převodem',
    icon: '🔵',
    fee: 'Zdarma',
    timing: 'Platba ihned',
  },
}

/**
 * Gets payment method info, returns fallback for unknown providers
 */
export function getPaymentMethodInfo(providerId: string): PaymentMethodInfo {
  return (
    PAYMENT_METHOD_MAP[providerId] || {
      id: providerId,
      label: formatProviderName(providerId),
      description: 'Platební metoda',
      icon: '💰',
    }
  )
}

/**
 * Formats provider ID to human-readable name as fallback
 */
function formatProviderName(providerId: string): string {
  // Remove pp_ prefix and convert to title case
  return providerId
    .replace(/^pp_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Groups payment methods by type for better organization
 */
export type PaymentMethodGroup = 'instant' | 'deferred' | 'cash'

export function getPaymentMethodGroup(providerId: string): PaymentMethodGroup {
  if (providerId === 'pp_system_default' || providerId.includes('cash')) {
    return 'cash'
  }
  if (providerId === 'pp_manual' || providerId.includes('bank')) {
    return 'deferred'
  }
  return 'instant'
}

/**
 * Get group label for payment method groups
 */
export function getGroupLabel(group: PaymentMethodGroup): string {
  const labels: Record<PaymentMethodGroup, string> = {
    instant: 'Online platby',
    deferred: 'Odložené platby',
    cash: 'Platba při převzetí',
  }
  return labels[group]
}

/**
 * Sorts payment methods by recommended order
 */
export function sortPaymentMethods<T extends { id: string }>(methods: T[]): T[] {
  const order = [
    'pp_stripe_stripe', // Card payment first
    'pp_qr_payment', // QR payment
    'pp_gopay', // Local payment methods
    'pp_comgate',
    'pp_paypal', // International
    'pp_manual', // Bank transfer
    'pp_system_default', // Cash on delivery last
  ]

  return [...methods].sort((a, b) => {
    const indexA = order.indexOf(a.id)
    const indexB = order.indexOf(b.id)

    // If both are in order list, sort by order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    // If only one is in order list, it comes first
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    // Otherwise maintain original order
    return 0
  })
}