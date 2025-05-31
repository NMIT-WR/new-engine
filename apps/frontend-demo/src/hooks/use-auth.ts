import { useStore } from '@tanstack/react-store'
import { authStore, authHelpers } from '../stores/auth-store'

export function useAuth() {
  const { user, isLoading, initialized } = useStore(authStore)
  
  return {
    user,
    isLoading,
    initialized,
    isAuthenticated: !!user,
    signIn: authHelpers.signIn,
    signUp: authHelpers.signUp,
    signOut: authHelpers.signOut,
    resetPassword: authHelpers.resetPassword,
  }
}