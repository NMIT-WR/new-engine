import {
  createMedusaOrderService,
  createOrderHooks,
} from "@techsio/storefront-data"
import { sdk } from "@/lib/medusa-client"
import { ORDER_FIELDS } from "@/lib/order-utils"
import { queryKeys } from "@/lib/query-keys"

export const orderHooks = createOrderHooks({
  service: createMedusaOrderService(sdk, {
    defaultFields: ORDER_FIELDS.join(","),
  }),
  queryKeys: queryKeys.orders,
})
