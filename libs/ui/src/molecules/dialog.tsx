import * as dialog from '@zag-js/dialog'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import { type ReactNode, useId } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
import { Button } from '../atoms/button'

const dialogVariants = tv({
  slots: {
    backdrop: ['fixed inset-0 z-(--z-dialog-backdrop)'],
    positioner: ['fixed inset-0 z-(--z-dialog-positioner) flex'],
    content: [
      'relative flex flex-col p-dialog-content gap-dialog-content',
      'bg-dialog-content-bg text-dialog-content-fg',
      'border-(length:--border-width-dialog) border-dialog-content-border',
      'shadow-dialog-content',
      'overflow-y-auto',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dialog-ring focus-visible:ring-offset-2',
    ],
    title: ['text-dialog-title-size font-dialog-title text-dialog-title-fg'],
    description: ['text-dialog-description-size text-dialog-description-fg'],
    trigger: [],
    closeTrigger: [
      'absolute top-dialog-close-trigger-offset right-dialog-close-trigger-offset',
      'flex items-center justify-center',
      'p-dialog-close-trigger-padding rounded-dialog-close-trigger',
      'text-dialog-close-trigger-fg',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dialog-ring focus-visible:ring-offset-dialog-ring-offset',
    ],
    actions:
      'mt-auto flex shrink-0 justify-end gap-dialog-actions pt-dialog-actions',
  },
  variants: {
    placement: {
      center: {
        positioner: 'items-center justify-center',
        content:
          'max-w-dialog-center-w-max max-h-dialog-center-h-max rounded-dialog-center',
      },
      left: {
        positioner: 'items-stretch justify-start',
        content: 'h-full rounded-dialog-left border-l-0',
      },
      right: {
        positioner: 'items-stretch justify-end',
        content: 'h-full rounded-dialog-right border-r-0',
      },
      top: {
        positioner: 'items-start justify-stretch',
        content: 'w-full rounded-dialog-top border-t-0',
      },
      bottom: {
        positioner: 'items-end justify-stretch',
        content: 'w-full rounded-dialog-bottom border-b-0',
      },
    },
    size: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
      xl: {},
      full: {},
    },
    behavior: {
      modal: {
        backdrop: 'bg-dialog-backdrop-bg',
      },
      modeless: {
        backdrop: 'bg-transparent',
        positioner: 'pointer-events-none',
        content: 'pointer-events-auto',
      },
    },
  },
  compoundVariants: [
    // Width for left/right drawers
    {
      placement: ['left', 'right'],
      size: 'xs',
      class: { content: 'w-dialog-xs' },
    },
    {
      placement: ['left', 'right'],
      size: 'sm',
      class: { content: 'w-dialog-sm' },
    },
    {
      placement: ['left', 'right'],
      size: 'md',
      class: { content: 'w-dialog-md' },
    },
    {
      placement: ['left', 'right'],
      size: 'lg',
      class: { content: 'w-dialog-lg' },
    },
    {
      placement: ['left', 'right'],
      size: 'xl',
      class: { content: 'w-dialog-xl' },
    },
    {
      placement: ['left', 'right'],
      size: 'full',
      class: { content: 'w-full' },
    },

    // Height for top/bottom drawers
    {
      placement: ['top', 'bottom'],
      size: 'xs',
      class: { content: 'h-dialog-xs' },
    },
    {
      placement: ['top', 'bottom'],
      size: 'sm',
      class: { content: 'h-dialog-sm' },
    },
    {
      placement: ['top', 'bottom'],
      size: 'md',
      class: { content: 'h-dialog-md' },
    },
    {
      placement: ['top', 'bottom'],
      size: 'lg',
      class: { content: 'h-dialog-lg' },
    },
    {
      placement: ['top', 'bottom'],
      size: 'xl',
      class: { content: 'h-dialog-xl' },
    },
    {
      placement: ['top', 'bottom'],
      size: 'full',
      class: { content: 'h-full' },
    },
  ],
  defaultVariants: {
    placement: 'center',
    behavior: 'modal',
    size: 'md',
  },
})

export interface DialogProps extends VariantProps<typeof dialogVariants> {
  open?: boolean
  onOpenChange?: (details: { open: boolean }) => void
  initialFocusEl?: () => HTMLElement | null
  finalFocusEl?: () => HTMLElement | null
  closeOnEscape?: boolean
  closeOnInteractOutside?: boolean
  preventScroll?: boolean
  trapFocus?: boolean
  role?: 'dialog' | 'alertdialog'
  id?: string
  customTrigger?: boolean
  triggerText?: string
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  actions?: ReactNode
  hideCloseButton?: boolean
  className?: string
}

export function Dialog({
  id,
  open,
  onOpenChange,
  initialFocusEl,
  finalFocusEl,
  role = 'dialog',
  placement = 'center',
  size = 'md',
  behavior = 'modal',
  closeOnEscape = true,
  closeOnInteractOutside = behavior === 'modal' && true,
  preventScroll = behavior === 'modal' && true,
  trapFocus = behavior === 'modal' && true,
  customTrigger = false,
  triggerText = 'Open',
  title,
  description,
  children,
  hideCloseButton = false,
  actions,
  className,
}: DialogProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(dialog.machine, {
    id: uniqueId,
    onOpenChange,
    role,
    closeOnEscape,
    closeOnInteractOutside,
    preventScroll,
    trapFocus,
    initialFocusEl,
    finalFocusEl,
    ...(open !== undefined && { open }),
  })

  const api = dialog.connect(service as dialog.Service, normalizeProps)

  const {
    backdrop,
    positioner,
    content,
    trigger: triggerSlot,
    title: titleSlot,
    description: descriptionSlot,
    closeTrigger,
    actions: actionsSlot,
  } = dialogVariants({ placement, size, behavior })

  return (
    <>
      {!customTrigger && (
        <Button
          size="sm"
          variant="primary"
          className={triggerSlot()}
          {...api.getTriggerProps()}
        >
          {triggerText}
        </Button>
      )}

      {api.open && (
        <Portal>
          <div className={backdrop()} {...api.getBackdropProps()} />
          <div className={positioner()} {...api.getPositionerProps()}>
            <div className={content({ className })} {...api.getContentProps()}>
              {!hideCloseButton && (
                <Button
                  theme="borderless"
                  className={closeTrigger()}
                  {...api.getCloseTriggerProps()}
                  icon="token-icon-dialog-close"
                />
              )}
              {title && (
                <h2 className={titleSlot()} {...api.getTitleProps()}>
                  {title}
                </h2>
              )}
              {description && (
                <div
                  className={descriptionSlot()}
                  {...api.getDescriptionProps()}
                >
                  {description}
                </div>
              )}
              <div className="flex-grow overflow-y-auto">{children}</div>

              {actions && <div className={actionsSlot()}>{actions}</div>}
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}
