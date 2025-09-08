import * as dialog from '@zag-js/dialog'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import { type ReactNode, useId } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
import { Button } from '../atoms/button'

const dialogVariants = tv({
  slots: {
    backdrop: ['fixed inset-0 z-(--z-dialog-backdrop)'],
    positioner: [
      'fixed inset-0 z-(--z-dialog-positioner) flex items-center justify-center',
    ],
    content: [
      'relative flex flex-col p-dialog-content gap-dialog-content',
      'bg-dialog-content-bg text-dialog-content-fg',
      'border-(length:--border-width-dialog) border-dialog-content-border',
      'rounded-dialog-content shadow-dialog-content',
      'max-h-dialog-content overflow-y-auto',
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
  defaultVariants: {
    behavior: 'modal',
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
}

export function Dialog({
  id,
  open,
  onOpenChange,
  initialFocusEl,
  finalFocusEl,
  role = 'dialog',
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
  } = dialogVariants({ behavior })

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
            <div className={content()} {...api.getContentProps()}>
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
