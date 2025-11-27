export type OrderStatus =
  | 'pending'
  | 'completed'
  | 'archived'
  | 'canceled'
  | 'requires_action'

export type PaymentStatus =
  | 'not_paid'
  | 'awaiting'
  | 'authorized'
  | 'partially_authorized'
  | 'captured'
  | 'partially_captured'
  | 'partially_refunded'
  | 'refunded'
  | 'canceled'

export type FulfillmentStatus =
  | 'not_fulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'partially_shipped'
  | 'shipped'
  | 'partially_returned'
  | 'returned'
  | 'canceled'

export const orderStatusMap: Record<OrderStatus, string> = {
  pending: 'Čeká na zpracování',
  completed: 'Dokončeno',
  archived: 'Archivováno',
  canceled: 'Zrušeno',
  requires_action: 'Vyžaduje akci',
}

export const paymentStatusMap: Record<PaymentStatus, string> = {
  not_paid: 'Nezaplaceno',
  awaiting: 'Čeká na platbu',
  authorized: 'Autorizováno',
  partially_authorized: 'Částečně autorizováno',
  captured: 'Zaplaceno',
  partially_captured: 'Částečně zaplaceno',
  partially_refunded: 'Částečně vráceno',
  refunded: 'Vráceno',
  canceled: 'Zrušeno',
}

export const fulfillmentStatusMap: Record<FulfillmentStatus, string> = {
  not_fulfilled: 'Nevyřízeno',
  partially_fulfilled: 'Částečně vyřízeno',
  fulfilled: 'Vyřízeno',
  partially_shipped: 'Částečně odesláno',
  shipped: 'Odesláno',
  partially_returned: 'Částečně vráceno',
  returned: 'Vráceno',
  canceled: 'Zrušeno',
}

export function getOrderStatusLabel(status: string): string {
  return orderStatusMap[status as OrderStatus] || status
}

export function getPaymentStatusLabel(status: string): string {
  return paymentStatusMap[status as PaymentStatus] || status
}

export function getFulfillmentStatusLabel(status: string): string {
  return fulfillmentStatusMap[status as FulfillmentStatus] || status
}

export function getOrderStatusVariant(
  status: string
): 'success' | 'danger' | 'info' {
  switch (status) {
    case 'pending':
      return 'info'
    case 'completed':
      return 'success'
    case 'canceled':
      return 'danger'
    default:
      return 'info'
  }
}

export function truncateProductTitle(title: string, maxWords = 3): string {
  const words = title.split(' ')
  if (words.length <= maxWords) {
    return title
  }
  return `${words.slice(0, maxWords).join(' ')}`
}

export function formatOrderDate({
  dateString,
  monthType = 'numeric',
}: { dateString: string; monthType?: 'numeric' | 'long' }): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: monthType,
      year: 'numeric',
    })
  } catch {
    return 'Neznámé datum'
  }
}

export function formatPrice(amount: number, currencyCode = 'CZK'): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
