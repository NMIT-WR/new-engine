<<<<<<< ours
import { normalizeProps, useMachine } from '@zag-js/react'
import * as tabs from '@zag-js/tabs'
import {
  type ComponentPropsWithoutRef,
  type RefObject,
  createContext,
  useContext,
  useId,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { tv } from '../utils'

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
      'cursor-pointer',
      'hover:bg-tabs-trigger-bg-hover',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-tabs-ring focus-visible:ring-offset-2',
      'data-[selected]:text-tabs-trigger-fg-selected',
      'data-[disabled]:opacity-tabs-disabled data-[disabled]:cursor-not-allowed',
    ],
    indicator: [
      'absolute bg-tabs-indicator-bg rounded-tabs-indicator',
      'data-[orientation=vertical]:h-(--height) data-[orientation=horizontal]:w-(--width)',
      'data-[orientation=vertical]:w-tabs-indicator data-[orientation=horizontal]:h-tabs-indicator',
      'data-[orientation=vertical]:start-0 data-[orientation=horizontal]:bottom-0',
    ],
    content: [
      'text-tabs-content-fg',
      'outline-none',
      'focus-visible:ring-2 focus-visible:ring-tabs-ring focus-visible:ring-offset-2',
    ],
  },
  variants: {
    variant: {
      default: {
        list: '',
        indicator: 'hidden',
      },
      line: {
        list: 'border-b-(length:--border-width-tabs) border-tabs-border',
        indicator:
          'data-[orientation=horizontal]:-bottom-(--border-width-tabs)',
      },
      solid: {
        trigger:
          'data-[selected]:bg-tabs-trigger-bg-selected data-[selected]:text-tabs-trigger-solid-fg',
        indicator: 'hidden',
      },
      outline: {
        trigger: [
          'border-(length:--border-width-tabs) border-transparent',
          'data-[selected]:border-tabs-border-selected',
          'data-[selected]:bg-tabs-trigger-bg-outline-selected',
        ],
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
    fitted: {
      true: {
        list: 'w-full',
        trigger: 'flex-1',
      },
    },
    justify: {
      start: {
        list: 'justify-start',
      },
      center: {
        list: 'justify-center',
      },
      end: {
        list: 'justify-end',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    fitted: false,
  },
})

// Context for sharing state between sub-components
interface TabsContextValue {
  api: ReturnType<typeof tabs.connect>
  variant?: 'default' | 'line' | 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fitted?: boolean
  justify?: 'start' | 'center' | 'end'
  styles: ReturnType<typeof tabsVariants>
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

// Root component
interface TabsProps
  extends VariantProps<typeof tabsVariants>,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  id?: string
  defaultValue?: string
  value?: string
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  activationMode?: 'automatic' | 'manual'
  loopFocus?: boolean
  onValueChange?: (value: string) => void
  ref?: RefObject<HTMLDivElement>
}

export function Tabs({
  id,
  defaultValue,
  value,
  orientation = 'horizontal',
  dir = 'ltr',
  activationMode = 'automatic',
  loopFocus = true,
  onValueChange,
  variant,
  size,
  fitted,
  justify,
  children,
  ref,
  className,
  ...props
}: TabsProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(tabs.machine, {
    id: uniqueId,
    value,
    defaultValue,
    orientation,
    dir,
    activationMode,
    loopFocus,
    onValueChange: ({ value }) => {
      onValueChange?.(value)
    },
  })

  const api = tabs.connect(service, normalizeProps)
  const styles = tabsVariants({ variant, size, fitted, justify })

  return (
    <TabsContext.Provider
      value={{ api, variant, size, fitted, justify, styles }}
    >
      <div
        ref={ref}
        className={styles.root({ className })}
        {...api.getRootProps()}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// List component
interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
}

Tabs.List = function TabsList({
  children,
  ref,
  className,
  ...props
}: TabsListProps) {
  const { api, styles } = useTabsContext()

  return (
    <div
      ref={ref}
      className={styles.list({ className })}
      {...api.getListProps()}
      {...props}
    >
      {children}
    </div>
  )
}

// Trigger component
interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {
  value: string
  disabled?: boolean
  ref?: RefObject<HTMLButtonElement>
}

Tabs.Trigger = function TabsTrigger({
  value,
  disabled,
  children,
  ref,
  className,
  ...props
}: TabsTriggerProps) {
  const { api, styles } = useTabsContext()

  return (
    <Button
      ref={ref}
      theme="borderless"
      className={styles.trigger({ className })}
      {...api.getTriggerProps({ value, disabled })}
      data-disabled={disabled || undefined}
      {...props}
    >
      {children}
    </Button>
  )
}

// Content component
interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {
  value: string
  ref?: RefObject<HTMLDivElement>
}

Tabs.Content = function TabsContent({
  value,
  children,
  ref,
  className,
  ...props
}: TabsContentProps) {
  const { api, styles } = useTabsContext()

  return (
    <div
      ref={ref}
      className={styles.content({ className })}
      {...api.getContentProps({ value })}
      {...props}
    >
      {children}
    </div>
  )
}

// Indicator component
interface TabsIndicatorProps extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
}

Tabs.Indicator = function TabsIndicator({
  ref,
  className,
  ...props
}: TabsIndicatorProps) {
  const { api, styles } = useTabsContext()

  return (
    <div
      ref={ref}
      className={styles.indicator({ className })}
      {...api.getIndicatorProps()}
      {...props}
    />
  )
}

// Display name
Tabs.displayName = 'Tabs'
|||||||
=======
import { normalizeProps, useMachine } from '@zag-js/react'
import * as tabs from '@zag-js/tabs'
import {
  type ComponentPropsWithoutRef,
  type RefObject,
  createContext,
  useContext,
  useId,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { tv } from '../utils'

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
      'cursor-pointer',
      'hover:bg-tabs-trigger-bg-hover',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-tabs-ring focus-visible:ring-offset-2',
      'data-[selected]:text-tabs-trigger-fg-selected',
      'data-[disabled]:text-tabs-fg-disabled data-[disabled]:cursor-not-allowed',
    ],
    indicator: [
      'absolute bg-tabs-indicator-bg rounded-tabs-indicator',
      'data-[orientation=vertical]:h-(--height) data-[orientation=horizontal]:w-(--width)',
      'data-[orientation=vertical]:w-tabs-indicator data-[orientation=horizontal]:h-tabs-indicator',
      'data-[orientation=vertical]:start-0 data-[orientation=horizontal]:bottom-0',
    ],
    content: [
      'text-tabs-content-fg',
      'outline-none',
      'focus-visible:ring-2 focus-visible:ring-tabs-ring focus-visible:ring-offset-2',
    ],
  },
  variants: {
    variant: {
      default: {
        list: '',
        indicator: 'hidden',
      },
      line: {
        list: 'border-b-(length:--border-width-tabs) border-tabs-border',
        indicator:
          'data-[orientation=horizontal]:-bottom-(--border-width-tabs)',
      },
      solid: {
        trigger:
          'data-[selected]:bg-tabs-trigger-bg-selected data-[selected]:text-tabs-trigger-solid-fg',
        indicator: 'hidden',
      },
      outline: {
        trigger: [
          'border-(length:--border-width-tabs) border-transparent',
          'data-[selected]:border-tabs-border-selected',
          'data-[selected]:bg-tabs-trigger-bg-outline-selected',
        ],
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
    fitted: {
      true: {
        list: 'w-full',
        trigger: 'flex-1',
      },
    },
    justify: {
      start: {
        list: 'justify-start',
      },
      center: {
        list: 'justify-center',
      },
      end: {
        list: 'justify-end',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    fitted: false,
  },
})

// Context for sharing state between sub-components
interface TabsContextValue {
  api: ReturnType<typeof tabs.connect>
  variant?: 'default' | 'line' | 'solid' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fitted?: boolean
  justify?: 'start' | 'center' | 'end'
  styles: ReturnType<typeof tabsVariants>
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

// Root component
interface TabsProps
  extends VariantProps<typeof tabsVariants>,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  id?: string
  defaultValue?: string
  value?: string
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  activationMode?: 'automatic' | 'manual'
  loopFocus?: boolean
  onValueChange?: (value: string) => void
  ref?: RefObject<HTMLDivElement>
}

export function Tabs({
  id,
  defaultValue,
  value,
  orientation = 'horizontal',
  dir = 'ltr',
  activationMode = 'automatic',
  loopFocus = true,
  onValueChange,
  variant,
  size,
  fitted,
  justify,
  children,
  ref,
  className,
  ...props
}: TabsProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(tabs.machine, {
    id: uniqueId,
    value,
    defaultValue,
    orientation,
    dir,
    activationMode,
    loopFocus,
    onValueChange: ({ value }) => {
      onValueChange?.(value)
    },
  })

  const api = tabs.connect(service, normalizeProps)
  const styles = tabsVariants({ variant, size, fitted, justify })

  return (
    <TabsContext.Provider
      value={{ api, variant, size, fitted, justify, styles }}
    >
      <div
        ref={ref}
        className={styles.root({ className })}
        {...api.getRootProps()}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// List component
interface TabsListProps extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
}

Tabs.List = function TabsList({
  children,
  ref,
  className,
  ...props
}: TabsListProps) {
  const { api, styles } = useTabsContext()

  return (
    <div
      ref={ref}
      className={styles.list({ className })}
      {...api.getListProps()}
      {...props}
    >
      {children}
    </div>
  )
}

// Trigger component
interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {
  value: string
  disabled?: boolean
  ref?: RefObject<HTMLButtonElement>
}

Tabs.Trigger = function TabsTrigger({
  value,
  disabled,
  children,
  ref,
  className,
  ...props
}: TabsTriggerProps) {
  const { api, styles } = useTabsContext()

  return (
    <Button
      ref={ref}
      theme="borderless"
      className={styles.trigger({ className })}
      {...api.getTriggerProps({ value, disabled })}
      data-disabled={disabled || undefined}
      {...props}
    >
      {children}
    </Button>
  )
}

// Content component
interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {
  value: string
  ref?: RefObject<HTMLDivElement>
}

Tabs.Content = function TabsContent({
  value,
  children,
  ref,
  className,
  ...props
}: TabsContentProps) {
  const { api, styles } = useTabsContext()

  return (
    <div
      ref={ref}
      className={styles.content({ className })}
      {...api.getContentProps({ value })}
      {...props}
    >
      {children}
    </div>
  )
}

// Indicator component
interface TabsIndicatorProps extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
}

Tabs.Indicator = function TabsIndicator({
  ref,
  className,
  ...props
}: TabsIndicatorProps) {
  const { api, styles } = useTabsContext()

  return (
    <div
      ref={ref}
      className={styles.indicator({ className })}
      {...api.getIndicatorProps()}
      {...props}
    />
  )
}

// Display name
Tabs.displayName = 'Tabs'
>>>>>>> theirs
