import type {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from "@/types/order"

export const orderStatusMap: Record<OrderStatus, string> = {
  pending: "Čeká na zpracování",
  completed: "Dokončeno",
  archived: "Archivováno",
  canceled: "Zrušeno",
  requires_action: "Vyžaduje akci",
}

export const paymentStatusMap: Record<PaymentStatus, string> = {
  not_paid: "Nezaplaceno",
  awaiting: "Čeká na platbu",
  authorized: "Autorizováno",
  partially_authorized: "Částečně autorizováno",
  captured: "Zaplaceno",
  partially_captured: "Částečně zaplaceno",
  partially_refunded: "Částečně vráceno",
  refunded: "Vráceno",
  canceled: "Zrušeno",
}

export const fulfillmentStatusMap: Record<FulfillmentStatus, string> = {
  not_fulfilled: "Nevyřízeno",
  partially_fulfilled: "Částečně vyřízeno",
  fulfilled: "Vyřízeno",
  partially_shipped: "Částečně odesláno",
  shipped: "Odesláno",
  partially_returned: "Částečně vráceno",
  returned: "Vráceno",
  canceled: "Zrušeno",
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
  status: OrderStatus
): "warning" | "success" | "error" | "info" {
  switch (status) {
    case "pending":
      return "warning"
    case "completed":
      return "success"
    case "canceled":
      return "error"
    default:
      return "info"
  }
}

export function truncateProductTitle(title: string, maxWords = 3): string {
  const words = title.split(" ")
  if (words.length <= maxWords) {
    return title
  }
  return `${words.slice(0, maxWords).join(" ")}`
}

export function formatOrderDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return "Neznámé datum"
  }
}

export const ORDER_LIST_FIELDS = [
  "id",
  "display_id",
  "status",
  "created_at",
  "total",
  "currency_code",
  "items.thumbnail",
  "items.product_title",
  "items.product_handle",
  "items.variant_title",
  "items.quantity",
  "summary.current_order_total",
] as const

export const ORDER_FIELDS = [
  "id",
  "display_id",
  "status",
  "created_at",
  "total",
  "currency_code",
  "items",
  "summary",
  "payment_status",
  "fulfillment_status",
  "shipping_methods",
  "email",
  "updated_at",
  "item_subtotal",
  "item_tax_total",
  "shipping_total",
] as const
