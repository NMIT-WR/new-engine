import { createContext, useContext, useId, useState } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { Icon } from '../atoms/icon'
import { Popover } from '../molecules/popover'
import { tv } from '../utils'

const headerVariants = tv({
  slots: {
    root: [
      'w-full justify-between p-header',
      'flex items-center',
      'transition-header',
      'max-w-header-max',
      'relative',
    ],
    brand: [
      'flex items-center',
      'p-header-brand',
      'font-header-brand',
      'text-header-brand-fg',
      'w-header-brand',
      'shrink-0',
    ],
    nav: [
      'header-desktop:flex-row header-desktop:items-center flex flex-col',
      'w-header-nav flex-1',
      'max-header-desktop:data-[open=false]:hidden max-header-desktop:absolute max-header-desktop:top-full max-header-desktop:z-50',
      'max-header-desktop:bg-header-bg',
    ],
    submenu: ['flex-col gap-header-submenu hidden header-desktop:flex **:px-0'],
    submenuTrigger: [''],
    navItem: [
      'bg-header-nav-item-bg hover:bg-header-nav-item-bg-hover',
      'data-[active=true]:text-header-nav-fg-active',
      'data-[active=true]:font-header-nav-active',
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
      'w-16 h-16',
      'p-header-hamburger',
      'rounded-md',
      'text-header-hamburger-fg',
      'hover:bg-header-hamburger-bg-hover',
      'transition-colors duration-200',
      'cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-primary/20',
    ],
  },
  compoundSlots: [
    {
      slots: ['submenuTrigger', 'navItem'],
      class: [
        'justify-start font-header-nav text-header-nav-fg hover:text-header-nav-fg-hover',
        'cursor-pointer',
      ],
    },
  ],
  variants: {
    variant: {
      solid: {
        root: ['bg-header-bg', 'backdrop-filter-header-none'],
      },
      transparent: {
        root: ['bg-header-bg-transparent', 'backdrop-filter-header-none'],
      },
      blur: {
        root: ['bg-header-bg-blur', 'backdrop-header-blur'],
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
        root: 'h-header-sm gap-header-section-sm',
        nav: 'gap-header-nav-sm text-header-nav-sm',
        brand: 'text-header-brand-sm',
        navItem: 'p-header-nav-item-sm text-header-nav-item-sm',
        submenuTrigger: 'p-header-nav-item-sm text-header-nav-item-sm',
        actions: 'gap-header-actions-sm text-header-actions-sm',
      },
      md: {
        root: 'h-header-md gap-header-section-md',
        nav: 'gap-header-nav-md text-header-nav-md',
        brand: 'text-header-brand-md',
        navItem: 'p-header-nav-item-md text-header-nav-item-md',
        submenuTrigger: 'p-header-nav-item-md text-header-nav-item-md',
        actions: 'gap-header-actions-md text-header-actions-md',
      },
      lg: {
        root: 'h-header-lg gap-header-section-lg',
        nav: 'gap-header-nav-lg text-header-nav-lg',
        brand: 'text-header-brand-lg',
        navItem: 'p-header-nav-item-lg text-header-nav-item-lg',
        submenuTrigger: 'p-header-nav-item-lg text-header-nav-item-lg',
        actions: 'gap-header-actions-lg text-header-actions-lg',
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
    mobileMenuPosition: 'right',
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

  /** Enable hide-on-scroll behavior */
  hideOnScroll?: boolean

  /** Hide-on-scroll configuration */
  hideOnScrollConfig?: {
    threshold?: number
    topOffset?: number
  }
}

interface HeaderBrandProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  ref?: Ref<HTMLDivElement>
  size?: 'sm' | 'md' | 'lg'
}

interface HeaderNavProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  ref?: Ref<HTMLElement>
  size?: 'sm' | 'md' | 'lg'
}

interface HeaderNavItemProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean
  submenu?: boolean
  children: ReactNode
  ref?: Ref<HTMLDivElement>
  size?: 'sm' | 'md' | 'lg'
}

interface HeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  ref?: Ref<HTMLDivElement>
  size?: 'sm' | 'md' | 'lg'
}

interface HeaderSubmenuProps extends HTMLAttributes<HTMLDivElement> {
  trigger: string
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'right-start'
  ref?: Ref<HTMLDivElement>
}

export function Header({
  variant,
  size = 'md',
  className,
  children,
  ref,
  hideOnScroll = false,
  hideOnScrollConfig,
  ...props
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { root, hamburger } = headerVariants({
    variant,
    size,
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

Header.Brand = function HeaderBrand({
  className,
  children,
  ref,
  size: overrideSize,
  ...props
}: HeaderBrandProps) {
  const context = useContext(HeaderContext)
  const size = overrideSize ?? context.size ?? 'md'
  const { brand } = headerVariants({ size })

  return (
    <div ref={ref} className={brand({ className })} {...props}>
      {children}
    </div>
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
  submenu = false,
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
      data-submenu={submenu || undefined}
      {...props}
    >
      {children}
    </div>
  )
}

Header.Submenu = function HeaderSubmenu({
  trigger,
  children,
  placement = 'bottom',
}: HeaderSubmenuProps) {
  const context = useContext(HeaderContext)
  const size = context.size ?? 'md'
  const { submenu, submenuTrigger, navItem } = headerVariants({ size })
  const [isExpanded, setIsExpanded] = useState(false)
  const id = useId()

  return (
    <>
      {/* Desktop - Popover */}
      <div className="header-desktop:block hidden">
        <Popover
          id={id}
          trigger={
            <span className={submenuTrigger()}>
              {trigger}
              <Icon icon="icon-[mdi--chevron-down]" />
            </span>
          }
          contentClassName={submenu()}
          triggerClassName={navItem()}
          placement={placement}
          size={size}
        >
          {children}
        </Popover>
      </div>

      {/* Mobile - Custom Accordion */}
      <div className="header-desktop:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={submenuTrigger()}
          aria-expanded={isExpanded}
          aria-controls={`submenu-${id}`}
        >
          <span>{trigger}</span>
          <Icon
            icon="icon-[mdi--chevron-down]"
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Submenu content with animation */}
        <div
          id={`submenu-${id}`}
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          data-expanded={isExpanded}
        >
          <div>{children}</div>
        </div>
      </div>
    </>
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
