import { Store } from '@tanstack/react-store'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  isLoaded: boolean
}

// Get initial theme from DOM or localStorage
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  // Check localStorage first - user preference takes priority
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored) return stored
  
  // If no stored preference, check if theme is already set on documentElement
  if (document.documentElement.classList.contains('dark')) return 'dark'
  if (document.documentElement.classList.contains('light')) return 'light'
  
  // Finally check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Create centralized theme store
export const themeStore = new Store<ThemeState>({
  theme: 'light', // Always start with light during SSR
  isLoaded: false, // Not loaded until client-side
})
  
// Initialize theme on client-side only
if (typeof window !== 'undefined') {
  // Set initial theme from DOM/localStorage
  const initialTheme = getInitialTheme()
  themeStore.setState({ theme: initialTheme, isLoaded: true })
  
  // Listen for storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) {
      const newTheme = e.newValue as Theme
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
      themeStore.setState((state) => ({ ...state, theme: newTheme }))
    }
  })
}

// Theme helpers
export const themeHelpers = {
  setTheme: (theme: Theme) => {
    // Update DOM
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    
    // Update localStorage
    localStorage.setItem('theme', theme)
    
    // Update store
    themeStore.setState((state) => ({ ...state, theme }))
  },
  
  toggleTheme: () => {
    const currentTheme = themeStore.state.theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    themeHelpers.setTheme(newTheme)
  },
  
  getTheme: () => themeStore.state.theme,
}