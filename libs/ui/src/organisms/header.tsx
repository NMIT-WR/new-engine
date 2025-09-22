import { createContext, useContext, useState } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { tv } from '../utils'

const headerVariants = tv({
  slots: {
    root: [
      'w-full justify-between',
      'flex items-center',
      'transition-header',
      'max-w-header-max',
      'relative',
    ],
    container: [
      'bg-white/40 w-full flex gap-400 justify-between p-header-container',
    ],
    nav: [
      'header-desktop:flex-row header-desktop:items-center flex flex-col',
      'w-header-nav flex-1',
      'max-header-desktop:data-[open=false]:hidden max-header-desktop:absolute max-header-desktop:top-full max-header-desktop:z-50',
      'max-header-desktop:bg-header-bg',
    ],
    navItem: [
      'bg-header-nav-item-bg hover:bg-header-nav-item-bg-hover',
      'data-[active=true]:text-header-nav-fg-active',
      'data-[active=true]:font-header-nav-active',
      'min-w-max',
    ],
    actions: [
      'items-center',
      'text-header-actions-fg',
      'w-header-actions',
      'shrink-0',
      'hidden header-desktop:flex',
    ],
    hamburger: [
      'flex',
      'header-desktop:hidden items-center justify-center',
      'size-header-hamburger',
      'p-header-hamburger',
      'rounded-md',
      'text-header-hamburger-fg',
      'hover:bg-header-hamburger-bg-hover',
      'transition-colors duration-header',
      'cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-header-hamburger-ring',
    ],
  },
  compoundSlots: [
    {
      slots: ['navItem'],
      class: [
        'justify-start font-header-nav text-header-nav-fg hover:text-header-nav-fg-hover',
        'cursor-pointer',
      ],
    },
  ],
  variants: {
    direction: {
      vertical: {
        root: ['flex-col'],
      },
      horizontal: {
        root: ['flex-row'],
      },
    },
    variant: {
      solid: {
        root: ['bg-header-bg'],
      },
      transparent: {
        root: ['bg-header-bg-transparent'],
      },
      blur: {
        root: ['bg-header-bg-blur'],
      },
    },
    mobileMenuPosition: {
      right: {
        nav: ['right-0'],
      },
      left: {
        nav: ['left-0'],
      },
    },
    size: {
      sm: {
        root: '-header-sm gap-header-section-sm',
        nav: 'gap-header-nav-sm text-header-nav-sm',
        navItem: 'p-header-nav-item-sm text-header-nav-item-sm',
        actions: 'gap-header-actions-sm text-header-actions-sm',
      },
      md: {
        root: '-header-md gap-header-secion-md',
        nav: 'gap-header-nav-md text-header-nav-md',
        navItem: 'p-header-nav-item-md text-header-nav-item-md',
        actions: 'gap-header-actions-md text-header-actions-md',
      },
      lg: {
        root: '-header-lg gap-header-section-lg',
        nav: 'gap-header-nav-lg text-header-nav-lg',
        navItem: 'p-header-nav-item-lg text-header-nav-item-lg',
        actions: 'gap-header-actions-lg text-header-actions-lg',
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
    mobileMenuPosition: 'right',
    direction: 'horizontal',
  },
})

// === CONTEXT ===
interface HeaderContextValue {
  size?: 'sm' | 'md' | 'lg'
  isMobileMenuOpen?: boolean
  setIsMobileMenuOpen?: (open: boolean) => void
  toggleMobileMenu?: () => void
}

const HeaderContext = createContext<HeaderContextValue>({})

// === TYPE DEFINITIONS ===
export interface HeaderProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  children: ReactNode
  ref?: Ref<HTMLElement>
}

interface HeaderContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  ref?: Ref<HTMLElement>
}

interface HeaderNavProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  ref?: Ref<HTMLElement>
  size?: 'sm' | 'md' | 'lg'
}

interface HeaderNavItemProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
  children: ReactNode
  ref?: Ref<HTMLDivElement>
  size?: 'sm' | 'md' | 'lg'
}

interface HeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  ref?: Ref<HTMLDivElement>
  size?: 'sm' | 'md' | 'lg'
}

export function Header({
  variant,
  size = 'md',
  direction = 'horizontal',
  className,
  children,
  ref,
  ...props
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { root, hamburger } = headerVariants({
    variant,
    size,
    direction,
  })

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <HeaderContext.Provider
      value={{
        size,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
      }}
    >
      <header
        ref={ref}
        className={root({
          className,
        })}
        {...props}
      >
        {children}
        <Button
          theme="borderless"
          onClick={toggleMobileMenu}
          className={hamburger()}
          aria-label="Toggle mobile menu"
          icon={isMobileMenuOpen ? 'icon-[mdi--close]' : 'icon-[mdi--menu]'}
        />
      </header>
    </HeaderContext.Provider>
  )
}

Header.Container = function HeaderContainer({
  className,
  children,
  ref,
  ...props
}: HeaderContainerProps) {
  const { container } = headerVariants()
  return (
    <section ref={ref} className={container({ className })} {...props}>
      {children}
    </section>
  )
}

// Header.Nav - Navigation container
Header.Nav = function HeaderNav({
  className,
  children,
  ref,
  size: overrideSize,
  ...props
}: HeaderNavProps) {
  const context = useContext(HeaderContext)
  const size = overrideSize ?? context.size ?? 'md'
  const { nav } = headerVariants({ size })

  return (
    <nav
      ref={ref}
      className={nav({ className })}
      data-open={context.isMobileMenuOpen}
      {...props}
    >
      {children}
    </nav>
  )
}

// Header.NavItem - Individual navigation item
Header.NavItem = function HeaderNavItem({
  active = false,
  className,
  children,
  ref,
  size: overrideSize,
  ...props
}: HeaderNavItemProps) {
  const context = useContext(HeaderContext)
  const size = overrideSize ?? context.size ?? 'md'
  const { navItem } = headerVariants({ size })

  return (
    <div
      ref={ref}
      className={navItem({ className })}
      data-active={active || undefined}
      {...props}
    >
      {children}
    </div>
  )
}

// Header.Actions - Action buttons area
Header.Actions = function HeaderActions({
  className,
  children,
  ref,
  size: overrideSize,
  ...props
}: HeaderActionsProps) {
  const context = useContext(HeaderContext)
  const size = overrideSize ?? context.size ?? 'md'
  const { actions } = headerVariants({ size })

  return (
    <div ref={ref} className={actions({ className })} {...props}>
      {children}
    </div>
  )
}
