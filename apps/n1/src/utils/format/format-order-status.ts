/**
 * Překlad statusů objednávky do češtiny
 */

export type OrderStatus =
  | 'pending'
  | 'completed'
  | 'canceled'
  | 'archived'
  | 'requires_action'

export type PaymentStatus =
  | 'not_paid'
  | 'awaiting'
  | 'authorized'
  | 'captured'
  | 'partially_captured'
  | 'refunded'
  | 'partially_refunded'
  | 'canceled'

export type FulfillmentStatus =
  | 'not_fulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'partially_shipped'
  | 'shipped'
  | 'partially_delivered'
  | 'delivered'
  | 'canceled'

const orderStatusMap: Record<OrderStatus, string> = {
  pending: 'Čeká na zpracování',
  completed: 'Dokončena',
  canceled: 'Zrušena',
  archived: 'Archivována',
  requires_action: 'Vyžaduje akci',
}

const paymentStatusMap: Record<PaymentStatus, string> = {
  not_paid: 'Nezaplaceno',
  awaiting: 'Čeká na platbu',
  authorized: 'Připravuje se',
  captured: 'Zaplaceno',
  partially_captured: 'Částečně zaplaceno',
  refunded: 'Vráceno',
  partially_refunded: 'Částečně vráceno',
  canceled: 'Zrušeno',
}

const fulfillmentStatusMap: Record<FulfillmentStatus, string> = {
  not_fulfilled: 'Připravuje se',
  partially_fulfilled: 'Částečně připraveno',
  fulfilled: 'Připraveno',
  partially_shipped: 'Částečně odesláno',
  shipped: 'Odesláno',
  partially_delivered: 'Částečně doručeno',
  delivered: 'Doručeno',
  canceled: 'Zrušeno',
}

export function formatOrderStatus(status: string): string {
  return orderStatusMap[status as OrderStatus] || status
}

export function formatPaymentStatus(status: string): string {
  return paymentStatusMap[status as PaymentStatus] || status
}

export function formatFulfillmentStatus(status: string): string {
  return fulfillmentStatusMap[status as FulfillmentStatus] || status
}

/**
 * Vrací barvu badge podle stavu platby
 */
export function getPaymentStatusColor(
  status: string
): 'success' | 'warning' | 'danger' | 'info' | 'secondary' {
  switch (status) {
    case 'captured':
      return 'success'
    case 'authorized':
    case 'awaiting':
    case 'partially_captured':
      return 'info'
    case 'not_paid':
    case 'canceled':
      return 'danger'
    case 'refunded':
    case 'partially_refunded':
      return 'info'
    default:
      return 'secondary'
  }
}

/**
 * Vrací barvu badge podle stavu doručení
 */
export function getFulfillmentStatusColor(
  status: string
): 'success' | 'warning' | 'danger' | 'info' | 'secondary' {
  switch (status) {
    case 'delivered':
      return 'success'
    case 'shipped':
    case 'fulfilled':
      return 'info'
    case 'partially_shipped':
    case 'partially_delivered':
    case 'partially_fulfilled':
      return 'info'
    case 'not_fulfilled':
      return 'secondary'
    case 'canceled':
      return 'danger'
    default:
      return 'secondary'
  }
}

/**
 * Zjednodušený stav objednávky pro zobrazení v přehledu
 * Vrací jeden hlavní stav a jeho barvu
 */
export function getOrderDisplayStatus(
  orderStatus: string,
  fulfillmentStatus: string
): { label: string; color: 'success' | 'danger' | 'info' } {
  // Zrušeno má přednost
  if (orderStatus === 'canceled' || fulfillmentStatus === 'canceled') {
    return { label: 'Zrušeno', color: 'danger' }
  }

  // Podle fulfillment statusu
  switch (fulfillmentStatus) {
    case 'delivered':
      return { label: 'Doručeno', color: 'success' }
    case 'shipped':
    case 'partially_shipped':
      return { label: 'Odesláno', color: 'info' }
    case 'fulfilled':
    case 'partially_fulfilled':
      return { label: 'Připraveno k odeslání', color: 'info' }
    default:
      return { label: 'Připravuje se', color: 'info' }
  }
}

export function getPaymentDisplayStatus(paymentStatus: string): {
  label: string
  isPaid: boolean
} {
  const isPaid =
    paymentStatus === 'captured' || paymentStatus === 'partially_captured'
  return {
    label: isPaid ? 'Zaplaceno' : 'Nezaplaceno',
    isPaid,
  }
}
