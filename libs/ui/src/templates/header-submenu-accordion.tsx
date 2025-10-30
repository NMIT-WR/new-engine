import type { Ref } from 'react'
import { Button } from '../atoms/button'
import { Icon, type IconType } from '../atoms/icon'
import { Link } from '../atoms/link'
import { Accordion } from '../molecules/accordion'
import { Header } from '../organisms/header'

export interface AccordionSubmenuItem {
  value: string
  label: string
  href?: string
  onClick?: () => void
  children?: AccordionSubmenuItem[]
  icon?: IconType
  disabled?: boolean
}

export interface HeaderSubmenuAccordionProps {
  items: AccordionSubmenuItem[]
  showIndicator?: boolean
  indicatorIcon?: IconType
  variant?: 'default' | 'borderless' | 'child'
  indentNested?: boolean
  indentClass?: string
  ref?: Ref<HTMLDivElement>
}

export function HeaderSubmenuAccordion({
  items,
  showIndicator = true,
  indicatorIcon = 'token-icon-accordion-chevron',
  variant = 'child',
  indentNested = true,
  indentClass = 'px-0 pl-200',
  ref,
}: HeaderSubmenuAccordionProps) {
  const renderItem = (item: AccordionSubmenuItem) => {
    // Item with children - render as accordion with nested content
    if (item.children && item.children.length > 0) {
      return (
        <Accordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
        >
          <Accordion.Header>
            <Header.NavItem>
              {item.icon && <Icon icon={item.icon} />}
              {item.label}
            </Header.NavItem>
            {showIndicator && <Accordion.Indicator icon={indicatorIcon} />}
          </Accordion.Header>
          <Accordion.Content className={indentNested ? indentClass : 'px-0'}>
            <HeaderSubmenuAccordion
              items={item.children}
              showIndicator={showIndicator}
              indicatorIcon={indicatorIcon}
              variant={variant}
              indentNested={indentNested}
              indentClass={indentClass}
            />
          </Accordion.Content>
        </Accordion.Item>
      )
    }

    // Leaf item - render as simple nav item inside Accordion.Item
    return (
      <Accordion.Item
        key={item.value}
        value={item.value}
        disabled={item.disabled}
      >
        <Header.NavItem>
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
      </Accordion.Item>
    )
  }

  return (
    <Accordion ref={ref} variant={variant}>
      {items.map(renderItem)}
    </Accordion>
  )
}
