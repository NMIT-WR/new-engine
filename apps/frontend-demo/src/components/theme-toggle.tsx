'use client'

import { Icon } from 'ui/src/atoms/icon'
import { Switch } from 'ui/src/molecules/switch'
import { useTheme } from '../hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  const isDark = theme === 'dark'

  // Don't render switch until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center gap-theme-toggle-gap">
        <div className="flex items-center gap-theme-toggle-icon-gap">
          <Icon
            icon="icon-[mdi--white-balance-sunny]"
            className="text-theme-toggle-sun-inactive data-[active]:text-theme-toggle-sun-active transition-colors text-theme-toggle-icon-size"
            data-active
          />
          <div className="w-theme-toggle-width" />
          <Icon
            icon="icon-[mdi--moon-and-stars]"
            className="text-theme-toggle-moon-inactive data-[active]:text-theme-toggle-moon-active transition-colors text-theme-toggle-icon-size"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-theme-toggle-gap">
      <div className="flex items-center gap-theme-toggle-icon-gap">
        <Icon
          icon="icon-[mdi--white-balance-sunny]"
          className="text-theme-toggle-sun-inactive data-[active]:text-theme-toggle-sun-active transition-colors text-theme-toggle-icon-size"
          data-active={isDark ? undefined : ''}
        />
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="w-theme-toggle-width"
        >
          <span className="sr-only">Toggle dark mode</span>
        </Switch>
        <Icon
          icon="icon-[mdi--moon-and-stars]"
          className="text-theme-toggle-moon-inactive data-[active]:text-theme-toggle-moon-active transition-colors text-theme-toggle-icon-size"
          data-active={isDark ? '' : undefined}
        />
      </div>
    </div>
  )
}