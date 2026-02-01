import type { StoreOrder } from "@medusajs/types"
import { createOrderHooks } from "@techsio/storefront-data"
import {
  type GetOrdersParams,
  getOrderById,
  getOrders,
} from "@/services/order-service"

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

/**
 * Build list params from input
 */
function buildListParams(input: OrderListInput): GetOrdersParams {
  const { page = 1, limit, offset } = input ?? {}

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
 * Adapter for getOrderById to match OrderService interface
 * (no transformation needed - just forwarding)
 */
function getOrderAdapter(
  orderId: string,
  _signal?: AbortSignal
): Promise<StoreOrder | null> {
  if (!orderId) {
    return Promise.resolve(null)
  }
  return getOrderById(orderId)
}

/**
 * Adapter for getOrders to match OrderService interface
 * (transforms response shape)
 */
async function getOrdersAdapter(
  params: GetOrdersParams,
  _signal?: AbortSignal
): Promise<{ orders: StoreOrder[]; count?: number }> {
  const result = await getOrders(params)
  return {
    orders: result.orders,
    count: result.count,
  }
}

/**
 * Create order hooks using storefront-data factory
 */
export const { useOrders, useSuspenseOrders, useOrder, useSuspenseOrder } =
  createOrderHooks<
    StoreOrder,
    OrderListInput,
    GetOrdersParams,
    OrderDetailInput,
    string
  >({
    service: {
      getOrders: getOrdersAdapter,
      getOrder: getOrderAdapter,
    },
    buildListParams,
    buildDetailParams,
    queryKeyNamespace: "n1",
    defaultPageSize: 20,
  })
