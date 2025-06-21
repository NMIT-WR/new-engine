'use client'

import { queryKeys } from '@/lib/query-keys'
import { authHelpers, authStore } from '@/stores/auth-store'
import type { HttpTypes } from '@medusajs/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { useToast } from '@ui/molecules/toast'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

export function useAuth() {
  const authState = useStore(authStore)
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()

  // Use React Query for initial auth check
  const { data: currentUser } = useQuery({
    queryKey: queryKeys.auth.customer(),
    queryFn: authHelpers.fetchUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: !authState.isInitialized,
  })

  // Update store when query data changes
  useEffect(() => {
    if (currentUser !== undefined && !authState.isInitialized) {
      authStore.setState((state) => ({
        ...state,
        user: currentUser,
        isInitialized: true,
        isLoading: false,
      }))
    }
  }, [currentUser, authState.isInitialized])

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string
      password: string
      firstName?: string
      lastName?: string
    }) => {
      return authHelpers.login(email, password, firstName, lastName)
    },
    onSuccess: () => {
      // Invalidate auth queries to refetch user
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.customer() })

      // Only redirect if not on test page
      if (!window.location.pathname.includes('/test-auth')) {
        router.push('/')
      }

      toast.create({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toast.create({
        title: 'Login failed',
        description: error.message,
        type: 'error',
      })
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string
      password: string
      firstName?: string
      lastName?: string
    }) => {
      return authHelpers.register(email, password, firstName, lastName)
    },
    onSuccess: () => {
      // Invalidate auth queries to refetch user
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.customer() })

      // Only redirect if not on test page
      if (!window.location.pathname.includes('/test-auth')) {
        router.push('/')
      }

      toast.create({
        title: 'Account created!',
        description: 'Welcome to our store.',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toast.create({
        title: 'Registration failed',
        description: error.message,
        type: 'error',
      })
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authHelpers.logout,
    onSuccess: () => {
      // Invalidate all queries since user context changed
      queryClient.invalidateQueries()
      router.push('/')

      toast.create({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
        type: 'success',
      })
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<HttpTypes.StoreCustomer>) => {
      return authHelpers.updateProfile(data)
    },
    onSuccess: () => {
      // Invalidate auth queries to refetch updated user
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.customer() })

      toast.create({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
        type: 'success',
      })
    },
    onError: (error: Error) => {
      toast.create({
        title: 'Update failed',
        description: error.message,
        type: 'error',
      })
    },
  })

  // Form helpers with toast notifications
  const showError = useCallback(
    (title: string, description: string) => {
      toast.create({
        title,
        description,
        type: 'error',
      })
    },
    [toast]
  )

  const showSuccess = useCallback(
    (title: string, description: string) => {
      toast.create({
        title,
        description,
        type: 'success',
      })
    },
    [toast]
  )

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return authState.validationErrors.find((e) => e.field === field)?.message
    },
    [authState.validationErrors]
  )

  // Password strength checker
  const usePasswordStrength = useCallback((password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    }

    const strength = Object.values(requirements).filter(Boolean).length
    const isValid = strength === 4

    return {
      requirements,
      strength,
      isValid,
    }
  }, [])

  return {
    // Auth state
    user: authState.user,
    isLoading:
      authState.isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending,
    isInitialized: authState.isInitialized,
    error: authState.error,

    // Auth actions with mutations
    login: (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string
    ) => loginMutation.mutate({ email, password, firstName, lastName }),
    register: (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string
    ) => registerMutation.mutate({ email, password, firstName, lastName }),
    logout: () => logoutMutation.mutate(),
    updateProfile: (data: Partial<HttpTypes.StoreCustomer>) =>
      updateProfileMutation.mutate(data),
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.customer() }),

    // Mutation states
    loginMutation,
    registerMutation,
    logoutMutation,
    updateProfileMutation,

    // Form state
    isFormLoading:
      authState.isFormLoading ||
      loginMutation.isPending ||
      registerMutation.isPending,
    validationErrors: authState.validationErrors,

    // Form actions
    setFieldError: authHelpers.setFieldError,
    setValidationErrors: authHelpers.setValidationErrors,
    clearErrors: authHelpers.clearErrors,
    clearFieldError: authHelpers.clearFieldError,
    setFormLoading: authHelpers.setFormLoading,
    getFieldError,

    // Toast notifications
    showError,
    showSuccess,

    // Password validation
    usePasswordStrength,
  }
}
