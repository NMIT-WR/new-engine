'use client'

import { authHelpers, authStore } from '@/stores/auth-store'
import { useStore } from '@tanstack/react-store'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useToast } from 'ui/src/molecules/toast'

export function useAuth() {
  const authState = useStore(authStore)
  const router = useRouter()
  const toast = useToast()

  // Initialize auth on mount
  useEffect(() => {
    console.log(
      '[useAuth] Effect running, isInitialized:',
      authState.isInitialized,
      'isLoading:',
      authState.isLoading
    )
    if (!authState.isInitialized) {
      console.log('[useAuth] Calling fetchUser')
      authHelpers.fetchUser()
    }
  }, [authState.isInitialized])

  // Enhanced login with navigation
  const login = useCallback(
    async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string
    ) => {
      await authHelpers.login(email, password, firstName, lastName)

      // Only redirect if not on test page
      if (!window.location.pathname.includes('/test-auth')) {
        router.push('/')
      }
    },
    [router]
  )

  // Enhanced logout with navigation
  const logout = useCallback(async () => {
    await authHelpers.logout()
    router.push('/')
  }, [router])

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
    isLoading: authState.isLoading,
    isInitialized: authState.isInitialized,
    error: authState.error,

    // Auth actions
    login,
    register: authHelpers.register,
    logout,
    updateProfile: authHelpers.updateProfile,
    refetch: authHelpers.fetchUser,

    // Form state
    isFormLoading: authState.isFormLoading,
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
