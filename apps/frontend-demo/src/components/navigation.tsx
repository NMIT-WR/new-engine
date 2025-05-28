'use client'
import { type ComponentPropsWithoutRef, useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Icon, type IconType } from 'ui/src/atoms/icon'
import { Link } from 'ui/src/atoms/link'
import { tv } from 'ui/src/utils'

const navigationVariants = tv({
  slots: {
    root: 'bg-navigation-bg px-3 py-2 rounded-md text-sm font-medium transition-colors',
    list: 'flex items-center space-x-2',
    item: 'flex items-center space-x-2 relative',
    link: 'text-navigation-fg hover:text-navigation-fg-hover',
  },
  variants: {
    variant: {
      default: 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
      primary: 'text-blue-700 hover:text-blue-900 hover:bg-blue-50',
      ghost: 'text-gray-700 hover:text-gray-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type NavItem = {
  title: string
  href?: string
  external?: boolean
  icon?: IconType
  label?: string
  role?: 'submenu' | 'item'
  children?: NavItem[]
}

function Submenu({ items }: { items: NavItem[] }) {
  return (
    <div className="absolute top-full left-0 z-50 mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
      {items.map((child, index) => (
        <Link
          key={index}
          href={child.href || '#'}
          className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100"
          target={child.external ? '_blank' : undefined}
          rel={child.external ? 'noopener noreferrer' : undefined}
        >
          {child.icon && (
            <Icon icon={child.icon} size="sm" className="mr-2 inline" />
          )}
          {child.title}
          {child.label && (
            <span className="ml-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-blue-800 text-xs">
              {child.label}
            </span>
          )}
          {child.external && (
            <Icon
              icon="icon-[mdi--open-in-new]"
              size="xs"
              className="ml-1 inline"
            />
          )}
        </Link>
      ))}
    </div>
  )
}

function NavigationItem({ item }: { item: NavItem }) {
  const { item: itemSlot, link: linkSlot } = navigationVariants()
  const [isOpen, setIsOpen] = useState(false)

  if (item.role === 'submenu' && item.children) {
    return (
      <li className={itemSlot()}>
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
    <li className={itemSlot()}>
      <Link
        href={item.href || '#'}
        className={linkSlot()}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
      >
        {item.icon && <Icon icon={item.icon} size="sm" />}
        {item.title}
        {item.label && (
          <span className="ml-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-blue-800 text-xs">
            {item.label}
          </span>
        )}
        {item.external && (
          <Icon icon="icon-[mdi--open-in-new]" size="xs" className="ml-1" />
        )}
      </Link>
    </li>
  )
}

export interface NavigationProps extends ComponentPropsWithoutRef<'nav'> {
  items: NavItem[]
  variant?: 'default' | 'primary' | 'ghost'
}

export function Navigation({
  items,
  variant = 'default',
  className,
  ...props
}: NavigationProps) {
  const { root, list } = navigationVariants({})
  return (
    <nav className={root()} {...props}>
      <ul className={list()}>
        {items.map((item, index) => (
          <NavigationItem key={index} item={item} />
        ))}
      </ul>
    </nav>
  )
}
