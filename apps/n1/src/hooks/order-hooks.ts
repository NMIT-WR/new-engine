import type { StoreOrder } from "@medusajs/types"
import {
  createMedusaOrderService,
  createOrderHooks,
  type MedusaOrderListInput,
} from "@techsio/storefront-data"
import { sdk } from "@/lib/medusa-client"

/**
 * Input types for order hooks
 */
export type OrderListInput = {
  page?: number
  limit?: number
  offset?: number
  enabled?: boolean
}

export type OrderDetailInput = {
  id?: string
  enabled?: boolean
}

type OrderListParams = MedusaOrderListInput & {
  fields?: string
}

/**
 * Build list params from input
 */
function buildListParams(input: OrderListInput): OrderListParams {
  const { page = 1, limit = 10, offset } = input ?? {}

  return {
    limit,
    offset: offset ?? (page - 1) * limit,
  }
}

/**
 * Build detail params from input
 */
function buildDetailParams(input: OrderDetailInput): string {
  return input?.id ?? ""
}

/**
 * Base storefront-data medusa order service.
 * Wrapped below to preserve n1 behavior (error messages + order sorting).
 */
const baseOrderService = createMedusaOrderService(sdk, {
  defaultFields: "*items",
})

/**
 * n1 adapter over createMedusaOrderService
 * - keeps Czech error messages
 * - keeps newest-first order list sorting
 * - keeps existing detail param shape (string id) for query-key compatibility
 */
const orderService = {
  async getOrders(
    params: OrderListParams,
    signal?: AbortSignal
  ): Promise<{ orders: StoreOrder[]; count?: number }> {
    try {
      const response = await baseOrderService.getOrders(params, signal)
      const sortedOrders = [...(response.orders ?? [])].sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      )

      return {
        orders: sortedOrders,
        count: response.count,
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[OrderService] Failed to fetch orders:", err)
      }
      throw new Error("Nepodařilo se načíst objednávky")
    }
  },

  async getOrder(
    orderId: string,
    signal?: AbortSignal
  ): Promise<StoreOrder | null> {
    if (!orderId) {
      return null
    }

    try {
      return await baseOrderService.getOrder({ id: orderId }, signal)
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[OrderService] Failed to fetch order:", err)
      }
      throw new Error("Nepodařilo se načíst objednávku")
    }
  }
}

/**
 * Create order hooks using storefront-data factory
 */
export const { useOrders, useSuspenseOrders, useOrder, useSuspenseOrder } =
  createOrderHooks<
    StoreOrder,
    OrderListInput,
    OrderListParams,
    OrderDetailInput,
    string
  >({
    service: orderService,
    buildListParams,
    buildDetailParams,
    queryKeyNamespace: "n1",
    defaultPageSize: 20,
  })
