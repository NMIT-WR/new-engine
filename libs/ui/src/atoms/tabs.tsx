import { normalizeProps, useMachine } from '@zag-js/react'
import * as tabs from '@zag-js/tabs'
import { type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { Button } from './button'

const tabsVariants = tv({
  slots: {
    root: [
      'flex w-full',
      'data-[orientation=horizontal]:flex-col',
      'data-[orientation=vertical]:flex-row',
      'bg-tabs-bg',
      'rounded-tabs',
    ],
    list: [
      'relative flex',
      'bg-tabs-list-bg',
      'data-[orientation=horizontal]:flex-row',
      'data-[orientation=vertical]:flex-col',
    ],
    trigger: [
      'relative flex items-center justify-center',
      'text-tabs-trigger-fg',
      'rounded-tabs-trigger',
      'cursor-pointer transition-all duration-200',
      'hover:bg-tabs-trigger-bg-hover',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-tabs-ring focus-visible:ring-offset-2',
      'data-[selected]:text-tabs-trigger-selected',
    ],
    indicator: [
      'h-tabs-indicator w-tabs-indicator bg-tabs-indicator rounded-tabs-indicator',
      'data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:w-[var(--width)]',
      'data-[orientation=vertical]:right-0 data-[orientation=vertical]:h-[var(--height)]',
    ],
    content: [
      'text-tabs-content-fg',
      'outline-none',
      'focus-visible:ring-2 focus-visible:ring-tabs-ring focus-visible:ring-offset-2',
    ],
  },
  variants: {
    variant: {
      line: {
        list: '',
      },
      solid: {
        trigger:
          'data-[selected]:bg-tabs-trigger-selected-bg data-[selected]:text-tabs-trigger-solid-fg',
        indicator: 'hidden',
      },
      default: {
        list: '',
        indicator: 'hidden',
      },
    },
    size: {
      sm: {
        trigger: 'text-tabs-trigger-sm p-tabs-trigger-sm',
        content: 'p-tabs-content-sm text-tabs-content-sm',
      },
      md: {
        trigger: 'text-tabs-trigger-md p-tabs-trigger-md',
        content: 'p-tabs-content-md text-tabs-content-md',
      },
      lg: {
        trigger: 'text-tabs-trigger-lg p-tabs-trigger-lg',
        content: 'p-tabs-content-lg text-tabs-content-lg',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export type TabItem = {
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps extends VariantProps<typeof tabsVariants> {
  id?: string
  items: TabItem[]
  defaultValue?: string
  value?: string
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  activationMode?: 'automatic' | 'manual'
  loopFocus?: boolean
  showIndicator?: boolean
  className?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  id,
  items = [],
  defaultValue,
  value,
  orientation = 'horizontal',
  dir = 'ltr',
  activationMode = 'automatic',
  loopFocus = true,
  showIndicator = true,
  variant,
  size,
  className,
  onValueChange,
}: TabsProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(tabs.machine, {
    id: uniqueId,
    value,
    defaultValue: defaultValue || items[0]?.value,
    orientation,
    dir,
    activationMode,
    loopFocus,
    onValueChange: ({ value }) => {
      onValueChange?.(value)
    },
  })

  const api = tabs.connect(service, normalizeProps)

  const { root, list, trigger, indicator, content } = tabsVariants({
    variant,
    size,
  })

  return (
    <div className={root({ className })} {...api.getRootProps()}>
      <div className={list()} {...api.getListProps()}>
        {items.map((item) => (
          <Button
            theme="borderless"
            key={item.value}
            className={trigger()}
            {...api.getTriggerProps({
              value: item.value,
              disabled: item.disabled,
            })}
          >
            {item.label}
          </Button>
        ))}{' '}
        {showIndicator && (
          <div className={indicator()} {...api.getIndicatorProps()} />
        )}
      </div>

      {items.map((item) => (
        <div
          key={item.value}
          className={content()}
          {...api.getContentProps({ value: item.value })}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
