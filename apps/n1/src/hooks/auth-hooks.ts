import {
  createMedusaAuthService,
  createAuthHooks,
  createCacheConfig,
  type AuthService,
} from "@techsio/storefront-data"
import type { StoreCustomer } from "@medusajs/types"
import { mapAuthError } from "@/lib/auth-messages"
import { cacheConfig as appCacheConfig } from "@/lib/cache-config"
import { AUTH_MESSAGES } from "@/lib/auth-messages"
import { logError } from "@/lib/errors"
import { sdk } from "@/lib/medusa-client"
import { queryKeys } from "@/lib/query-keys"

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterData = {
  email: string
  password: string
  first_name: string
  last_name: string
}

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

const baseAuthService = createMedusaAuthService(sdk)

const authService: AuthService<
  StoreCustomer,
  LoginCredentials,
  RegisterData,
  Record<string, never>
> = {
  async getCustomer(_signal?: AbortSignal): Promise<StoreCustomer | null> {
    try {
      return await baseAuthService.getCustomer()
    } catch {
      // Preserve n1 behavior: customer fetch never hard-fails the UI
      return null
    }
  },

  async login(credentials: LoginCredentials) {
    try {
      return await baseAuthService.login(credentials)
    } catch (err) {
      logError("AuthService.login", err)
      throw new Error(mapAuthError(err))
    }
  },

  async logout() {
    try {
      await baseAuthService.logout()
    } catch (err) {
      logError("AuthService.logout", err)
      // Best effort logout - keep existing n1 behavior
    }
  },

  async register(data: RegisterData) {
    try {
      return await baseAuthService.register(data)
    } catch (err) {
      logError("AuthService.register", err)
      throw new Error(mapAuthError(err))
    }
  },
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
