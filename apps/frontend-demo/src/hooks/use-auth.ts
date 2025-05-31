import { useStore } from '@tanstack/react-store'
import { authStore, authHelpers } from '../stores/auth-store'

export function useAuth() {
  const { user, isLoading } = useStore(authStore)
  
  return {
    user,
    isLoading,
    signIn: authHelpers.signIn,
    signUp: authHelpers.signUp,
    signOut: authHelpers.signOut,
  }
}