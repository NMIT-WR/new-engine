import * as popover from '@zag-js/popover'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import { type ReactNode, type Ref, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const popoverVariants = tv({
  slots: {
    trigger: [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring-primary',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-disabled',
      'data-[state=open]:ring-2',
      'data-[state=open]:ring-ring-primary',
    ],
    positioner: ['absolute', 'z-50'],
    content: [
      'bg-popover-bg',
      'text-popover-fg',
      'rounded-popover',
      'border',
      'border-popover-border',
      'shadow-popover',
      'outline-none',
    ],
    arrow: ['relative -z-1',],
    title: ['font-popover-title', 'leading-none', 'mb-popover-title-mb'],
    description: ['text-sm', 'text-popover-description', 'leading-normal'],
  },
  variants: {
    size: {
      sm: {
        content: 'p-popover-sm text-sm',
        title: 'text-popover-title-sm',
      },
      md: {
        content: 'p-popover-md',
        title: 'text-popover-title-md',
      },
      lg: {
        content: 'p-popover-lg text-lg',
        title: 'text-popover-title-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface PopoverProps extends VariantProps<typeof popoverVariants>, popover.Props {
  trigger: ReactNode
  children: ReactNode
  placement?: popover.Placement
  offset?: popover.PositioningOptions['offset']
  gutter?: popover.PositioningOptions['gutter']
  showArrow?: boolean
  title?: ReactNode
  description?: ReactNode
  showCloseButton?: boolean
  triggerRef?: Ref<HTMLButtonElement>
  contentRef?: Ref<HTMLDivElement>
  triggerClassName?: string
  contentClassName?: string
}

export function Popover({
  trigger,
  children,
  open,
  defaultOpen,
  onOpenChange,
  placement = 'bottom',
  offset = { mainAxis: 8, crossAxis: 0 },
  gutter = 8,
  modal = false,
  closeOnInteractOutside = true,
  closeOnEscape = true,
  showArrow = true,
  autoFocus = true,
  portalled = true,
  title,
  description,
  id,
  triggerRef,
  contentRef,
  triggerClassName,
  contentClassName,
  size = 'md',
}: PopoverProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(popover.machine, {
    id: uniqueId,
    open,
    defaultOpen,
    dir: 'ltr',
    positioning: {
      placement,
      offset,
      gutter,
    },
    // Behavior
    modal,
    closeOnInteractOutside,
    closeOnEscape,
    autoFocus,
    portalled,
    // Callbacks
    onOpenChange,
  })

  const api = popover.connect(service as popover.Service, normalizeProps)

  const {
    trigger: triggerStyles,
    positioner,
    content: contentStyles,
    arrow,
    title: titleStyles,
    description: descriptionStyles,
  } = popoverVariants({ size })

  const renderContent = () => (
    <div {...api.getPositionerProps()} className={positioner()}>
      <div
        {...api.getContentProps()}
        ref={contentRef}
        className={contentStyles({ className: contentClassName })}
        data-side={placement.split('-')[0]}
        data-state={api.open ? 'open' : 'closed'}
      >
        {showArrow && (
          <div {...api.getArrowProps()} className={arrow()}>
            <div {...api.getArrowTipProps()}/>
          </div>
        )}


        {title && (
          <div {...api.getTitleProps()} className={titleStyles()}>
            {title}
          </div>
        )}

        {description && (
          <div {...api.getDescriptionProps()} className={descriptionStyles()}>
            {description}
          </div>
        )}

        {children}
      </div>
    </div>
  )

  return (
    <>
      <button
        {...api.getTriggerProps()}
        ref={triggerRef}
        className={triggerStyles({ className: triggerClassName })}
        data-state={api.open ? 'open' : 'closed'}
      >
        {trigger}
      </button>

      {portalled ? (
        <Portal>{api.open && renderContent()}</Portal>
      ) : (
        api.open && renderContent()
      )}
    </>
  )
}
