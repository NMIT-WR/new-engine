'use client'
import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'
import { Badge } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Icon, type IconType } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import { tv } from 'ui/src/utils'
import { MobileMenu } from './mobile-menu'
import { type NavItem, Navigation } from './navigation'
import { RegionSelector } from './region-selector'
import { ThemeToggle } from './theme-toggle'

const headerVariants = tv({
  slots: {
    root: 'bg-header-bg shadow-header-default',
    container:
      'mx-auto max-w-header-max-w px-header-container-x lg:px-header-container-x-lg',
    wrapper:
      'flex h-header-height lg:h-header-height-lg items-center justify-between',
    logoSection: 'flex items-center',
    logo: 'text-header-logo lg:text-header-logo-lg font-header-logo flex items-center gap-header-logo-gap text-header-text',
    navSection: 'ml-header-nav-margin hidden lg:block',
    actionsSection:
      'flex items-center gap-header-actions-gap lg:gap-header-actions-gap-lg',
    mobileMenuButton:
      'lg:hidden inline-flex items-center justify-center rounded-header-mobile-menu p-header-mobile-menu-padding text-header-mobile-menu-text hover:bg-header-mobile-menu-hover hover:text-header-mobile-menu-text-hover focus:outline-none focus:ring-header-mobile-menu-width focus:ring-inset focus:ring-header-mobile-menu-color',
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
  cartItemsCount?: number
}

export function Header({
  logo = { text: 'Logo', href: '/' },
  navigationItems = [],
  actions,
  showMobileMenu = true,
  user,
  cartItemsCount = 0,
  className,
  ...props
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            {/* Desktop utilities */}
            <div className="hidden items-center gap-2 lg:flex">
              <RegionSelector />
              <ThemeToggle />
            </div>

            {/* Vertical divider - desktop only */}
            <div className="hidden h-5 w-px bg-header-divider lg:block" />

            {/* Core actions - all sizes */}
            <div className="flex items-center">
              {/* Search button */}
              <Link href="/search">
                <Button
                  variant="tertiary"
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--magnify]"
                  aria-label="Search"
                />
              </Link>

              {/* Cart button */}
              <div className="relative">
                <Link href="/cart">
                  <Button
                    variant="tertiary"
                    theme="borderless"
                    size="sm"
                    icon="icon-[mdi--cart-outline]"
                    aria-label="Shopping cart"
                  />
                </Link>
                {cartItemsCount > 0 && (
                  <Badge
                    variant="danger"
                    className="-right-1 -top-1 absolute flex h-4 w-4 min-w-4 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount.toString()}
                  </Badge>
                )}
              </div>

              {/* User/Auth section */}
              {user ? (
                <Button
                  variant="tertiary"
                  theme="borderless"
                  size="sm"
                  icon="icon-[mdi--account-circle]"
                  aria-label={user.name}
                >
                  <span className="hidden lg:inline">{user.name}</span>
                </Button>
              ) : (
                <Link href="/login">
                  <Button
                    variant="tertiary"
                    theme="borderless"
                    size="sm"
                    icon="icon-[mdi--account-outline]"
                    aria-label="Sign in"
                  />
                </Link>
              )}

              {/* Custom actions */}
              {actions}

              {/* Mobile menu button */}
              {showMobileMenu && (
                <button
                  type="button"
                  className={mobileMenuButton()}
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Icon icon="icon-[mdi--menu]" size="md" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />
    </header>
  )
}

export default Header
