import type { Placement } from '@zag-js/popover'
import type { ReactNode, Ref } from 'react'
import { Button } from '../atoms/button'
import { Icon, type IconType } from '../atoms/icon'
import { Link } from '../atoms/link'
import { Popover } from '../molecules/popover'
import { Header } from '../organisms/header'

export interface SubmenuItem {
  label: string
  href?: string
  onClick?: () => void
  children?: SubmenuItem[]
  icon?: IconType
  disabled?: boolean
}

export interface HeaderSubmenuPopoverProps {
  items: SubmenuItem[]
  trigger: ReactNode | string
  placement?: Placement
  showChevron?: boolean
  chevronIcon?: IconType
  nestedPlacement?: Placement
  triggerClassName?: string
  ref?: Ref<HTMLDivElement>
}

export function HeaderSubmenuPopover({
  items,
  trigger,
  placement = 'bottom',
  showChevron = true,
  chevronIcon = 'icon-[mdi--chevron-down]',
  nestedPlacement = 'right-start',
  triggerClassName = 'hover:bg-transparent',
  ref,
}: HeaderSubmenuPopoverProps) {
  const renderTrigger = () => {
    if (typeof trigger === 'string') {
      return (
        <Header.NavItem ref={ref}>
          <span>{trigger}</span>
          {showChevron && <Icon icon={chevronIcon} />}
        </Header.NavItem>
      )
    }
    return trigger
  }

  const renderItem = (item: SubmenuItem) => {
    if (item.children && item.children.length > 0) {
      return (
        <HeaderSubmenuPopover
          key={item.label}
          items={item.children}
          trigger={
            <Header.NavItem>
              {item.icon && <Icon icon={item.icon} />}
              <span>{item.label}</span>
            </Header.NavItem>
          }
          placement={nestedPlacement}
          showChevron={showChevron}
          chevronIcon={chevronIcon}
          nestedPlacement={nestedPlacement}
          triggerClassName="text-fg-primary px-0 py-0 hover:bg-transparent"
        />
      )
    }

    return (
      <Header.NavItem key={item.label}>
        {item.href ? (
          <Link href={item.href}>
            {item.icon && <Icon icon={item.icon} />}
            {item.label}
          </Link>
        ) : (
          <Button
            onClick={item.onClick}
            disabled={item.disabled}
            theme="borderless"
            icon={item.icon}
          >
            {item.label}
          </Button>
        )}
      </Header.NavItem>
    )
  }

  return (
    <Popover
      id="popover-submenu"
      trigger={renderTrigger()}
      placement={placement}
      triggerClassName={triggerClassName}
    >
      {items.map(renderItem)}
    </Popover>
  )
}
