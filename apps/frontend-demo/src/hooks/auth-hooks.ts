import {
  createAuthHooks,
  createCacheConfig,
  createMedusaAuthService,
} from "@techsio/storefront-data"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

const cacheConfig = createCacheConfig({
  userData: appCacheConfig.userData,
})

export const authHooks = createAuthHooks({
  service: createMedusaAuthService(sdk),
  queryKeys: queryKeys.auth,
  cacheConfig,
})
