'use client'

import { useTheme } from '@/hooks/use-theme'
import { Icon } from '@ui/atoms/icon'
import { Switch } from '@ui/molecules/switch'

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
            className="text-theme-toggle-icon-size text-theme-toggle-sun-inactive transition-colors data-[active]:text-theme-toggle-sun-active"
            data-active
          />
          <div className="w-theme-toggle-width" />
          <Icon
            icon="icon-[mdi--moon-and-stars]"
            className="text-theme-toggle-icon-size text-theme-toggle-moon-inactive transition-colors data-[active]:text-theme-toggle-moon-active"
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
          className="text-theme-toggle-icon-size text-theme-toggle-sun-inactive transition-colors data-[active]:text-theme-toggle-sun-active"
          data-active={isDark ? undefined : ''}
        />
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className="w-theme-toggle-width"
        >
          <span className="sr-only">Přepnout tmavý režim</span>
        </Switch>
        <Icon
          icon="icon-[mdi--moon-and-stars]"
          className="text-theme-toggle-icon-size text-theme-toggle-moon-inactive transition-colors data-[active]:text-theme-toggle-moon-active"
          data-active={isDark ? '' : undefined}
        />
      </div>
    </div>
  )
}
