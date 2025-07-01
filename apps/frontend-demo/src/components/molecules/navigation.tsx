'use client'
import { Button } from '@ui/atoms/button'
import { Icon, type IconType } from '@ui/atoms/icon'
import Link from 'next/link'
import { type ComponentPropsWithoutRef, useState } from 'react'

export type NavItem = {
  title: string
  href?: string
  prefetch?: boolean
  icon?: IconType
  label?: string
  role?: 'submenu' | 'item'
  children?: NavItem[]
}

function Submenu({ items }: { items: NavItem[] }) {
  return (
    <div className="absolute top-full left-0 z-50 mt-navigation-submenu min-w-[200px] rounded-navigation-submenu border border-navigation-submenu-border bg-navigation-submenu-bg p-navigation-submenu-padding shadow-navigation-submenu">
      {items.map((child, index) => (
        <Link
          key={index}
          href={child.href || '#'}
          className="block px-navigation-item-x py-navigation-item-y text-navigation-fg text-navigation-item transition-colors hover:bg-navigation-item-hover-bg hover:text-navigation-fg-hover"
          prefetch={child.prefetch}
        >
          {child.icon && (
            <Icon
              icon={child.icon}
              size="sm"
              className="mr-navigation-submenu-icon inline"
            />
          )}
          {child.title}
          {child.label && (
            <span className="ml-navigation-badge-ml rounded-full bg-navigation-badge-bg px-navigation-badge-x py-navigation-badge-y font-medium text-navigation-badge text-navigation-badge-fg">
              {child.label}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}

function NavigationItem({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false)

  if (item.role === 'submenu' && item.children) {
    return (
      <li className="relative">
        <Button
          icon="icon-[mdi--chevron-down]"
          iconPosition="right"
          variant="tertiary"
          theme="borderless"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.icon && <Icon icon={item.icon} size="sm" />}
          {item.title}
        </Button>
        {isOpen && <Submenu items={item.children} />}
      </li>
    )
  }

  return (
    <li className="relative">
      <Link
        href={item.href || '#'}
        className="flex items-center gap-navigation-link-icon-gap rounded-navigation-item px-navigation-item-x py-navigation-item-y font-navigation-item text-navigation-fg text-navigation-item transition-colors hover:bg-navigation-item-hover-bg hover:text-navigation-fg-hover"
        prefetch={item.prefetch ?? false}
      >
        {item.icon && <Icon icon={item.icon} size="sm" />}
        {item.title}
        {item.label && (
          <span className="ml-navigation-badge-ml rounded-full bg-navigation-badge-bg px-navigation-badge-x py-navigation-badge-y font-medium text-navigation-badge text-navigation-badge-fg">
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
    <nav className="bg-navigation-bg" {...props}>
      <ul className="flex items-center gap-navigation-gap">
        {items.map((item, index) => (
          <NavigationItem key={index} item={item} />
        ))}
      </ul>
    </nav>
  )
}
