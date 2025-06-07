import * as popover from '@zag-js/popover'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import { type ReactNode, type Ref, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Icon } from '../atoms/icon'
import { tv } from '../utils'

const popoverVariants = tv({
  slots: {
    trigger: [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-colors',
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
      'bg-popover',
      'text-popover-fg',
      'rounded-popover',
      'border',
      'border-popover-border',
      'shadow-popover',
      'outline-none',
      'data-[state=open]:animate-in',
      'data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0',
      'data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95',
      'data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
    ],
    arrow: ['relative', 'w-popover-arrow', 'h-popover-arrow'],
    arrowTip: [
      'absolute',
      'w-popover-arrow',
      'h-popover-arrow',
      'rotate-45',
      'bg-popover',
      'border',
      'border-popover-border',
      '[border-bottom-color:transparent]',
      '[border-right-color:transparent]',
    ],
    title: ['text-lg', 'font-semibold', 'leading-none', 'mb-popover-title-mb'],
    description: ['text-sm', 'text-popover-description', 'leading-normal'],
    closeTrigger: [
      'absolute',
      'right-popover-close-right',
      'top-popover-close-top',
      'rounded-sm',
      'text-popover-fg',
      'opacity-60',
      'transition-opacity',
      'hover:opacity-100',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring-primary',
      'focus:ring-offset-2',
      'disabled:pointer-events-none',
    ],
  },
  variants: {
    size: {
      sm: {
        content: 'p-popover-sm text-sm',
        title: 'text-base',
      },
      md: {
        content: 'p-popover-md',
      },
      lg: {
        content: 'p-popover-lg text-lg',
        title: 'text-xl',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface PopoverProps extends VariantProps<typeof popoverVariants> {
  /**
   * The trigger element that opens the popover
   */
  trigger: ReactNode

  /**
   * The content to display in the popover
   */
  children: ReactNode

  /**
   * Whether the popover is open (controlled mode)
   */
  open?: boolean

  /**
   * Whether the popover is open by default (uncontrolled mode)
   */
  defaultOpen?: boolean

  /**
   * Callback when the open state changes
   */
  onOpenChange?: (open: boolean) => void

  /**
   * The placement of the popover relative to the trigger
   */
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end'

  /**
   * The offset from the trigger
   */
  offset?: { mainAxis?: number; crossAxis?: number }

  /**
   * The minimum gap between the popover and the viewport edge
   */
  gutter?: number

  /**
   * Whether the popover should be modal (traps focus and blocks outside interactions)
   */
  modal?: boolean

  /**
   * Whether to close the popover when clicking outside
   */
  closeOnInteractOutside?: boolean

  /**
   * Whether to close the popover when pressing Escape
   */
  closeOnEscape?: boolean

  /**
   * Whether to show an arrow pointing to the trigger
   */
  showArrow?: boolean

  /**
   * Whether to auto-focus the first focusable element when opened
   */
  autoFocus?: boolean

  /**
   * Whether to restore focus to the trigger when closed
   */
  restoreFocus?: boolean

  /**
   * Whether to render the popover in a portal
   */
  portalled?: boolean

  /**
   * The title of the popover
   */
  title?: ReactNode

  /**
   * The description of the popover
   */
  description?: ReactNode

  /**
   * Whether to show a close button
   */
  showCloseButton?: boolean

  /**
   * The popover's unique identifier
   */
  id?: string

  /**
   * Accessible label for the popover
   */
  'aria-label'?: string

  /**
   * Reference to the trigger element
   */
  triggerRef?: Ref<HTMLButtonElement>

  /**
   * Reference to the content element
   */
  contentRef?: Ref<HTMLDivElement>

  /**
   * Additional class name for the trigger
   */
  triggerClassName?: string

  /**
   * Additional class name for the content
   */
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
  restoreFocus = true,
  portalled = true,
  title,
  description,
  showCloseButton = false,
  id,
  'aria-label': ariaLabel,
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
    // Controlled props
    ...(open !== undefined && { open }),
    ...(defaultOpen !== undefined && { defaultOpen }),
    // Positioning
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
    restoreFocus,
    portalled,
    // Callbacks
    onOpenChange: ({ open: isOpen }) => {
      onOpenChange?.(isOpen)
    },
  })

  const api = popover.connect(service as popover.Service, normalizeProps)

  const {
    trigger: triggerStyles,
    positioner,
    content: contentStyles,
    arrow,
    arrowTip,
    title: titleStyles,
    description: descriptionStyles,
    closeTrigger,
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
            <div {...api.getArrowTipProps()} className={arrowTip()} />
          </div>
        )}

        {showCloseButton && (
          <button
            {...api.getCloseTriggerProps()}
            className={closeTrigger()}
            aria-label="Close popover"
          >
            <Icon icon="token-icon-popover-close" size="sm" />
          </button>
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
        aria-label={ariaLabel}
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
