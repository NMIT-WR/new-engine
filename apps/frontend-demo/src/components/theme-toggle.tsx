'use client'

import { Icon } from 'ui/src/atoms/icon'
import { Switch } from 'ui/src/molecules/switch'
import { tv } from 'ui/src/utils'
import { useTheme } from '../hooks/use-theme'

const themeToggleVariants = tv({
  slots: {
    root: 'flex items-center gap-theme-toggle-gap',
    iconWrapper: 'flex items-center gap-theme-toggle-icon-gap',
    sunIcon:
      'text-theme-toggle-sun-inactive data-[active]:text-theme-toggle-sun-active transition-colors',
    moonIcon:
      'text-theme-toggle-moon-inactive data-[active]:text-theme-toggle-moon-active transition-colors',
    toggleSwitch: 'w-theme-toggle-width',
    icon: 'text-theme-toggle-icon-size',
  },
})

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  const styles = themeToggleVariants()
  
  const isDark = theme === 'dark'

  // Don't render switch until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className={styles.root()}>
        <div className={styles.iconWrapper()}>
          <Icon
            icon="icon-[mdi--white-balance-sunny]"
            className={`${styles.sunIcon()} ${styles.icon()}`}
            data-active
          />
          <div className={styles.toggleSwitch()} />
          <Icon
            icon="icon-[mdi--moon-and-stars]"
            className={`${styles.moonIcon()} ${styles.icon()}`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root()}>
      <div className={styles.iconWrapper()}>
        <Icon
          icon="icon-[mdi--white-balance-sunny]"
          className={`${styles.sunIcon()} ${styles.icon()}`}
          data-active={!isDark ? '' : undefined}
        />
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className={styles.toggleSwitch()}
        >
          <span className="sr-only">Toggle dark mode</span>
        </Switch>
        <Icon
          icon="icon-[mdi--moon-and-stars]"
          className={`${styles.moonIcon()} ${styles.icon()}`}
          data-active={isDark ? '' : undefined}
        />
      </div>
    </div>
  )
}