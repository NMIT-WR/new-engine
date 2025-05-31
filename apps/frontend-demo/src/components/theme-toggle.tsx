'use client'

import { useStore } from '@tanstack/react-store'
import { Icon } from 'ui/src/atoms/icon'
import { Switch } from 'ui/src/molecules/switch'
import { tv } from 'ui/src/utils'
import { themeStore, themeHelpers } from '../lib/theme-store'
import { useEffect, useState } from 'react'

const themeToggleVariants = tv({
  slots: {
    root: 'flex items-center gap-theme-toggle-gap',
    iconWrapper: 'flex items-center gap-theme-toggle-icon-gap',
    sunIcon:
      'text-theme-toggle-sun-inactive data-[state=light]:text-theme-toggle-sun-active data-[state=dark]:text-theme-toggle-sun-inactive transition-colors',
    moonIcon:
      'text-theme-toggle-moon-inactive data-[state=dark]:text-theme-toggle-moon-active data-[state=light]:text-theme-toggle-moon-inactive transition-colors',
    toggleSwitch: 'w-theme-toggle-width',
  },
  compoundSlots: [
    {
      slots: ['moonIcon', 'sunIcon'],
      class: 'text-theme-toggle-icon-size',
    },
  ],
})

export function ThemeToggle() {
  const { theme } = useStore(themeStore)
  const { sunIcon, moonIcon, root, iconWrapper, toggleSwitch } =
    themeToggleVariants()
  
  // Track mounted state to handle SSR/hydration
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (checked: boolean) => {
    themeHelpers.setTheme(checked ? 'dark' : 'light')
  }
  
  // During SSR and initial hydration, show default state
  // After mount, show the actual theme from DOM/localStorage
  const currentTheme = mounted ? theme : 'light'

  return (
    <div className={root()}>
      <div className={iconWrapper()}>
        <Icon
          icon="icon-[mdi--white-balance-sunny]"
          className={sunIcon()}
          data-state={currentTheme}
        />
        <Switch
          checked={currentTheme === 'dark'}
          onCheckedChange={handleThemeChange}
          className={toggleSwitch()}
        >
          <span className="sr-only">Toggle dark mode</span>
        </Switch>
        <Icon
          icon="icon-[mdi--moon-and-stars]"
          className={moonIcon()}
          data-state={currentTheme}
        />
      </div>
    </div>
  )
}
