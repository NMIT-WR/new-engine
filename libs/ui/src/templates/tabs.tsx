import type { RefObject } from 'react'
import { Tabs, type TabsProps } from '../molecules/tabs'

export interface TabItem {
  value: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsTemplateProps
  extends Omit<TabsProps, 'children' | 'ref'> {
  items: TabItem[]
  showIndicator?: boolean
  ref?: RefObject<HTMLDivElement>
}

export function TabsTemplate({
  items,
  showIndicator = false,
  variant = 'default',
  size = 'md',
  fitted = false,
  justify = 'start',
  orientation = 'horizontal',
  defaultValue,
  value,
  onValueChange,
  ref,
  className,
  ...tabsProps
}: TabsTemplateProps) {
  // Use first item as default if not specified
  const effectiveDefaultValue = defaultValue || items[0]?.value

  return (
    <Tabs
      ref={ref}
      variant={variant}
      size={size}
      fitted={fitted}
      justify={justify}
      orientation={orientation}
      defaultValue={effectiveDefaultValue}
      value={value}
      onValueChange={onValueChange}
      className={className}
      {...tabsProps}
    >
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </Tabs.Trigger>
        ))}
        {showIndicator && <Tabs.Indicator />}
      </Tabs.List>

      {items.map((item) => (
        <Tabs.Content key={item.value} value={item.value}>
          {item.content}
        </Tabs.Content>
      ))}
    </Tabs>
  )
}
