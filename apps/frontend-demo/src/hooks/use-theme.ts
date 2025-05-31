'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function useTheme() {
  const { theme, setTheme: setNextTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setNextTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: mounted ? resolvedTheme : 'light',
    setTheme: setNextTheme,
    toggleTheme,
    mounted
  }
}