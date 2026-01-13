"use client"

import { Icon } from "@techsio/ui-kit/atoms/icon"
import { Switch } from "@techsio/ui-kit/molecules/switch"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  const isDark = theme === "dark"

  // Don't render switch until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center gap-theme-toggle-gap">
        <div className="flex items-center gap-theme-toggle-icon-gap">
          <Icon
            className="text-theme-toggle-icon-size text-theme-toggle-sun-inactive transition-colors data-[active]:text-theme-toggle-sun-active"
            data-active
            icon="token-icon-sun"
          />
          <div className="w-theme-toggle-width" />
          <Icon
            className="text-theme-toggle-icon-size text-theme-toggle-moon-inactive transition-colors data-[active]:text-theme-toggle-moon-active"
            icon="token-icon-moon"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-theme-toggle-gap">
      <div className="flex items-center gap-theme-toggle-icon-gap">
        <Icon
          className="text-theme-toggle-icon-size text-theme-toggle-sun-inactive transition-colors data-[active]:text-theme-toggle-sun-active"
          data-active={isDark ? undefined : ""}
          icon="token-icon-sun"
        />
        <Switch checked={isDark} className="w-14" onCheckedChange={toggleTheme}>
          <span className="sr-only">Přepnout tmavý režim</span>
        </Switch>
        <Icon
          className="text-theme-toggle-icon-size text-theme-toggle-moon-inactive transition-colors data-[active]:text-theme-toggle-moon-active"
          data-active={isDark ? "" : undefined}
          icon="token-icon-moon"
        />
      </div>
    </div>
  )
}
