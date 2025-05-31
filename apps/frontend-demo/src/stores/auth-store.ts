import { Store } from '@tanstack/react-store'

interface User {
  id: string
  email: string | null
  created_at?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
}

// Create auth store
export const authStore = new Store<AuthState>({
  user: null,
  isLoading: false,
})

// Mock auth implementation for demo
const MOCK_USER_KEY = 'mock_auth_user'

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem(MOCK_USER_KEY)
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      authStore.setState({ user, isLoading: false })
    } catch {
      localStorage.removeItem(MOCK_USER_KEY)
    }
  }
}

// Auth helpers
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    
    if (password.length < 8) {
      throw new Error('Invalid credentials')
    }
    
    // Create mock user
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    }
    
    // Store in localStorage
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
    
    // Update store
    authStore.setState({ user, isLoading: false })
    
    return { user }
  },

  signUp: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation
    if (!email || !password) {
      throw new Error('Email and password are required')
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    
    if (!email.includes('@')) {
      throw new Error('Invalid email address')
    }
    
    // For demo, check if user already exists
    const existingUser = localStorage.getItem(MOCK_USER_KEY)
    if (existingUser) {
      const parsed = JSON.parse(existingUser)
      if (parsed.email === email) {
        throw new Error('User already exists')
      }
    }
    
    // Create mock user
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    }
    
    // Don't auto-login on signup
    return { user }
  },

  signOut: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Clear localStorage
    localStorage.removeItem(MOCK_USER_KEY)
    
    // Update store
    authStore.setState({ user: null, isLoading: false })
  },

  resetPassword: async (email: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address')
    }
    
    // Mock success
    console.log(`Password reset email sent to ${email}`)
  },
}