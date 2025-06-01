'use client'
import Link from 'next/link'
import { type ComponentPropsWithoutRef, useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { Icon, type IconType } from 'ui/src/atoms/icon'
import { tv } from 'ui/src/utils'

const navigationVariants = tv({
  slots: {
    root: 'bg-navigation-bg',
    list: 'flex items-center gap-navigation-gap',
    item: 'relative',
    link: 'flex items-center gap-navigation-link-icon-gap px-navigation-item-x py-navigation-item-y rounded-navigation-item text-navigation-item font-navigation-item text-navigation-fg hover:text-navigation-fg-hover hover:bg-navigation-item-hover-bg transition-colors',
    submenu:
      'absolute top-full left-0 z-50 mt-navigation-submenu min-w-[200px] rounded-navigation-submenu border border-navigation-submenu-border bg-navigation-submenu-bg p-navigation-submenu-padding shadow-navigation-submenu',
    submenuItem:
      'block px-navigation-item-x py-navigation-item-y text-navigation-item text-navigation-fg hover:text-navigation-fg-hover hover:bg-navigation-item-hover-bg transition-colors',
    badge:
      'ml-navigation-badge-ml rounded-full bg-navigation-badge-bg px-navigation-badge-x py-navigation-badge-y text-navigation-badge font-medium text-navigation-badge-fg',
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
  const { submenu, submenuItem, badge } = navigationVariants()

  return (
    <div className={submenu()}>
      {items.map((child, index) => (
        <Link
          key={index}
          href={child.href || '#'}
          className={submenuItem()}
          target={child.external ? '_blank' : undefined}
          rel={child.external ? 'noopener noreferrer' : undefined}
        >
          {child.icon && (
            <Icon icon={child.icon} size="sm" className="mr-navigation-submenu-icon inline" />
          )}
          {child.title}
          {child.label && <span className={badge()}>{child.label}</span>}
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
          <span className={navigationVariants().badge()}>{item.label}</span>
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
}

export function Navigation({ items, className, ...props }: NavigationProps) {
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
