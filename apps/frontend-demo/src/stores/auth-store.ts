import type { ValidationError } from '@/lib/auth/validation'
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
    const token = localStorage.getItem('medusa_jwt_token')
    const email = localStorage.getItem('medusa_user_email')

    if (token && email) {
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

      const token = typeof window !== 'undefined' ? localStorage.getItem('medusa_jwt_token') : null
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

      // Direct API call to get current customer
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-publishable-api-key':
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
          },
        }
      )

      console.log('[Auth Store] Fetch user response:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('[Auth Store] User data received:', data.customer?.email)
        authStore.setState((state) => ({
          ...state,
          user: data.customer,
          isLoading: false,
          isInitialized: true,
        }))
        return data.customer
      } else {
        console.error('[Auth Store] Failed to fetch user:', response.status)
        if (response.status === 401) {
          console.log('[Auth Store] Unauthorized, removing tokens')
          if (typeof window !== 'undefined') {
            localStorage.removeItem('medusa_jwt_token')
            localStorage.removeItem('medusa_user_email')
          }
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

      // Step 2: Store token and email
      if (typeof window !== 'undefined') {
        localStorage.setItem('medusa_jwt_token', token)
        localStorage.setItem('medusa_user_email', email)
      }

      // Step 3: Fetch customer profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'x-publishable-api-key':
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        authStore.setState((state) => ({
          ...state,
          user: data.customer,
          isLoading: false,
          isFormLoading: false,
        }))
      } else {
        console.error('Failed to fetch customer profile:', response.status)
        // If customer doesn't exist or unauthorized, try to create one
        if (response.status === 404 || response.status === 401) {
          const createResponse = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'x-publishable-api-key':
                  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
              },
              body: JSON.stringify({
                email,
                first_name: firstName,
                last_name: lastName,
              }),
            }
          )

          if (createResponse.ok) {
            const createData = await createResponse.json()
            authStore.setState((state) => ({
              ...state,
              user: createData.customer,
              isLoading: false,
              isFormLoading: false,
            }))
          } else {
            const errorData = await createResponse.json()
            console.log('Create customer error:', errorData)

            // If customer already exists, try fetching again
            if (
              errorData.message?.includes('already authenticated') ||
              errorData.message?.includes('already exists')
            ) {
              const retryResponse = await fetch(
                `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'x-publishable-api-key':
                      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
                  },
                }
              )

              if (retryResponse.ok) {
                const retryData = await retryResponse.json()
                authStore.setState((state) => ({
                  ...state,
                  user: retryData.customer,
                  isLoading: false,
                  isFormLoading: false,
                }))
              }
            }
          }
        }
      }

      // Step 4: Clear anonymous cart ID (cart will be merged automatically)
      if (typeof window !== 'undefined') {
        const anonymousCartId = localStorage.getItem('medusa_cart_id')
        if (anonymousCartId) {
          localStorage.removeItem('medusa_cart_id')
        }
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

      // Step 2: Auto-login which will create customer profile
      await authHelpers.login(email, password, firstName, lastName)
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('medusa_jwt_token')
        localStorage.removeItem('medusa_user_email')
      }
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

      const token = typeof window !== 'undefined' ? localStorage.getItem('medusa_jwt_token') : null

      if (!token) throw new Error('User not authenticated')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-publishable-api-key':
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
          },
          body: JSON.stringify(data),
        }
      )

      if (response.ok) {
        const result = await response.json()
        authStore.setState((state) => ({
          ...state,
          user: result.customer,
        }))
      } else {
        throw new Error('Failed to update profile')
      }
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
