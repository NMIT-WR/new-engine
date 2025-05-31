'use client'

import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

// Get theme from DOM
const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// Subscribe to theme changes
const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {}
  
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
  
  return () => observer.disconnect()
}

export function useTheme() {
  // Use useSyncExternalStore for immediate hydration
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => 'light' // Server snapshot
  )

  const setTheme = (newTheme: Theme) => {
    // Update DOM
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    
    // Persist to localStorage
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return { theme, setTheme, toggleTheme }
}