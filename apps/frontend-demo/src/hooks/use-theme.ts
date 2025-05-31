import { useStore } from '@tanstack/react-store'
import { themeStore, themeHelpers } from '../lib/theme-store'

export function useTheme() {
  const { theme, isLoaded } = useStore(themeStore)
  
  return {
    theme,
    isLoaded,
    setTheme: themeHelpers.setTheme,
    toggleTheme: themeHelpers.toggleTheme,
  }
}