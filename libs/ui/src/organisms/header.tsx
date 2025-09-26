import { createContext, useContext, useState } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { tv } from '../utils'

const headerVariants = tv({
  slots: {
    root: [
      'w-full',
      'grid grid-flow-col justify-between',
      'max-w-header-max',
      'relative',
    ],
    desktop: 'flex max-header-desktop:hidden',
    mobile: [
      'data-[open=false]:hidden header-desktop:hidden *:flex *:flex-col absolute top-full data-[position=left]:left-0 data-[position=right]:right-0',
    ],
    container: [
      'flex gap-header-container',
      'data-[position=start]:justify-self-start-safe',
      'data-[position=center]:justify-self-center-safe',
      'data-[position=end]:justify-self-end-safe',
    ],
    nav: [
      'flex-row header-desktop:items-center flex',
      'w-header-nav flex-1',
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
      'flex',
    ],
    hamburger: [
      'flex',
      'header-desktop:hidden',
      'h-full',
      'p-header-hamburger',
      'rounded-hamburger',
      'text-header-hamburger-fg hover:text-header-hamburger-fg-hover',
      'bg-header-hamburger-bg active:bg-header-hamburger-bg-active',
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
    size: {
      sm: {
        root: 'gap-header-section-sm',
        nav: 'gap-header-nav-sm text-header-nav-sm',
        navItem: 'p-header-nav-item-sm text-header-nav-item-sm',
        actions: 'gap-header-actions-sm text-header-actions-sm',
      },
      md: {
        root: 'gap-header-secion-md',
        nav: 'gap-header-nav-md text-header-nav-md',
        navItem: 'p-header-nav-item-md text-header-nav-item-md',
        actions: 'gap-header-actions-md text-header-actions-md',
      },
      lg: {
        root: 'gap-header-section-lg',
        nav: 'gap-header-nav-lg text-header-nav-lg',
        navItem: 'p-header-nav-item-lg text-header-nav-item-lg',
        actions: 'gap-header-actions-lg text-header-actions-lg',
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
    direction: 'horizontal',
  },
})

// === CONTEXT ===
interface HeaderContextValue {
  size?: 'sm' | 'md' | 'lg'
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
}

const HeaderContext = createContext<HeaderContextValue>({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => {},
  toggleMobileMenu: () => {},
})

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
  position?: 'start' | 'center' | 'end'
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

interface HeaderMobileProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  ref?: Ref<HTMLDivElement>
  position?: 'left' | 'right'
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
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const { root } = headerVariants({
    variant,
    size,
    direction,
  })

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
      </header>
    </HeaderContext.Provider>
  )
}

Header.Desktop = function HeaderDesktop({
  className,
  children,
  ref,
  ...props
}: HeaderContainerProps) {
  const { desktop } = headerVariants()
  return (
    <section ref={ref} className={desktop({ className })} {...props}>
      {children}
    </section>
  )
}

Header.Mobile = function HeaderMobile({
  className,
  children,
  ref,
  position = 'right',
  ...props
}: HeaderMobileProps) {
  const { isMobileMenuOpen } = useContext(HeaderContext)
  const { mobile } = headerVariants()
  return (
    <section
      ref={ref}
      className={mobile({ className })}
      data-open={isMobileMenuOpen}
      data-position={position}
      {...props}
    >
      {children}
    </section>
  )
}

Header.Container = function HeaderContainer({
  className,
  children,
  ref,
  position,
  ...props
}: HeaderContainerProps) {
  const { container } = headerVariants()
  return (
    <section
      ref={ref}
      className={container({ className })}
      data-position={position}
      {...props}
    >
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
  const { size: contextSize } = useContext(HeaderContext)
  const size = overrideSize ?? contextSize ?? 'md'
  const { nav } = headerVariants({ size })

  return (
    <nav ref={ref} className={nav({ className })} {...props}>
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

Header.Hamburger = function HeaderHamburger() {
  const { toggleMobileMenu, isMobileMenuOpen } = useContext(HeaderContext)
  const { hamburger } = headerVariants()

  return (
    <Button
      theme="borderless"
      onClick={toggleMobileMenu}
      className={hamburger()}
      aria-label="Toggle mobile menu"
      icon={isMobileMenuOpen ? 'icon-[mdi--close]' : 'icon-[mdi--menu]'}
    />
  )
}
