import { Store } from '@tanstack/react-store'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  initialized: boolean
}

// Create auth store
export const authStore = new Store<AuthState>({
  user: null,
  isLoading: true,
  initialized: false,
})

// Initialize auth state from Supabase session
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data: { session } }) => {
    authStore.setState({
      user: session?.user ?? null,
      isLoading: false,
      initialized: true,
    })
  })

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    authStore.setState({
      user: session?.user ?? null,
      isLoading: false,
      initialized: true,
    })
  })
}

// Auth helpers
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    authStore.setState((state) => ({ ...state, isLoading: true }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      return { user: data.user }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in')
    } finally {
      authStore.setState((state) => ({ ...state, isLoading: false }))
    }
  },

  signUp: async (email: string, password: string) => {
    authStore.setState((state) => ({ ...state, isLoading: true }))
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      return { user: data.user }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign up')
    } finally {
      authStore.setState((state) => ({ ...state, isLoading: false }))
    }
  },

  signOut: async () => {
    authStore.setState((state) => ({ ...state, isLoading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out')
    } finally {
      authStore.setState((state) => ({ ...state, isLoading: false }))
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email')
    }
  },
}