import {
  createAuthHooks,
  createCacheConfig,
  type AuthService,
} from "@techsio/storefront-data"
import type { StoreCustomer } from "@medusajs/types"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { AUTH_MESSAGES } from "@/lib/auth-messages"
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

export function getAuthMutationErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return AUTH_MESSAGES.SERVER_ERROR
}

const authService: AuthService<
  StoreCustomer,
  LoginCredentials,
  RegisterData,
  Record<string, never>
> = {
  getCustomer,
  login,
  logout,
  register,
}

export const authHooks = createAuthHooks<
  StoreCustomer,
  LoginCredentials,
  RegisterData,
  Record<string, never>
>({
  service: authService,
  queryKeys: authQueryKeys,
  queryKeyNamespace: "n1",
  cacheConfig,
})
