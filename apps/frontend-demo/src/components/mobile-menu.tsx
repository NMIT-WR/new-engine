'use client'
import { useEffect, useState } from 'react'
import { Badge } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Icon } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import type { NavItem } from './navigation'
import { RegionSelector } from './region-selector'
import { ThemeToggle } from './theme-toggle'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: NavItem[]
}

export function MobileMenu({
  isOpen,
  onClose,
  navigationItems,
}: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

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
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-mobile-menu-overlay-bg transition-mobile-menu-overlay" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-mobile-menu-panel-max-w bg-mobile-menu-panel-bg shadow-mobile-menu-panel transition-mobile-menu-panel">
        <div className="flex items-center justify-between border-b border-mobile-menu-border p-mobile-menu-header-padding">
          <h2 className="text-mobile-menu-title-size font-mobile-menu-title-weight text-mobile-menu-text">Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-mobile-menu-close p-mobile-menu-close-padding hover:bg-mobile-menu-close-hover-bg transition-colors"
          >
            <Icon icon="icon-[mdi--close]" size="md" />
          </button>
        </div>
        <nav className="flex flex-col p-mobile-menu-nav-padding">
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.role === 'submenu' && item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.title)}
                    className="block rounded-mobile-menu-item px-mobile-menu-item-x py-mobile-menu-item-y text-mobile-menu-item-size font-mobile-menu-item-weight text-mobile-menu-text hover:bg-mobile-menu-item-hover-bg transition-colors flex w-full items-center justify-between"
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
                    <div className="ml-mobile-menu-submenu-indent mt-mobile-menu-submenu-gap flex flex-col gap-mobile-menu-submenu-gap">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          onClick={onClose}
                          className="block rounded-mobile-menu-item px-mobile-menu-item-x py-mobile-menu-item-y text-mobile-menu-submenu-size text-mobile-menu-text hover:bg-mobile-menu-item-hover-bg transition-colors"
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
                  className="block rounded-mobile-menu-item px-mobile-menu-item-x py-mobile-menu-item-y text-mobile-menu-item-size font-mobile-menu-item-weight text-mobile-menu-text hover:bg-mobile-menu-item-hover-bg transition-colors"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className="my-mobile-menu-divider-margin border-t border-mobile-menu-divider" />

          {/* Settings section */}
          <div className="mb-mobile-menu-divider-margin space-y-mobile-menu-item-y">
            <div className="flex items-center justify-between px-mobile-menu-item-x">
              <span className="text-mobile-menu-submenu-size text-mobile-menu-text-secondary">Region</span>
              <RegionSelector />
            </div>
            <div className="flex items-center justify-between px-mobile-menu-item-x">
              <span className="text-mobile-menu-submenu-size text-mobile-menu-text-secondary">Theme</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Divider */}
          <div className="my-mobile-menu-divider-margin border-t border-mobile-menu-divider" />

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