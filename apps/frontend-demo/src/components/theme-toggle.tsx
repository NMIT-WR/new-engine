'use client'

import { useEffect, useState } from 'react'
import { Icon } from 'ui/src/atoms/icon'
import { Switch } from 'ui/src/molecules/switch'
import { tv } from 'ui/src/utils'

const themeToggleVariants = tv({
  slots: {
    root: 'flex items-center gap-theme-toggle-gap',
    iconWrapper: 'flex items-center gap-theme-toggle-icon-gap',
    sunIcon:
      'text-theme-toggle-light data-[state=light]:text-theme-toggle-light-active',
    moonIcon:
      'text-theme-toggle-dark-active data-[state=light]:text-theme-toggle-dark',
    toggleSwitch: 'w-8',
  },
  compoundSlots: [
    {
      slots: ['moonIcon', 'sunIcon'],
      class: 'font-bold',
    },
  ],
})

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)
  const { sunIcon, moonIcon, root, iconWrapper, toggleSwitch } =
    themeToggleVariants()

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(savedTheme)
    } else {
      // Use system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      setTheme(systemTheme)
    }
  }, [])

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light'
    setTheme(newTheme)

    // Update DOM
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)

    // Save preference
    localStorage.setItem('theme', newTheme)
  }

  // Don't render until we know the theme to avoid hydration mismatch
  if (theme === null) {
    return null
  }

  return (
    <div className={root()}>
      <div className={iconWrapper()}>
        <Icon
          icon="icon-[mdi--white-balance-sunny]"
          className={sunIcon()}
          data-state={theme}
        />
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={(checked) => toggleTheme(checked)}
          className={toggleSwitch()}
        >
          <span className="sr-only">Toggle dark mode</span>
        </Switch>
        <Icon
          icon="icon-[mdi--moon-and-stars]"
          className={moonIcon()}
          data-state={theme}
        />
      </div>
    </div>
  )
}
