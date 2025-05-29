'use client'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Icon, type IconType } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import { tv } from 'ui/src/utils'
import { type NavItem, Navigation } from './navigation'

const headerVariants = tv({
  slots: {
    root: 'bg-header-bg shadow-header-default',
    container: 'mx-auto max-w-header-max-w px-header-container-x',
    wrapper: 'flex h-header-height items-center justify-between',
    logoSection: 'flex items-center',
    logo: 'text-header-logo font-header-logo flex items-center gap-header-logo-gap text-header-text',
    navSection: 'ml-header-nav-margin hidden md:block',
    actionsSection: 'flex items-center gap-header-actions-gap',
    mobileMenuButton:
      'md:hidden inline-flex items-center justify-center rounded-header-mobile-menu p-header-mobile-menu-padding text-header-mobile-menu-text hover:bg-header-mobile-menu-hover hover:text-header-mobile-menu-text-hover focus:outline-none focus:ring-header-mobile-menu-width focus:ring-inset focus:ring-header-mobile-menu-color',
    userMenu: 'flex items-center gap-header-user-menu-gap',
  },
})

export interface HeaderProps extends ComponentPropsWithoutRef<'header'> {
  logo?: {
    text?: string
    icon?: IconType
    href?: string
  }
  navigationItems?: NavItem[]
  actions?: ReactNode
  showMobileMenu?: boolean
  user?: {
    name: string
    avatar?: string
  }
}

export function Header({
  logo = { text: 'Logo', href: '/' },
  navigationItems = [],
  actions,
  showMobileMenu = true,
  user,
  className,
  ...props
}: HeaderProps) {
  const {
    root,
    container,
    wrapper,
    logoSection,
    logo: logoSlot,
    navSection,
    actionsSection,
    mobileMenuButton,
    userMenu,
  } = headerVariants()

  return (
    <header className={root({ className })} {...props}>
      <div className={container()}>
        <div className={wrapper()}>
          {/* Logo Section */}
          <div className={logoSection()}>
            <Link href={logo.href || '/'} className={logoSlot()}>
              {logo.icon && <Icon icon={logo.icon} size="lg" />}
              {logo.text && <span>{logo.text}</span>}
            </Link>

            {/* Navigation */}
            {navigationItems.length > 0 && (
              <div className={navSection()}>
                <Navigation items={navigationItems} />
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className={actionsSection()}>
            {/* Custom actions */}
            {actions}

            {/* User menu */}
            {user ? (
              <div className={userMenu()}>
                <Button
                  variant="tertiary"
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--account-circle]"
                >
                  {user.name}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="tertiary" theme="borderless" size="sm">
                  Sign In
                </Button>
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            {showMobileMenu && (
              <button type="button" className={mobileMenuButton()}>
                <Icon icon="icon-[mdi--menu]" size="md" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
