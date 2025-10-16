import * as accordion from '@zag-js/accordion'
import { normalizeProps, useMachine } from '@zag-js/react'
import { type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { Icon } from '../atoms/icon'
import { tv } from '../utils'

const accordionVariants = tv({
  slots: {
    root: [
      'flex flex-col w-full',
      'bg-accordion-bg border-accordion-border rounded-accordion',
      'border-(length:--border-width-accordion)',
      'transition-all duration-200',
    ],
    item: [
      'border-b-(length:--border-width-accordion) border-accordion-border',
    ],
    title: 'grid place-items-start',
    titleTrigger: [
      'flex items-center relative justify-between w-full cursor-pointer',
      'rounded-none',
      'font-accordion-title',
      'text-accordion-title-fg bg-accordion-title-bg',
      'focus-visible:outline-none',
      'focus-visible:ring',
      'focus-visible:ring-accordion-ring',
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
  defaultVariants: {
    size: 'md',
    shadow: 'none',
  },
})

export type AccordionItem = {
  id: string
  value: string
  title: ReactNode
  subtitle?: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps extends VariantProps<typeof accordionVariants> {
  id?: string
  items: AccordionItem[]
  defaultValue?: string[]
  value?: string[]
  collapsible?: boolean
  multiple?: boolean
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  onChange?: (value: string[]) => void
}

export function Accordion({
  id,
  items = [],
  defaultValue,
  value,
  collapsible = true,
  multiple = false,
  dir = 'ltr',
  onChange,
  size,
  shadow,
  disabled = false,
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

  const { root, item, title, titleTrigger, content, icon, subtitle } =
    accordionVariants({
      size,
      shadow,
    })

  return (
    <div className={root()} {...api.getRootProps()}>
      {items.map((accordionItem) => (
        <div
          key={accordionItem.id}
          {...api.getItemProps({
            value: accordionItem.value,
          })}
          className={item()}
        >
          <header>
            <Button
              theme="borderless"
              className={titleTrigger()}
              {...api.getItemTriggerProps({
                value: accordionItem.value,
                disabled: accordionItem.disabled,
              })}
              data-disabled={accordionItem.disabled}
            >
              <div className={title()}>
                <h3>{accordionItem.title}</h3>
                {accordionItem.subtitle && (
                  <h4 className={subtitle()}>{accordionItem.subtitle}</h4>
                )}
              </div>
              <Icon
                className={icon()}
                icon="token-icon-accordion-chevron"
                data-state={
                  api.value.includes(accordionItem.value)
                    ? 'expanded'
                    : 'collapsed'
                }
              />
            </Button>
          </header>
          <div
            className={content()}
            {...api.getItemContentProps({
              value: accordionItem.value,
            })}
            data-state={
              api.value.includes(accordionItem.value) ? 'expanded' : 'collapsed'
            }
          >
            {accordionItem.content}
          </div>
        </div>
      ))}
    </div>
  )
}
