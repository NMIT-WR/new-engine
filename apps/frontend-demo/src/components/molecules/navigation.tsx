'use client'
import { Icon, type IconType } from '@ui/atoms/icon'
import { Popover } from '@ui/molecules/popover'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

export type NavItem = {
  title: string
  href?: string
  prefetch?: boolean
  icon?: IconType
  label?: string
  role?: 'submenu' | 'item'
  children?: NavItem[]
}

function NavigationItem({ item }: { item: NavItem }) {
  if (item.role === 'submenu' && item.children) {
    return (
      <li>
        <Popover
          id="submenu-category"
          trigger={
            <div className="flex items-center gap-2">
              {item.icon && <Icon icon={item.icon} size="sm" />}
              <span className="text-sm">{item.title}</span>
              <Icon icon="token-icon-chevron-down" size="sm" />
            </div>
          }
          showArrow={true}
          contentClassName="z-50 bg-nav-submenu-bg px-0 py-2 shadow-primary"
          triggerClassName=""
        >
          <nav className="flex min-w-[200px] flex-col gap-nav-submenu">
            {item.children.map((child, index) => (
              <Link
                key={index}
                href={child.href || '#'}
                className="px-nav-submenu-padding hover:bg-nav-submenu-item-hover"
                prefetch={child.prefetch}
              >
                {child.icon && <Icon icon={child.icon} size="sm" />}
                {child.title}
              </Link>
            ))}
          </nav>
        </Popover>
      </li>
    )
  }

  return (
    <li className="relative">
      <Link
        href={item.href || '#'}
        className="flex items-center gap-nav-link-icon-gap rounded-nav-item px-nav-item-x py-nav-item-y font-nav-item text-nav-fg text-nav-item transition-colors hover:bg-nav-item-hover-bg hover:text-nav-fg-hover"
        prefetch={item.prefetch ?? false}
      >
        {item.icon && <Icon icon={item.icon} size="sm" />}
        {item.title}
        {item.label && (
          <span className="ml-nav-badge-ml rounded-full bg-nav-badge-bg px-nav-badge-x py-nav-badge-y font-medium text-nav-badge text-nav-badge-fg">
            {item.label}
          </span>
        )}
      </Link>
    </li>
  )
}

interface NavigationProps extends ComponentPropsWithoutRef<'nav'> {
  items: NavItem[]
}

export function Navigation({ items, className, ...props }: NavigationProps) {
  return (
    <nav className="bg-nav-bg" {...props}>
      <ul className="flex items-center gap-nav-gap">
        {items.map((item, index) => (
          <NavigationItem key={index} item={item} />
        ))}
      </ul>
    </nav>
  )
}
