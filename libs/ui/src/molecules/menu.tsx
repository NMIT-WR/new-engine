import * as menu from '@zag-js/menu'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'
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
  name: string
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
  id: string
}

type MenuItem =
  | ActionMenuItem
  | RadioMenuItem
  | CheckboxMenuItem
  | SeparatorMenuItem

// === COMPONENT VARIANTS ===
const menuVariants = tv({
  slots: {
    trigger: 'p-menu-trigger',
    positioner: ['w-(--reference-width)', 'isolate z-(--z-index)'],
    content: [
      'bg-menu-content-bg border border-menu-content-border',
      'rounded-menu shadow-menu-content-shadow',
      'focus:outline-none',
      'min-w-(--reference-width)',
    ],
    item: [
      'flex items-center gap-menu-item p-menu-item',
      'cursor-pointer rounded-menu',
      'text-menu-item-fg',
      'focus:bg-menu-item-hover focus:outline-none',
      'data-[disabled]:opacity-menu-disabled data-[disabled]:cursor-not-allowed',
      'data-[highlighted]:bg-menu-item-hover',
    ],
    optionItem: ['data-[state=checked]:text-menu-item-checked'],
    itemIndicator: ['data-[state=checked]:token-icon-menu-check'],
    separator: ['h-menu-separator', 'bg-menu-separator-bg'],
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

// === MENU ITEM COMPONENT ===
interface MenuItemComponentProps {
  item: MenuItem
  api: ReturnType<typeof menu.connect>
  styles: ReturnType<typeof menuVariants>
  onCheckedChange?: (item: MenuItem, checked: boolean) => void
}

function MenuItemComponent({
  item,
  api,
  styles,
  onCheckedChange,
}: MenuItemComponentProps) {
  const { optionItem, item: itemSlot, itemIndicator } = styles

  // Handle radio/checkbox items
  if (item.type === 'radio' || item.type === 'checkbox') {
    const opts = {
      type: item.type,
      name: item.type === 'radio' ? item.name : undefined,
      value: item.value,
      checked: item.checked,
      onCheckedChange: (checked: boolean) => {
        onCheckedChange?.(item, checked)
      },
    } as const
    const optionProps = api.getOptionItemProps(opts)

    return (
      <li className={`${itemSlot()} ${optionItem()}`} {...optionProps}>
        <span {...api.getItemTextProps(item)}>{item.label}</span>
        <span
          className={itemIndicator()}
          {...api.getItemIndicatorProps(item)}
          data-type={item.type}
        />
      </li>
    )
  }

  // Handle action items
  const actionItem = item as ActionMenuItem
  const itemProps = api.getItemProps({
    value: actionItem.value,
    disabled: actionItem.disabled,
  })

  return (
    <li className={itemSlot()} {...itemProps}>
      {actionItem.icon && <Icon icon={actionItem.icon} />}
      <span>{actionItem.label}</span>
    </li>
  )
}

// === COMPONENT PROPS ===
interface MenuProps extends VariantProps<typeof menuVariants>, menu.Props {
  items: MenuItem[]
  triggerText?: string
  triggerIcon?: IconType
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
  defaultHighlightedValue,
  highlightedValue,
  onHighlightChange,
  onSelect,
  onOpenChange,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  onFocusOutside,

  // CUSTOM PROPS
  items,
  triggerText = 'Menu',
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

  const styles = menuVariants({ size })
  const { trigger, positioner, content, separator } = styles

  return (
    <>
      <Button
        {...api.getTriggerProps()}
        icon="token-icon-menu-trigger"
        iconPosition="right"
        className={trigger()}
      >
        {triggerText}
      </Button>

      <Portal>
        <div className={positioner()} {...api.getPositionerProps()}>
          <ul className={content()} {...api.getContentProps()}>
            {items.map((item) => {
              const key =
                item.type === 'separator' ? `separator-${item.id}` : item.value
              return (
                <>
                  {item.type === 'separator' ? (
                    <hr key={`separator-${item.id}`} className={separator()} />
                  ) : (
                    <MenuItemComponent
                      key={key}
                      item={item}
                      api={api}
                      styles={styles}
                      onCheckedChange={onCheckedChange}
                    />
                  )}
                </>
              )
            })}
          </ul>
        </div>
      </Portal>
    </>
  )
}

Menu.displayName = 'Menu'
