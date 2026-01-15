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
  | 'partially_returned'
  | 'canceled'

export type FulfillmentStatus =
  | 'not_fulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'partially_shipped'
  | 'shipped'
  | 'partially_delivered'
  | 'delivered'
  | 'partially_returned'
  | 'returned'
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
  partially_returned: 'Částečně vráceno',
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
  partially_returned: 'Částečně vráceno',
  returned: 'Vráceno',
  canceled: 'Zrušeno',
}

export function getOrderStatusColor(
  status: string
): 'success' | 'danger' | 'info' {
  switch (status) {
    case 'completed':
      return 'success'
    case 'canceled':
      return 'danger'
    default:
      return 'info'
  }
}

export function getOrderStatusLabel(status: string): string {
  return orderStatusMap[status as OrderStatus] || status
}
