'use client'
import { useEffect, useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import { tv } from 'ui/src/utils'
import type { NavItem } from './navigation'
import { Badge } from 'ui/src/atoms/badge'
import { RegionSelector } from './region-selector'
import { ThemeToggle } from './theme-toggle'

const mobileMenuVariants = tv({
  slots: {
    root: 'fixed inset-0 z-50 lg:hidden',
    overlay: 'fixed inset-0 bg-mobile-menu-overlay-bg transition-mobile-menu-overlay',
    panel: 'fixed right-0 top-0 h-full w-full max-w-mobile-menu-panel-max-w bg-mobile-menu-panel-bg shadow-mobile-menu-panel transition-mobile-menu-panel',
    header: 'flex items-center justify-between border-b border-mobile-menu-border p-mobile-menu-header-padding',
    title: 'text-mobile-menu-title-size font-mobile-menu-title-weight text-mobile-menu-text',
    closeButton: 'rounded-mobile-menu-close p-mobile-menu-close-padding hover:bg-mobile-menu-close-hover-bg transition-colors',
    nav: 'flex flex-col p-mobile-menu-nav-padding',
    navItem: 'block rounded-mobile-menu-item px-mobile-menu-item-x py-mobile-menu-item-y text-mobile-menu-item-size font-mobile-menu-item-weight text-mobile-menu-text hover:bg-mobile-menu-item-hover-bg transition-colors',
    submenu: 'ml-mobile-menu-submenu-indent mt-mobile-menu-submenu-gap flex flex-col gap-mobile-menu-submenu-gap',
    submenuItem: 'block rounded-mobile-menu-item px-mobile-menu-item-x py-mobile-menu-item-y text-mobile-menu-submenu-size text-mobile-menu-text hover:bg-mobile-menu-item-hover-bg transition-colors',
    divider: 'my-mobile-menu-divider-margin border-t border-mobile-menu-divider',
    settingsSection: 'mb-mobile-menu-divider-margin space-y-mobile-menu-item-y',
    settingsRow: 'flex items-center justify-between px-mobile-menu-item-x',
    settingsLabel: 'text-mobile-menu-submenu-size text-mobile-menu-text-secondary',
  },
})

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: NavItem[]
}

export function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const styles = mobileMenuVariants()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className={styles.root()}>
      <div className={styles.overlay()} onClick={onClose} />
      <div className={styles.panel()}>
        <div className={styles.header()}>
          <h2 className={styles.title()}>Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton()}
          >
            <Icon icon="icon-[mdi--close]" size="md" />
          </button>
        </div>
        <nav className={styles.nav()}>
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.role === 'submenu' && item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.title)}
                    className={`${styles.navItem()} flex w-full items-center justify-between`}
                  >
                    {item.title}
                    <Icon
                      icon={
                        expandedItems.includes(item.title)
                          ? 'icon-[mdi--chevron-up]'
                          : 'icon-[mdi--chevron-down]'
                      }
                      size="sm"
                    />
                  </button>
                  {expandedItems.includes(item.title) && (
                    <div className={styles.submenu()}>
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          onClick={onClose}
                          className={styles.submenuItem()}
                        >
                          {child.title}
                          {child.label && (
                            <Badge variant="danger" className="ml-2">
                              {child.label}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href || '#'}
                  onClick={onClose}
                  className={styles.navItem()}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
          
          {/* Divider */}
          <div className={styles.divider()} />
          
          {/* Settings section */}
          <div className={styles.settingsSection()}>
            <div className={styles.settingsRow()}>
              <span className={styles.settingsLabel()}>Region</span>
              <RegionSelector />
            </div>
            <div className={styles.settingsRow()}>
              <span className={styles.settingsLabel()}>Theme</span>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Divider */}
          <div className={styles.divider()} />
          
          {/* Auth buttons */}
          <Link href="/login" onClick={onClose} className="mb-2">
            <Button variant="tertiary" size="md" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link href="/register" onClick={onClose}>
            <Button variant="primary" size="md" className="w-full">
              Sign Up
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}