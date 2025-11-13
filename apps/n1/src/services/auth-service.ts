import { sdk } from '@/lib/medusa-client'
import { clearToken } from '@/lib/token-utils'
import type { StoreCustomer } from '@medusajs/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface AuthResponse {
  token?: string
  customer?: StoreCustomer
}

/**
 * Authenticate customer with email and password
 * Uses session-based auth (HTTP-only cookies)
 */
export async function login(credentials: LoginCredentials): Promise<string | undefined> {
  try {
    const token = await sdk.auth.login('customer', 'emailpass', {
      email: credentials.email,
      password: credentials.password,
    })

    // Handle multi-step auth (OAuth providers)
    if (typeof token !== 'string') {
      throw new Error('Multi-step authentication not supported')
    }

    return token
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AuthService] Login failed:', err)
    }
    const message = err instanceof Error ? err.message : 'Login failed'
    throw new Error(message)
  }
}

/**
 * Register new customer with complete profile
 *
 * Medusa v2 flow (REQUIRED - simplified version doesn't work):
 * 1. auth.register() - Creates AuthIdentity (login credentials)
 * 2. auth.login() - Establishes proper session (NECESSARY!)
 * 3. customer.create() - Creates Customer profile
 * 4. auth.refresh() - Refreshes token for proper permissions
 *
 * NOTE: Steps 2 and 4 seem redundant but are REQUIRED for proper auth state.
 * Simplified flow (register → create) leaves user in broken state.
 */
export async function register(data: RegisterData): Promise<string | undefined> {
  try {
    // Step 1: Register creates auth identity (email + password)
    const token = await sdk.auth.register('customer', 'emailpass', {
      email: data.email,
      password: data.password,
    })

    // Handle multi-step auth
    if (typeof token !== 'string') {
      throw new Error('Multi-step authentication not supported')
    }

    // Step 2: Login to establish proper session (REQUIRED!)
    await sdk.auth.login('customer', 'emailpass', {
      email: data.email,
      password: data.password,
    })

    // Step 3: CREATE customer profile (not update!)
    await sdk.store.customer.create({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
    })

    // Step 4: Refresh token for proper permissions (REQUIRED!)
    await sdk.auth.refresh()

    return token
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AuthService] Registration failed:', err)
    }

    // CRITICAL: Clean up orphaned token if customer.create() failed
    // If register() succeeded but create() failed, we have token without customer
    clearToken()

    // Check if error is due to existing email
    const message = err instanceof Error ? err.message : 'Registration failed'
    if (message.includes('already exists')) {
      throw new Error('Email již existuje. Zkuste se přihlásit.')
    }

    throw new Error(message)
  }
}

/**
 * Logout current customer
 * Clears session cookie
 */
export async function logout(): Promise<void> {
  try {
    await sdk.auth.logout()
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AuthService] Logout failed:', err)
    }
    // Don't throw on logout errors - best effort
  }
}

/**
 * Get current authenticated customer
 * Returns null if not authenticated
 */
export async function getCustomer(): Promise<StoreCustomer | null> {
  try {
    const response = await sdk.store.customer.retrieve()
    return response.customer || null
  } catch (err) {
    // Not authenticated or session expired
    return null
  }
}

/**
 * Check if customer is authenticated
 * Returns true if session exists and is valid
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const customer = await getCustomer()
    return customer !== null
  } catch {
    return false
  }
}
