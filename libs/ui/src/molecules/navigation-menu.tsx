import * as navigationMenu from '@zag-js/navigation-menu'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  createContext,
  useContext,
  useId,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Icon, type IconType } from '../atoms/icon'
import { tv } from '../utils'

const navigationMenuVariants = tv({
  slots: {
    root: ['relative'],
    list: [
      'flex items-center',
      'gap-navigation-menu-list',
      'list-none m-0 p-0',
    ],
    item: ['relative'],
    trigger: [
      'inline-flex items-center gap-100',
      'font-navigation-menu-trigger',
      'bg-navigation-menu-trigger-bg text-navigation-menu-trigger-fg',
      'rounded-navigation-menu',
      'cursor-pointer border-none',
      'transition-colors duration-navigation-menu',
      'hover:bg-navigation-menu-trigger-bg-hover hover:text-navigation-menu-trigger-fg-hover',
      'focus-visible:outline-none focus-visible:ring focus-visible:ring-navigation-menu-ring',
      'data-[state=open]:bg-navigation-menu-trigger-bg-open data-[state=open]:text-navigation-menu-trigger-fg-open',
      'data-[disabled]:text-navigation-menu-trigger-fg-disabled data-[disabled]:cursor-not-allowed',
    ],
    triggerIcon: [
      'transition-transform duration-navigation-menu',
      'data-[state=open]:rotate-180',
    ],
    content: [
      'absolute top-full left-0',
      'min-w-[200px]',
      'bg-navigation-menu-content-bg text-navigation-menu-content-fg',
      'border border-navigation-menu-content-border',
      'rounded-navigation-menu-content',
      'shadow-navigation-menu-content',
      'z-50',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2',
    ],
    link: [
      'block',
      'font-navigation-menu-link',
      'bg-navigation-menu-link-bg text-navigation-menu-link-fg',
      'rounded-navigation-menu-link',
      'no-underline',
      'transition-colors duration-navigation-menu',
      'hover:bg-navigation-menu-link-bg-hover hover:text-navigation-menu-link-fg-hover',
      'focus-visible:outline-none focus-visible:ring focus-visible:ring-navigation-menu-ring',
      'data-[current]:text-navigation-menu-link-fg-current',
      'data-[disabled]:text-navigation-menu-link-fg-disabled data-[disabled]:cursor-not-allowed',
    ],
    indicator: [
      'absolute bottom-0',
      'h-navigation-menu-indicator',
      'bg-navigation-menu-indicator-bg',
      'transition-all duration-navigation-menu ease-navigation-menu',
    ],
    indicatorTrack: ['relative'],
    arrow: ['w-3 h-3 rotate-45 bg-navigation-menu-content-bg'],
    viewportPositioner: ['absolute top-full left-0 z-50'],
    viewport: [
      'relative overflow-hidden',
      'bg-navigation-menu-viewport-bg',
      'border border-navigation-menu-viewport-border',
      'rounded-navigation-menu-viewport',
      'shadow-navigation-menu-viewport',
      'w-[var(--viewport-width)] h-[var(--viewport-height)]',
      'transition-[width,height] duration-navigation-menu ease-navigation-menu',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
    ],
    viewportContent: [
      'absolute top-0 left-0',
      'data-[motion=from-start]:animate-in data-[motion=from-start]:slide-in-from-left-full',
      'data-[motion=from-end]:animate-in data-[motion=from-end]:slide-in-from-right-full',
      'data-[motion=to-start]:animate-out data-[motion=to-start]:slide-out-to-left-full',
      'data-[motion=to-end]:animate-out data-[motion=to-end]:slide-out-to-right-full',
    ],
  },
  variants: {
    size: {
      sm: {
        trigger: 'p-navigation-menu-trigger-sm text-navigation-menu-trigger-sm',
        content: 'p-navigation-menu-content-sm text-navigation-menu-content-sm',
        link: 'p-navigation-menu-link-sm text-navigation-menu-link-sm',
      },
      md: {
        trigger: 'p-navigation-menu-trigger-md text-navigation-menu-trigger-md',
        content: 'p-navigation-menu-content-md text-navigation-menu-content-md',
        link: 'p-navigation-menu-link-md text-navigation-menu-link-md',
      },
      lg: {
        trigger: 'p-navigation-menu-trigger-lg text-navigation-menu-trigger-lg',
        content: 'p-navigation-menu-content-lg text-navigation-menu-content-lg',
        link: 'p-navigation-menu-link-lg text-navigation-menu-link-lg',
      },
    },
    orientation: {
      horizontal: {
        list: 'flex-row',
        content: 'top-full',
      },
      vertical: {
        list: 'flex-col',
        content: 'left-full top-0',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    orientation: 'horizontal',
  },
})

// === CONTEXT ===
interface NavigationMenuContextValue {
  api: ReturnType<typeof navigationMenu.connect>
  styles: ReturnType<typeof navigationMenuVariants>
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  useViewport?: boolean
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(
  null
)

function useNavigationMenuContext() {
  const context = useContext(NavigationMenuContext)
  if (!context) {
    throw new Error(
      'NavigationMenu components must be used within NavigationMenu.Root'
    )
  }
  return context
}

// Item context for sharing item value
interface NavigationMenuItemContextValue {
  value: string
  disabled?: boolean
}

const NavigationMenuItemContext =
  createContext<NavigationMenuItemContextValue | null>(null)

function useNavigationMenuItemContext() {
  const context = useContext(NavigationMenuItemContext)
  if (!context) {
    throw new Error(
      'NavigationMenu item components must be used within NavigationMenu.Item'
    )
  }
  return context
}

// === TYPE DEFINITIONS ===
export interface NavigationMenuProps
  extends VariantProps<typeof navigationMenuVariants>,
    Omit<ComponentPropsWithoutRef<'nav'>, 'onChange' | 'dir'> {
  id?: string
  value?: string
  defaultValue?: string
  onValueChange?: (details: { value: string }) => void
  openDelay?: number
  closeDelay?: number
  disableClickTrigger?: boolean
  disableHoverTrigger?: boolean
  disablePointerLeaveClose?: boolean
  dir?: 'ltr' | 'rtl'
  useViewport?: boolean
  ref?: Ref<HTMLElement>
}

interface NavigationMenuListProps extends ComponentPropsWithoutRef<'ul'> {
  ref?: Ref<HTMLUListElement>
}

interface NavigationMenuItemProps extends ComponentPropsWithoutRef<'li'> {
  value: string
  disabled?: boolean
  ref?: Ref<HTMLLIElement>
}

interface NavigationMenuTriggerProps
  extends ComponentPropsWithoutRef<'button'> {
  icon?: IconType | false
  ref?: Ref<HTMLButtonElement>
}

interface NavigationMenuContentProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>
}

interface NavigationMenuLinkProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'onSelect'> {
  value?: string
  current?: boolean
  closeOnClick?: boolean
  onSelect?: (event: CustomEvent) => void
  ref?: Ref<HTMLAnchorElement>
}

interface NavigationMenuIndicatorProps
  extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>
}

interface NavigationMenuArrowProps extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>
}

interface NavigationMenuViewportPositionerProps
  extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>
}

interface NavigationMenuViewportProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode
  align?: 'start' | 'center' | 'end'
  ref?: Ref<HTMLDivElement>
}

interface NavigationMenuIndicatorTrackProps
  extends ComponentPropsWithoutRef<'div'> {
  ref?: Ref<HTMLDivElement>
}

// === ROOT COMPONENT ===
export function NavigationMenu({
  id,
  value,
  defaultValue,
  onValueChange,
  openDelay = 200,
  closeDelay = 300,
  disableClickTrigger = false,
  disableHoverTrigger = false,
  disablePointerLeaveClose = false,
  dir = 'ltr',
  size,
  orientation = 'horizontal',
  useViewport = false,
  className,
  children,
  ref,
  ...props
}: NavigationMenuProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(navigationMenu.machine, {
    id: uniqueId,
    value,
    defaultValue,
    onValueChange,
    openDelay,
    closeDelay,
    disableClickTrigger,
    disableHoverTrigger,
    disablePointerLeaveClose,
    dir,
    orientation,
  })

  const api = navigationMenu.connect(service, normalizeProps)
  const styles = navigationMenuVariants({ size, orientation })

  return (
    <NavigationMenuContext.Provider
      value={{ api, styles, size, orientation, useViewport }}
    >
      <nav
        ref={ref}
        className={styles.root({ className })}
        {...props}
        {...api.getRootProps()}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  )
}

// === LIST COMPONENT ===
NavigationMenu.List = function NavigationMenuList({
  children,
  ref,
  className,
  ...props
}: NavigationMenuListProps) {
  const { api, styles } = useNavigationMenuContext()

  return (
    <ul
      ref={ref}
      className={styles.list({ className })}
      {...props}
      {...api.getListProps()}
    >
      {children}
    </ul>
  )
}

// === INDICATOR TRACK ===
NavigationMenu.IndicatorTrack = function NavigationMenuIndicatorTrack({
  children,
  ref,
  className,
  ...props
}: NavigationMenuIndicatorTrackProps) {
  const { styles } = useNavigationMenuContext()

  return (
    <div
      ref={ref}
      className={styles.indicatorTrack({ className })}
      {...props}
    >
      {children}
    </div>
  )
}

// === ITEM COMPONENT ===
NavigationMenu.Item = function NavigationMenuItem({
  value,
  disabled,
  children,
  ref,
  className,
  ...props
}: NavigationMenuItemProps) {
  const { api, styles } = useNavigationMenuContext()

  return (
    <NavigationMenuItemContext.Provider value={{ value, disabled }}>
      <li
        ref={ref}
        className={styles.item({ className })}
        {...props}
        {...api.getItemProps({ value, disabled })}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  )
}

// === TRIGGER COMPONENT ===
NavigationMenu.Trigger = function NavigationMenuTrigger({
  icon = 'token-icon-navigation-menu-chevron',
  children,
  ref,
  className,
  ...props
}: NavigationMenuTriggerProps) {
  const { api, styles, useViewport } = useNavigationMenuContext()
  const { value, disabled } = useNavigationMenuItemContext()
  const itemState = api.getItemState({ value, disabled })

  return (
    <>
      <button
        ref={ref}
        type="button"
        className={styles.trigger({ className })}
        {...props}
        {...api.getTriggerProps({ value, disabled })}
      >
        {children}
        {icon !== false && (
          <Icon
            icon={icon}
            size="current"
            className={styles.triggerIcon()}
            data-state={itemState.open ? 'open' : 'closed'}
          />
        )}
      </button>
      {/* Focus management proxies for viewport pattern */}
      {useViewport && (
        <>
          <span {...api.getTriggerProxyProps({ value })} />
          <span {...api.getViewportProxyProps({ value })} />
        </>
      )}
    </>
  )
}

// === CONTENT COMPONENT ===
NavigationMenu.Content = function NavigationMenuContent({
  children,
  ref,
  className,
  ...props
}: NavigationMenuContentProps) {
  const { api, styles, useViewport } = useNavigationMenuContext()
  const { value } = useNavigationMenuItemContext()
  const itemState = api.getItemState({ value })

  // If using viewport pattern, content is rendered inside viewport
  if (useViewport) {
    return (
      <div
        ref={ref}
        className={styles.viewportContent({ className })}
        {...props}
        {...api.getContentProps({ value })}
      >
        {children}
      </div>
    )
  }

  // Inline content (non-viewport pattern)
  if (!itemState.open) return null

  return (
    <div
      ref={ref}
      className={styles.content({ className })}
      {...props}
      {...api.getContentProps({ value })}
      data-state={itemState.open ? 'open' : 'closed'}
    >
      {children}
    </div>
  )
}

// === LINK COMPONENT ===
NavigationMenu.Link = function NavigationMenuLink({
  value: linkValue,
  current = false,
  closeOnClick = true,
  onSelect,
  children,
  ref,
  className,
  ...props
}: NavigationMenuLinkProps) {
  const { api, styles } = useNavigationMenuContext()
  // Try to get item context, but allow links to be used outside of items
  let itemValue: string | undefined
  try {
    const itemContext = useNavigationMenuItemContext()
    itemValue = itemContext.value
  } catch {
    itemValue = linkValue
  }

  const effectiveValue = linkValue ?? itemValue ?? ''

  return (
    <a
      ref={ref}
      className={styles.link({ className })}
      {...props}
      {...api.getLinkProps({
        value: effectiveValue,
        current,
        closeOnClick,
        onSelect,
      })}
    >
      {children}
    </a>
  )
}

// === INDICATOR COMPONENT ===
NavigationMenu.Indicator = function NavigationMenuIndicator({
  children,
  ref,
  className,
  ...props
}: NavigationMenuIndicatorProps) {
  const { api, styles } = useNavigationMenuContext()

  return (
    <div
      ref={ref}
      className={styles.indicator({ className })}
      {...props}
      {...api.getIndicatorProps()}
    >
      {children}
    </div>
  )
}

// === ARROW COMPONENT ===
NavigationMenu.Arrow = function NavigationMenuArrow({
  ref,
  className,
  ...props
}: NavigationMenuArrowProps) {
  const { api, styles } = useNavigationMenuContext()

  return (
    <div
      ref={ref}
      className={styles.arrow({ className })}
      {...props}
      {...api.getArrowProps()}
    />
  )
}

// === VIEWPORT POSITIONER COMPONENT ===
NavigationMenu.ViewportPositioner =
  function NavigationMenuViewportPositioner({
    children,
    ref,
    className,
    ...props
  }: NavigationMenuViewportPositionerProps) {
    const { api, styles } = useNavigationMenuContext()

    return (
      <div
        ref={ref}
        className={styles.viewportPositioner({ className })}
        {...props}
        {...api.getViewportPositionerProps()}
      >
        {children}
      </div>
    )
  }

// === VIEWPORT COMPONENT ===
NavigationMenu.Viewport = function NavigationMenuViewport({
  children,
  align = 'start',
  ref,
  className,
  ...props
}: NavigationMenuViewportProps) {
  const { api, styles } = useNavigationMenuContext()

  if (!api.isViewportRendered) return null

  return (
    <Portal>
      <NavigationMenu.ViewportPositioner>
        <div
          ref={ref}
          className={styles.viewport({ className })}
          {...props}
          {...api.getViewportProps({ align })}
        >
          {children}
        </div>
      </NavigationMenu.ViewportPositioner>
    </Portal>
  )
}

// === EXPORT COMPOUND COMPONENT ===
NavigationMenu.Root = NavigationMenu
