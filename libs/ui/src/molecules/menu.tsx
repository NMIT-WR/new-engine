import * as menu from '@zag-js/menu'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useId,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { Icon, type IconType } from '../atoms/icon'

type ActionMenuItem = {
  type: 'action'
  value: string
  label: string
  icon?: IconType
  disabled?: boolean
}

type RadioMenuItem = {
  type: 'radio'
  value: string
  label: string
  name: string // radio group name
  checked: boolean
}

type CheckboxMenuItem = {
  type: 'checkbox'
  value: string
  label: string
  checked: boolean
}

type SeparatorMenuItem = {
  type: 'separator'
  id: string // pro key
}

type MenuItem =
  | ActionMenuItem
  | RadioMenuItem
  | CheckboxMenuItem
  | SeparatorMenuItem

// === COMPONENT VARIANTS ===
const menuVariants = tv({
  slots: {
    trigger: '',
    positioner: ['w-(--reference-width)', 'isolate z-(--z-index)'],
    content: [
      'bg-menu-content-bg border border-menu-content-border',
      'rounded-menu shadow-menu-content-shadow',
      'p-menu-content',
      'min-w-menu-content',
      'max-h-menu-content overflow-auto',
      'focus:outline-none',
      'data-[state=open]:animate-in',
      'data-[state=closed]:animate-out',
    ],
    item: [
      'flex items-center gap-menu-item',
      'cursor-pointer',
      'px-menu-item-x py-menu-item-y',
      'text-menu-item-fg',
      'rounded-menu-item',
      'hover:bg-menu-item-hover',
      'focus:bg-menu-item-hover focus:outline-none',
      'data-[disabled]:opacity-menu-disabled data-[disabled]:cursor-not-allowed',
      'data-[highlighted]:bg-menu-item-hover',
      'data-[disabled]:opacity-50',
    ],
    optionItem: ['data-[state=checked]:font-semibold'],
    separator: [
      'my-menu-separator',
      'h-menu-separator',
      'bg-menu-separator-bg',
    ],
    itemText: ['flex-grow'],
    itemIcon: ['text-menu-item-icon-size text-menu-item-icon-fg'],
    submenuIndicator: ['ml-auto text-menu-submenu-indicator-fg'],
  },
  variants: {
    size: {
      sm: {
        content: 'text-sm',
        item: 'text-sm',
      },
      md: {
        content: 'text-md',
        item: 'text-md',
      },
      lg: {
        content: 'text-lg',
        item: 'text-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// === COMPONENT PROPS ===
export interface MenuProps
  extends VariantProps<typeof menuVariants>,
    menu.Props {
  items: MenuItem[]
  triggerText?: string
  triggerIcon?: IconType
  customTrigger?: ReactNode
  className?: string
  onCheckedChange?: (item: MenuItem, checked: boolean) => void
}
export function Menu({
  // NATIVE PROPS
  'aria-label': ariaLabel,
  dir,
  id,
  closeOnSelect = true,
  loopFocus = true,
  typeahead = true,
  positioning,
  anchorPoint,
  open,
  defaultOpen,
  composite,
  navigate,

  // Highlighted
  defaultHighlightedValue,
  highlightedValue,
  onHighlightChange,

  // event handlers
  onSelect,
  onOpenChange,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  onFocusOutside,

  // CUSTOM PROPS
  items,
  triggerText = 'Menu',
  triggerIcon,
  customTrigger,
  size = 'md',
  onCheckedChange,
}: MenuProps) {
  const generatedId = useId()

  const service = useMachine(menu.machine, {
    id: id || generatedId,
    dir,
    closeOnSelect,
    loopFocus,
    typeahead,
    positioning,
    defaultHighlightedValue,
    highlightedValue,
    anchorPoint,
    open,
    defaultOpen,
    composite,
    navigate,
    onSelect,
    onOpenChange,
    onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside,
    onFocusOutside,
    onHighlightChange,
    'aria-label': ariaLabel,
  })

  const api = menu.connect(service as menu.Service, normalizeProps)

  const {
    trigger,
    positioner,
    content,
    separator,
    optionItem,
    item: itemSlot,
    itemIcon,
    itemText,
  } = menuVariants({ size })

  const renderMenuItem = (item: MenuItem) => {
    // Handle separator
    if (item.type === 'separator') {
      return <hr key={`separator-${item.id}`} className={separator()} />
    }

    // Handle radio/checkbox items
    if (item.type === 'radio' || item.type === 'checkbox') {
      return (
        <li
          key={item.value}
          className={`${itemSlot()} ${optionItem()}`}
          {...api.getOptionItemProps({
            type: item.type,
            value: item.value,
            checked: item.checked,
            onCheckedChange: (checked) => {
              onCheckedChange?.(item, checked)
            },
          })}
        >
          {/* Icon for checked state */}
          {item.checked && (
            <Icon icon="token-icon-check" className={itemIcon()} />
          )}
          <span className={itemText()}>{item.label}</span>
        </li>
      )
    }

    // Handle action items
    return (
      <li
        key={item.value}
        className={itemSlot()}
        {...api.getItemProps({
          value: item.value,
          disabled: item.disabled,
        })}
      >
        {item.icon && <Icon icon={item.icon} className={itemIcon()} />}
        <span className={itemText()}>{item.label}</span>
      </li>
    )
  }

  return (
    <>
      {/* Trigger */}
      {customTrigger ? (
        isValidElement(customTrigger) ? (
          cloneElement(customTrigger as ReactElement, {
            ...api.getTriggerProps(),
          })
        ) : (
          <button {...api.getTriggerProps()}>{customTrigger}</button>
        )
      ) : (
        <Button {...api.getTriggerProps()} className={trigger()}>
          {triggerText}
          {triggerIcon && <Icon icon={triggerIcon} className="ml-1" />}
          {!triggerIcon && (
            <span {...api.getIndicatorProps()}>
              <Icon icon="token-icon-menu-trigger" className="ml-1" />
            </span>
          )}
        </Button>
      )}

      <Portal>
        <div className={positioner()} {...api.getPositionerProps()}>
          <ul className={content()} {...api.getContentProps()}>
            {items.map(renderMenuItem)}
          </ul>
        </div>
      </Portal>
    </>
  )
}

Menu.displayName = 'Menu'
