import {
  createAuthHooks,
  createCacheConfig,
  createMedusaAuthService,
} from "@techsio/storefront-data"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

const cacheConfig = createCacheConfig({
  // Keep auth responsive after explicit invalidations, but avoid
  // unnecessary /customers/me refetch noise on every mount/focus.
  userData: {
    ...appCacheConfig.userData,
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
})

const customerAndOrderKeys = [queryKeys.customer.all(), queryKeys.orders.all()]

export const authHooks = createAuthHooks({
  service: createMedusaAuthService(sdk),
  queryKeys: queryKeys.auth,
  cacheConfig,
  invalidateOnAuthChange: {
    includeDefaults: false,
    invalidate: customerAndOrderKeys,
    removeOnLogout: customerAndOrderKeys,
  },
})
