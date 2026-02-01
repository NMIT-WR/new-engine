import { createAuthHooks, createCacheConfig } from "@techsio/storefront-data"
import type { StoreCustomer } from "@medusajs/types"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { queryKeys } from "@/lib/query-keys"
import {
  getCustomer,
  login,
  logout,
  register,
  type LoginCredentials,
  type RegisterData,
} from "@/services/auth-service"

const authQueryKeys = {
  all: () => queryKeys.auth.all(),
  customer: () => queryKeys.customer.profile(),
  session: () => queryKeys.auth.session(),
}

const cacheConfig = createCacheConfig({
  userData: appCacheConfig.userData,
})

export const authHooks = createAuthHooks<
  StoreCustomer,
  LoginCredentials,
  RegisterData,
  Record<string, never>
>({
  service: {
    getCustomer: () => getCustomer(),
    login,
    logout,
    register,
  },
  queryKeys: authQueryKeys,
  cacheConfig,
})
