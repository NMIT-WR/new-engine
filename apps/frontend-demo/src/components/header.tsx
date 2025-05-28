'use client'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Icon, type IconType } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import { tv } from 'ui/src/utils'
import { type NavItem, Navigation } from './navigation'

const headerVariants = tv({
  slots: {
    root: 'bg-white shadow-sm',
    container: 'mx-auto max-w-7xl px-4',
    wrapper: 'flex h-16 items-center justify-between',
    logoSection: 'flex items-center',
    logo: 'text-xl font-bold flex items-center gap-2 text-slate-900',
    navSection: 'ml-10 hidden md:block',
    actionsSection: 'flex items-center gap-4',
    mobileMenuButton:
      'md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary',
    userMenu: 'flex items-center gap-2',
  },
  variants: {
    variant: {
      default: {},
      transparent: {
        root: 'bg-transparent shadow-none',
      },
      dark: {
        root: 'bg-gray-900',
        logo: 'text-white',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
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
  variant?: 'default' | 'transparent' | 'dark'
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
  variant = 'default',
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
  } = headerVariants({ variant })

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
