import type { HttpTypes } from "@medusajs/types"
import {
  createCacheConfig,
  createCheckoutHooks,
  createMedusaCheckoutService,
} from "@techsio/storefront-data"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

const checkoutService = createMedusaCheckoutService(sdk)

const cacheConfig = createCacheConfig({
  realtime: appCacheConfig.realtime,
  semiStatic: appCacheConfig.semiStatic,
})

export const checkoutHooks = createCheckoutHooks<
  HttpTypes.StoreCart,
  HttpTypes.StoreCartShippingOption,
  HttpTypes.StorePaymentProvider,
  HttpTypes.StorePaymentCollection,
  HttpTypes.StoreCompleteCartResponse
>({
  service: checkoutService,
  queryKeys: queryKeys.checkout,
  cacheConfig,
  cartQueryKeys: queryKeys.cart,
})
