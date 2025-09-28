import * as accordion from '@zag-js/accordion'
import { normalizeProps, useMachine } from '@zag-js/react'
import {
  type ComponentPropsWithoutRef,
  type RefObject,
  createContext,
  useContext,
  useId,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { Icon, type IconType } from '../atoms/icon'
import { tv } from '../utils'

const accordionVariants = tv({
  slots: {
    root: [
      'flex flex-col w-full',
      'bg-accordion-bg rounded-accordion',
      'transition-all duration-200',
    ],
    item: '',
    title: 'grid place-items-start',
    titleTrigger: [
      'flex items-center relative justify-between w-full cursor-pointer',
      'rounded-none',
      'font-accordion-title',
      'text-accordion-title-fg bg-accordion-title-bg',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accordion-ring focus-visible:ring-offset-0',
      'focus-visible:bg-accordion-bg-hover',
      'data-[disabled]:text-accordion-fg-disabled',
      'hover:bg-accordion-title-bg-hover',
      // reset button padding
      'px-0 py-0 pr-accordion-icon',
      'data-[disabled=true]:cursor-not-allowed',
    ],
    subtitle: ['text-accordion-subtitle-fg'],
    content: ['text-accordion-content-fg bg-accordion-content-bg'],
    icon: ['data-[state=expanded]:rotate-180'],
  },
  variants: {
    variant: {
      default: {
        root: 'border-accordion-border border-(length:--border-width-accordion)',
        item: 'border-b-(length:--border-width-accordion) border-accordion-border',
      },
      borderless: {},
      child: {},
    },
    shadow: {
      sm: {
        root: 'shadow-accordion-root-sm',
        content: 'shadow-accordion-content-sm',
      },
      md: {
        root: 'shadow-accordion-root-md',
        content: 'shadow-accordion-content-md',
      },
      none: '',
    },
    size: {
      sm: {
        title: 'text-accordion-title-sm p-accordion-title-sm',
        content: 'text-accordion-content-sm px-accordion-content-sm',
        subtitle: 'text-accordion-subtitle-sm',
      },
      md: {
        title: 'text-accordion-title-md p-accordion-title-md',
        content: 'text-accordion-content-md p-accordion-content-md',
        subtitle: 'text-accordion-subtitle-md',
      },
      lg: {
        title: 'text-accordion-title-lg p-accordion-title-lg',
        content: 'text-accordion-content-lg p-accordion-content-lg',
        subtitle: 'text-accordion-subtitle-lg',
      },
    },
  },
  compoundVariants: [
    {
      variant: 'child',
      size: ['sm', 'md', 'lg'],
      className: {
        content: 'py-0 bg-inherit text-inherit',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    shadow: 'none',
    variant: 'default',
  },
})

// Context for sharing state between sub-components
interface AccordionContextValue {
  api: ReturnType<typeof accordion.connect>
  size?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'none'
  styles: ReturnType<typeof accordionVariants>
  variant?: 'default' | 'borderless' | 'child'
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within Accordion.Root')
  }
  return context
}

// Context for sharing item state
interface AccordionItemContextValue {
  value: string
  disabled?: boolean
  variant?: 'default' | 'borderless' | 'child'
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null
)

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext)
  if (!context) {
    throw new Error(
      'Accordion item components must be used within Accordion.Item'
    )
  }
  return context
}

// Root component
interface AccordionProps
  extends VariantProps<typeof accordionVariants>,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  id?: string
  defaultValue?: string[]
  value?: string[]
  collapsible?: boolean
  multiple?: boolean
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  onChange?: (value: string[]) => void
  ref?: RefObject<HTMLDivElement>
}

export function Accordion({
  id,
  defaultValue,
  value,
  collapsible = true,
  multiple = false,
  dir = 'ltr',
  onChange,
  size,
  shadow,
  disabled = false,
  children,
  ref,
  className,
  variant,
  ...props
}: AccordionProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(accordion.machine, {
    id: uniqueId,
    value,
    defaultValue,
    collapsible,
    multiple,
    dir,
    orientation: 'vertical',
    disabled,
    onValueChange: ({ value }) => {
      onChange?.(value)
    },
  })

  const api = accordion.connect(service, normalizeProps)
  const styles = accordionVariants({ size, shadow, variant })

  return (
    <AccordionContext.Provider value={{ api, size, shadow, styles, variant }}>
      <div
        ref={ref}
        className={styles.root({ className })}
        {...api.getRootProps()}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

// Item component
interface AccordionItemProps extends ComponentPropsWithoutRef<'div'> {
  value: string
  disabled?: boolean
  ref?: RefObject<HTMLDivElement>
}

Accordion.Item = function AccordionItem({
  value,
  disabled,
  children,
  ref,
  className,
  ...props
}: AccordionItemProps) {
  const { api, styles, variant } = useAccordionContext()

  return (
    <AccordionItemContext.Provider value={{ value, disabled, variant }}>
      <div
        ref={ref}
        {...api.getItemProps({ value })}
        className={styles.item({ className })}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

// Header component (trigger wrapper)
interface AccordionHeaderProps extends ComponentPropsWithoutRef<'header'> {
  ref?: RefObject<HTMLElement>
}

Accordion.Header = function AccordionHeader({
  children,
  ref,
  className,
  ...props
}: AccordionHeaderProps) {
  const { api, styles } = useAccordionContext()
  const { value, disabled } = useAccordionItemContext()

  return (
    <header ref={ref} className={className} {...props}>
      <Button
        type="button"
        theme="borderless"
        className={styles.titleTrigger()}
        {...api.getItemTriggerProps({ value, disabled })}
        data-disabled={disabled}
      >
        {children}
      </Button>
  )
}

// Content component
interface AccordionContentProps extends ComponentPropsWithoutRef<'div'> {
  ref?: RefObject<HTMLDivElement>
}

Accordion.Content = function AccordionContent({
  children,
  ref,
  className,
  ...props
}: AccordionContentProps) {
  const { api, styles } = useAccordionContext()
  const { value } = useAccordionItemContext()

  return (
    <div
      ref={ref}
      className={styles.content({ className })}
      {...api.getItemContentProps({ value })}
      data-state={api.value.includes(value) ? 'expanded' : 'collapsed'}
      {...props}
    >
      {children}
    </div>
  )
}

// Indicator component (for expand/collapse icon)
interface AccordionIndicatorProps extends ComponentPropsWithoutRef<'span'> {
  icon?: string
  ref?: RefObject<HTMLSpanElement>
}

Accordion.Indicator = function AccordionIndicator({
  icon = 'token-icon-accordion-chevron',
  ref,
  className,
  ...props
}: AccordionIndicatorProps) {
  const { api, styles } = useAccordionContext()
  const { value } = useAccordionItemContext()

  const isExpanded = api.value.includes(value)

  return (
    <span ref={ref} className={className} {...props}>
      <Icon
        className={styles.icon()}
        icon={icon as IconType}
        data-state={isExpanded ? 'expanded' : 'collapsed'}
      />
    </span>
  )
}

// Title component (optional structured title)
interface AccordionTitleProps extends ComponentPropsWithoutRef<'h3'> {
  ref?: RefObject<HTMLHeadingElement>
}

Accordion.Title = function AccordionTitle({
  children,
  ref,
  className,
  ...props
}: AccordionTitleProps) {
  const { styles } = useAccordionContext()

  return (
    <div className={styles.title({ className })}>
      <h3 ref={ref} {...props}>
        {children}
      </h3>
    </div>
  )
}

// Subtitle component (optional structured subtitle)
interface AccordionSubtitleProps extends ComponentPropsWithoutRef<'h4'> {
  ref?: RefObject<HTMLHeadingElement>
}

Accordion.Subtitle = function AccordionSubtitle({
  children,
  ref,
  className,
  ...props
}: AccordionSubtitleProps) {
  const { styles } = useAccordionContext()

  return (
    <h4 ref={ref} className={styles.subtitle({ className })} {...props}>
      {children}
    </h4>
  )
}
