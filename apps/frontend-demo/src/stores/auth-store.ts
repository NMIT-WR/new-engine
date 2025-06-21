import type { ValidationError } from '@/lib/auth/validation'
import { STORAGE_KEYS } from '@/lib/constants'
import { httpClient } from '@/lib/http-client'
import { storage } from '@/lib/local-storage'
import { sdk } from '@/lib/medusa-client'
import type { HttpTypes } from '@medusajs/types'
import { Store } from '@tanstack/react-store'

export interface AuthState {
  // Auth state
  user: HttpTypes.StoreCustomer | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean

  // Form state
  isFormLoading: boolean
  validationErrors: ValidationError[]
}

// Helper function to load auth from localStorage
function loadAuthFromStorage(): Partial<AuthState> {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,
      isFormLoading: false,
      validationErrors: [],
    }
  }

  try {
    const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN)

    if (token) {
      return {
        isLoading: false, // Don't set loading here, fetchUser will handle it
        error: null,
        isInitialized: false,
        isFormLoading: false,
        validationErrors: [],
      }
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error)
  }
  return {
    user: null,
    isLoading: false,
    error: null,
    isInitialized: false,
    isFormLoading: false,
    validationErrors: [],
  }
}

// Create the auth store
export const authStore = new Store<AuthState>({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  isFormLoading: false,
  validationErrors: [],
})

// Initialize auth from localStorage on client side
if (typeof window !== 'undefined') {
  const initialState = loadAuthFromStorage()
  console.log('[Auth Store] Initial state from storage:', initialState)
  authStore.setState((state) => ({ ...state, ...initialState }))
}

// Helper functions
export const authHelpers = {
  // Fetch current user
  fetchUser: async () => {
    console.log('[Auth Store] fetchUser called')
    try {
      authStore.setState((state) => ({
        ...state,
        isLoading: true,
        error: null,
      }))

      const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN)
      console.log('[Auth Store] Token found:', !!token)

      if (!token) {
        console.log('[Auth Store] No token, setting user to null')
        authStore.setState((state) => ({
          ...state,
          user: null,
          isLoading: false,
          isInitialized: true,
        }))
        return null
      }

      // Use httpClient instead of direct fetch
      try {
        const data = await httpClient.get<{
          customer: HttpTypes.StoreCustomer
        }>('/store/customers/me')
        console.log('[Auth Store] User data received:', data.customer?.email)
        authStore.setState((state) => ({
          ...state,
          user: data.customer,
          isLoading: false,
          isInitialized: true,
        }))
        return data.customer
      } catch (error: any) {
        console.error('[Auth Store] Failed to fetch user:', error)
        if (error.status === 401) {
          console.log('[Auth Store] Unauthorized, removing token')
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
      console.error('Failed to fetch user:', err)
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
        isFormLoading: true,
        validationErrors: [],
      }))

      // Step 1: Authenticate
      const authResponse = await sdk.auth.login('customer', 'emailpass', {
        email,
        password,
      })

      // Check if response is a string (token) or object with location
      let token: string
      if (typeof authResponse === 'string') {
        token = authResponse
      } else if (
        authResponse &&
        typeof authResponse === 'object' &&
        'token' in authResponse
      ) {
        token = (authResponse as unknown as { token: string }).token
      } else {
        throw new Error('Invalid auth response')
      }

      // Step 2: Store token only (not email)
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
          isFormLoading: false,
        }))
      } catch (error: any) {
        console.error('Failed to fetch customer profile:', error)
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
              isFormLoading: false,
            }))
          } catch (createError: any) {
            console.log('Create customer error:', createError)

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
                  isFormLoading: false,
                }))
              } catch (retryError) {
                console.error('Retry fetch failed:', retryError)
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
        isFormLoading: false,
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
        isFormLoading: true,
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

      // Store the initial token
      let token: string
      if (typeof authResponse === 'string') {
        token = authResponse
      } else if (
        authResponse &&
        typeof authResponse === 'object' &&
        'token' in authResponse
      ) {
        token = (authResponse as any).token
      } else {
        throw new Error('Invalid auth response')
      }

      storage.set(STORAGE_KEYS.AUTH_TOKEN, token)

      // Step 3: Create customer profile using httpClient
      try {
        await httpClient.post('/store/customers', {
          email,
          first_name: firstName,
          last_name: lastName,
        })
      } catch (error: any) {
        console.log('[Auth Store] Customer creation failed:', error)
      }

      // Step 4: Re-login to get token with actor_id
      const finalAuthResponse = await sdk.auth.login('customer', 'emailpass', {
        email,
        password,
      })

      // Update token with the new one that has actor_id
      if (typeof finalAuthResponse === 'string') {
        token = finalAuthResponse
      } else if (
        finalAuthResponse &&
        typeof finalAuthResponse === 'object' &&
        'token' in finalAuthResponse
      ) {
        token = (finalAuthResponse as any).token
      }

      storage.set(STORAGE_KEYS.AUTH_TOKEN, token)

      // Step 5: Fetch customer profile using httpClient
      const data = await httpClient.get<{ customer: HttpTypes.StoreCustomer }>(
        '/store/customers/me'
      )
      authStore.setState((state) => ({
        ...state,
        user: data.customer,
        isLoading: false,
        isFormLoading: false,
        isInitialized: true,
      }))
      return data.customer
    } catch (err: any) {
      const message = err?.message || 'Registration failed'
      authStore.setState((state) => ({
        ...state,
        error: message,
        isFormLoading: false,
      }))
      throw new Error(message)
    }
  },

  // Logout
  logout: async () => {
    try {
      await sdk.auth.logout()
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
      authStore.setState(() => ({
        user: null,
        isLoading: false,
        error: null,
        isInitialized: true,
        isFormLoading: false,
        validationErrors: [],
      }))
    } catch (err) {
      console.error('Logout failed:', err)
    }
  },

  // Update profile
  updateProfile: async (data: Partial<HttpTypes.StoreCustomer>) => {
    try {
      authStore.setState((state) => ({ ...state, error: null }))

      const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN)

      if (!token) throw new Error('User not authenticated')

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

  setFormLoading: (loading: boolean) => {
    authStore.setState((state) => ({ ...state, isFormLoading: loading }))
  },
}
