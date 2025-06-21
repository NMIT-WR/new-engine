import type { ValidationError } from '@/lib/auth/validation'
import { STORAGE_KEYS } from '@/lib/constants'
import { httpClient } from '@/lib/http-client'
import { storage } from '@/lib/local-storage'
import { sdk } from '@/lib/medusa-client'
import type { HttpTypes } from '@medusajs/types'
import { Store } from '@tanstack/react-store'

// In-memory token cache for better security
let tokenCache: string | null = null

export interface AuthState {
  // Auth state
  user: HttpTypes.StoreCustomer | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean

  // Form state
  validationErrors: ValidationError[]
}

// Helper to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Helper to process auth response from SDK
const processAuthResponse = (response: any): string => {
  if (typeof response === 'string') return response
  if (response?.token) return response.token
  throw new Error('Invalid auth response')
}

// Helper function to load auth from localStorage
function loadAuthFromStorage(): Partial<AuthState> {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,
      validationErrors: [],
    }
  }

  try {
    const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN)

    if (token && !isTokenExpired(token)) {
      tokenCache = token
      return {
        isLoading: false,
        error: null,
        isInitialized: false,
        validationErrors: [],
      }
    } else if (token) {
      // Token expired, remove it
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
    }
  } catch (error) {
    // Silent fail - no console.log in production
  }
  return {
    user: null,
    isLoading: false,
    error: null,
    isInitialized: false,
    validationErrors: [],
  }
}

// Create the auth store
export const authStore = new Store<AuthState>({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  validationErrors: [],
})

// Initialize auth from localStorage on client side
if (typeof window !== 'undefined') {
  const initialState = loadAuthFromStorage()
  authStore.setState((state) => ({ ...state, ...initialState }))
}

// Helper functions
export const authHelpers = {
  // Fetch current user
  fetchUser: async () => {
    try {
      authStore.setState((state) => ({
        ...state,
        isLoading: true,
        error: null,
      }))

      // Try memory cache first, then localStorage
      const token = tokenCache || storage.get<string>(STORAGE_KEYS.AUTH_TOKEN)

      if (!token || isTokenExpired(token)) {
        if (token) {
          tokenCache = null
          storage.remove(STORAGE_KEYS.AUTH_TOKEN)
        }
        authStore.setState((state) => ({
          ...state,
          user: null,
          isLoading: false,
          isInitialized: true,
        }))
        return null
      }

      // Cache token in memory if not already cached
      if (!tokenCache && token) {
        tokenCache = token
      }

      // Use httpClient instead of direct fetch
      try {
        const data = await httpClient.get<{
          customer: HttpTypes.StoreCustomer
        }>('/store/customers/me')
        authStore.setState((state) => ({
          ...state,
          user: data.customer,
          isLoading: false,
          isInitialized: true,
        }))
        return data.customer
      } catch (error: any) {
        if (error.status === 401) {
          tokenCache = null
          storage.remove(STORAGE_KEYS.AUTH_TOKEN)
        }
        authStore.setState((state) => ({
          ...state,
          user: null,
          isLoading: false,
          isInitialized: true,
        }))
        return null
      }
    } catch (err: any) {
      authStore.setState((state) => ({
        ...state,
        user: null,
        isLoading: false,
        error: err.message,
        isInitialized: true,
      }))
      return null
    }
  },

  // Login
  login: async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      authStore.setState((state) => ({
        ...state,
        error: null,
        validationErrors: [],
      }))

      // Step 1: Authenticate
      const authResponse = await sdk.auth.login('customer', 'emailpass', {
        email,
        password,
      })

      // Process response with helper
      const token = processAuthResponse(authResponse)

      // Step 2: Store token in memory and localStorage
      tokenCache = token
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token)

      // Step 3: Fetch customer profile using httpClient
      try {
        const data = await httpClient.get<{
          customer: HttpTypes.StoreCustomer
        }>('/store/customers/me')
        authStore.setState((state) => ({
          ...state,
          user: data.customer,
          isLoading: false,
        }))
      } catch (error: any) {
        // If customer doesn't exist or unauthorized, try to create one
        if (error.status === 404 || error.status === 401) {
          try {
            const createData = await httpClient.post<{
              customer: HttpTypes.StoreCustomer
            }>('/store/customers', {
              email,
              first_name: firstName,
              last_name: lastName,
            })
            authStore.setState((state) => ({
              ...state,
              user: createData.customer,
              isLoading: false,
            }))
          } catch (createError: any) {
            // If customer already exists, try fetching again
            if (
              createError.message?.includes('already authenticated') ||
              createError.message?.includes('already exists')
            ) {
              try {
                const retryData = await httpClient.get<{
                  customer: HttpTypes.StoreCustomer
                }>('/store/customers/me')
                authStore.setState((state) => ({
                  ...state,
                  user: retryData.customer,
                  isLoading: false,
                }))
              } catch (retryError) {
                // Silent fail
              }
            }
          }
        }
      }

      // Step 4: Clear anonymous cart ID (cart will be merged automatically)
      const anonymousCartId = storage.get<string>(STORAGE_KEYS.CART_ID)
      if (anonymousCartId) {
        storage.remove(STORAGE_KEYS.CART_ID)
      }
    } catch (err: any) {
      const message = err?.message || 'Login failed'
      authStore.setState((state) => ({
        ...state,
        error: message,
      }))
      throw new Error(message)
    }
  },

  // Register
  register: async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      authStore.setState((state) => ({
        ...state,
        error: null,
        validationErrors: [],
      }))

      // Step 1: Register auth user
      await sdk.auth.register('customer', 'emailpass', {
        email,
        password,
      })

      // Step 2: Login immediately to get auth token
      const authResponse = await sdk.auth.login('customer', 'emailpass', {
        email,
        password,
      })

      // Process response with helper
      const token = processAuthResponse(authResponse)

      // Store in memory and localStorage
      tokenCache = token
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token)

      // Step 3: Create customer profile using httpClient
      try {
        await httpClient.post('/store/customers', {
          email,
          first_name: firstName,
          last_name: lastName,
        })
      } catch (error: any) {
        // Silent fail - customer might already exist
      }

      // Step 4: Re-login to get token with actor_id
      const finalAuthResponse = await sdk.auth.login('customer', 'emailpass', {
        email,
        password,
      })

      // Update token with the new one that has actor_id
      const finalToken = processAuthResponse(finalAuthResponse)
      tokenCache = finalToken
      storage.set(STORAGE_KEYS.AUTH_TOKEN, finalToken)

      // Step 5: Fetch customer profile using httpClient
      const data = await httpClient.get<{ customer: HttpTypes.StoreCustomer }>(
        '/store/customers/me'
      )
      authStore.setState((state) => ({
        ...state,
        user: data.customer,
        isLoading: false,
        isInitialized: true,
      }))
      return data.customer
    } catch (err: any) {
      const message = err?.message || 'Registration failed'
      authStore.setState((state) => ({
        ...state,
        error: message,
      }))
      throw new Error(message)
    }
  },

  // Logout
  logout: async () => {
    try {
      await sdk.auth.logout()
      tokenCache = null
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
      authStore.setState(() => ({
        user: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        validationErrors: [],
      }))
    } catch (err) {
      // Silent fail
    }
  },

  // Update profile
  updateProfile: async (data: Partial<HttpTypes.StoreCustomer>) => {
    try {
      authStore.setState((state) => ({ ...state, error: null }))

      const token = tokenCache || storage.get<string>(STORAGE_KEYS.AUTH_TOKEN)

      if (!token || isTokenExpired(token)) {
        throw new Error('User not authenticated')
      }

      const result = await httpClient.post<{
        customer: HttpTypes.StoreCustomer
      }>('/store/customers/me', data)
      authStore.setState((state) => ({
        ...state,
        user: result.customer,
      }))
    } catch (err: any) {
      const message = err?.message || 'Profile update failed'
      authStore.setState((state) => ({ ...state, error: message }))
      throw new Error(message)
    }
  },

  // Form helpers
  setFieldError: (field: string, message: string) => {
    authStore.setState((state) => {
      const filtered = state.validationErrors.filter((e) => e.field !== field)
      return {
        ...state,
        validationErrors: [...filtered, { field, message }],
      }
    })
  },

  setValidationErrors: (errors: ValidationError[]) => {
    authStore.setState((state) => ({
      ...state,
      validationErrors: errors,
    }))
  },

  clearErrors: () => {
    authStore.setState((state) => ({
      ...state,
      error: null,
      validationErrors: [],
    }))
  },

  clearFieldError: (field: string) => {
    authStore.setState((state) => ({
      ...state,
      validationErrors: state.validationErrors.filter((e) => e.field !== field),
    }))
  },
}
