import * as navigationMenu from '@zag-js/navigation-menu'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import {
  type ReactNode,
  type Ref,
  createContext,
  useContext,
  useId,
} from 'react'
import { Icon } from '../atoms/icon'
import { tv } from '../utils'

// === VARIANTS ===
const navigationMenuVariants = tv({
  slots: {
    root: ['relative'],
    list: [
      'flex items-center',
      'gap-navigation-menu-list',
      'p-navigation-menu-list',
      'data-[orientation=vertical]:flex-col',
      'data-[orientation=horizontal]:flex-row',
    ],
    item: ['relative'],
    trigger: [
      'inline-flex items-center justify-center',
      'gap-navigation-menu-trigger',
      'p-navigation-menu-trigger',
      'rounded-navigation-menu-trigger',
      'bg-navigation-menu-trigger-bg',
      'text-navigation-menu-trigger text-navigation-menu-trigger-fg',
      'font-(weight:--weight-navigation-menu-trigger)',
      'cursor-pointer transition-colors duration-(time:--duration-navigation-menu-transition)',
      'hover:bg-navigation-menu-trigger-bg-hover hover:text-navigation-menu-trigger-fg-hover',
      'active:bg-navigation-menu-trigger-bg-active',
      'data-[state=open]:bg-navigation-menu-trigger-bg-open',
      'data-[state=open]:text-navigation-menu-trigger-fg-open',
      'data-[disabled]:text-navigation-menu-trigger-fg-disabled data-[disabled]:pointer-events-none',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-navigation-menu-ring focus-visible:ring-offset-2',
    ],
    content: [
      'absolute top-0 left-0',
      'flex flex-col',
      'gap-navigation-menu-content',
      'p-navigation-menu-content',
      'will-change-transform',
      'data-[motion=from-start]:animate-slide-in-from-left',
      'data-[motion=from-end]:animate-slide-in-from-right',
      'data-[motion=to-start]:animate-slide-out-to-left',
      'data-[motion=to-end]:animate-slide-out-to-right',
    ],
    link: [
      'flex items-center',
      'gap-navigation-menu-item',
      'p-navigation-menu-item',
      'rounded-navigation-menu-item',
      'bg-navigation-menu-item-bg',
      'text-navigation-menu-item text-navigation-menu-item-fg',
      'cursor-pointer transition-colors duration-(time:--duration-navigation-menu-transition)',
      'hover:bg-navigation-menu-item-bg-hover hover:text-navigation-menu-item-fg-hover',
      'active:bg-navigation-menu-item-bg-active',
      'data-[current]:bg-navigation-menu-item-bg-current data-[current]:text-navigation-menu-item-fg-current',
      'data-[disabled]:text-navigation-menu-item-fg-disabled data-[disabled]:cursor-not-allowed',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-navigation-menu-ring focus-visible:ring-offset-2',
    ],
    viewportPositioner: [
      'absolute flex justify-center',
      'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:top-full data-[orientation=horizontal]:left-0',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:top-0 data-[orientation=vertical]:left-full',
    ],
    viewport: [
      'relative overflow-hidden',
      'mt-navigation-menu-viewport-top',
      'p-navigation-menu-viewport',
      'rounded-navigation-menu-viewport',
      'bg-navigation-menu-viewport-bg',
      'border-(length:--border-width-navigation-menu-viewport) border-navigation-menu-viewport-border',
      'shadow-(--shadow-navigation-menu-viewport)',
      'transition-all duration-(time:--duration-navigation-menu-viewport-transition)',
      'w-full h-(--viewport-height)',
      'data-[state=open]:animate-scale-in',
      'data-[state=closed]:animate-scale-out',
    ],
    indicator: [
      'absolute flex justify-center overflow-hidden',
      'h-navigation-menu-indicator',
      'z-(--z-navigation-menu-indicator)',
      'transition-all duration-(time:--duration-navigation-menu-transition)',
      'data-[orientation=horizontal]:left-0 data-[orientation=horizontal]:translate-x-(--trigger-x) data-[orientation=horizontal]:w-(--trigger-width)',
      'data-[orientation=vertical]:top-0 data-[orientation=vertical]:translate-y-(--trigger-y) data-[orientation=vertical]:h-(--trigger-height)',
      'bottom-calc(calc(var(--height-navigation-menu-indicator)+var(--size-navigation-menu-arrow))*-1)',
      'data-[state=open]:animate-fade-in',
      'data-[state=closed]:animate-fade-out',
    ],
    indicatorTrack: [
      'w-full h-navigation-menu-indicator-track',
      'bg-navigation-menu-indicator-track-bg',
    ],
    arrow: [
      'relative top-(calc:--size-navigation-menu-arrow/5)',
      'w-navigation-menu-arrow h-navigation-menu-arrow',
      'bg-navigation-menu-arrow-bg',
      'rotate-45',
      'rounded-navigation-menu-arrow',
    ],
    chevronIcon: [
      'transition-transform duration-(time:--duration-navigation-menu-transition)',
      'data-[state=open]:rotate-180',
    ],
  },
  variants: {
    orientation: {
      horizontal: {},
      vertical: {},
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

// === CONTEXT ===
interface NavigationMenuContextValue {
  api: ReturnType<typeof navigationMenu.connect>
  orientation?: 'horizontal' | 'vertical'
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(
  null
)

const useNavigationMenuContext = () => {
  const context = useContext(NavigationMenuContext)
  if (!context) {
    throw new Error(
      'NavigationMenu components must be used within NavigationMenu.Root'
    )
  }
  return context
}

// Item context for sharing value between Item and its children (Trigger, Content)
interface ItemContextValue {
  value: string
  disabled?: boolean
}

const ItemContext = createContext<ItemContextValue | null>(null)

const useItemContext = () => {
  const context = useContext(ItemContext)
  if (!context) {
    throw new Error(
      'NavigationMenu.Trigger and NavigationMenu.Content must be used within NavigationMenu.Item'
    )
  }
  return context
}

// === TYPE DEFINITIONS ===
interface NavigationMenuRootProps
  extends Omit<navigationMenu.Props, 'id' | 'orientation'> {
  id?: string
  className?: string
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  ref?: Ref<HTMLDivElement>
}

interface NavigationMenuListProps {
  className?: string
  children: ReactNode
}

interface NavigationMenuItemProps {
  value: string
  disabled?: boolean
  className?: string
  children: ReactNode
}

interface NavigationMenuTriggerProps {
  className?: string
  children: ReactNode
  showChevron?: boolean
}

interface NavigationMenuContentProps {
  className?: string
  children: ReactNode
}

interface NavigationMenuLinkProps {
  value: string
  current?: boolean
  disabled?: boolean
  className?: string
  children: ReactNode
  onSelect?: (value: string) => void
}

interface NavigationMenuViewportProps {
  className?: string
}

interface NavigationMenuIndicatorProps {
  className?: string
}

interface NavigationMenuArrowProps {
  value: string
  className?: string
}

// === ROOT COMPONENT ===
export function NavigationMenu({
  id,
  className,
  children,
  orientation = 'horizontal',
  value,
  defaultValue,
  onValueChange,
  openDelay = 200,
  closeDelay = 300,
  disableClickTrigger = false,
  disableHoverTrigger = false,
  disablePointerLeaveClose = false,
  dir = 'ltr',
  ref,
  ...props
}: NavigationMenuRootProps) {
  const fallbackId = useId()
  const service = useMachine(navigationMenu.machine, {
    id: id ?? fallbackId,
    orientation,
    value,
    defaultValue,
    onValueChange,
    openDelay,
    closeDelay,
    disableClickTrigger,
    disableHoverTrigger,
    disablePointerLeaveClose,
    dir,
    ...props,
  })

  const api = navigationMenu.connect(service, normalizeProps)
  const { root } = navigationMenuVariants({ orientation })

  return (
    <NavigationMenuContext.Provider value={{ api, orientation }}>
      <nav ref={ref} className={root({ className })} {...api.getRootProps()}>
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  )
}

// === LIST COMPONENT ===
NavigationMenu.List = function NavigationMenuList({
  className,
  children,
}: NavigationMenuListProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { list } = navigationMenuVariants({ orientation })

  return (
    <ul className={list({ className })} {...api.getListProps()}>
      {children}
    </ul>
  )
}

// === ITEM COMPONENT ===
NavigationMenu.Item = function NavigationMenuItem({
  value,
  disabled = false,
  className,
  children,
}: NavigationMenuItemProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { item } = navigationMenuVariants({ orientation })

  return (
    <ItemContext.Provider value={{ value, disabled }}>
      <li
        className={item({ className })}
        {...api.getItemProps({ value, disabled })}
      >
        {children}
      </li>
    </ItemContext.Provider>
  )
}

// === TRIGGER COMPONENT ===
NavigationMenu.Trigger = function NavigationMenuTrigger({
  className,
  children,
  showChevron = true,
}: NavigationMenuTriggerProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { value } = useItemContext()
  const { trigger, chevronIcon } = navigationMenuVariants({ orientation })
  const triggerProps = api.getTriggerProps({ value })

  return (
    <button className={trigger({ className })} {...triggerProps}>
      {children}
      {showChevron && (
        <span className={chevronIcon()} data-state={triggerProps['data-state']}>
          <Icon icon="token-icon-navigation-menu-chevron" size="current" />
        </span>
      )}
    </button>
  )
}

// === CONTENT COMPONENT ===
NavigationMenu.Content = function NavigationMenuContent({
  className,
  children,
}: NavigationMenuContentProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { value } = useItemContext()
  const { content } = navigationMenuVariants({ orientation })

  return (
    <div className={content({ className })} {...api.getContentProps({ value })}>
      {children}
    </div>
  )
}

// === LINK COMPONENT ===
NavigationMenu.Link = function NavigationMenuLink({
  value,
  current = false,
  disabled = false,
  className,
  children,
  onSelect,
}: NavigationMenuLinkProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { link } = navigationMenuVariants({ orientation })

  // Wrap onSelect to match Zag.js CustomEvent signature
  const handleSelect = onSelect
    ? (event: CustomEvent) => {
        onSelect(value)
      }
    : undefined

  return (
    <a
      className={link({ className })}
      {...api.getLinkProps({ value, current, onSelect: handleSelect })}
      data-disabled={disabled || undefined}
      data-current={current || undefined}
    >
      {children}
    </a>
  )
}

// === VIEWPORT COMPONENT ===
NavigationMenu.Viewport = function NavigationMenuViewport({
  className,
}: NavigationMenuViewportProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { viewportPositioner, viewport } = navigationMenuVariants({
    orientation,
  })

  return (
    <Portal>
      <div
        className={viewportPositioner()}
        {...api.getViewportPositionerProps()}
      >
        <div className={viewport({ className })} {...api.getViewportProps()} />
      </div>
    </Portal>
  )
}

// === INDICATOR COMPONENT ===
NavigationMenu.Indicator = function NavigationMenuIndicator({
  className,
}: NavigationMenuIndicatorProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { indicator, indicatorTrack } = navigationMenuVariants({ orientation })

  return (
    <div className={indicator({ className })} {...api.getIndicatorProps()}>
      <div className={indicatorTrack()} />
    </div>
  )
}

// === ARROW COMPONENT ===
NavigationMenu.Arrow = function NavigationMenuArrow({
  value,
  className,
}: NavigationMenuArrowProps) {
  const { api, orientation } = useNavigationMenuContext()
  const { arrow } = navigationMenuVariants({ orientation })

  return (
    <div className={arrow({ className })} {...api.getArrowProps({ value })} />
  )
}

// === EXPORT COMPOUND COMPONENT ===
NavigationMenu.Root = NavigationMenu
