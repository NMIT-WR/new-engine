import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import * as toast from '@zag-js/toast'
import { type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { tv } from '../utils'

// Toast Item Variants
const toastVariants = tv({
  slots: {
    root: [
      'flex flex-col relative rounded-toast-root',
      'border-(length:--border-width-toast) bg-toast-bg shadow-lg',
      'w-toast-width overflow-hidden p-toast-root',
      'data-[type=error]:bg-toast-error-bg data-[type=error]:border-toast-error-border',
      'data-[type=success]:bg-toast-success-bg data-[type=success]:border-toast-success-border',
      'data-[type=info]:bg-toast-info-bg data-[type=info]:border-toast-info-border',
      'data-[type=warning]:bg-toast-warning-bg data-[type=warning]:border-toast-warning-border',

      // required styles by zag-js
      'translate-x-[var(--x)] translate-y-[var(--y)]',
      'scale-[var(--scale)] opacity-[var(--opacity)]',
      'z-[var(--z-index)] h-[var(--height)]',
      'will-change-[translate,opacity,scale]',
      'transition-[translate,scale,opacity] duration-400',
    ],
    group: 'flex flex-col relative',
    header: 'flex relative items-center gap-toast-content',
    icon: [
      'flex-shrink-0 text-toast-icon-size',
      'data-[type=error]:text-toast-error-icon data-[type=error]:token-icon-toast-error',
      'data-[type=success]:text-toast-success-icon data-[type=success]:token-icon-toast-success',
      'data-[type=info]:text-toast-info-icon data-[type=info]:token-icon-toast-info',
      'data-[type=warning]:text-toast-warning-icon data-[type=warning]:token-icon-toast-warning',
      'data-[type=loading]:text-toast-loading-icon data-[type=loading]:token-icon-toast-loading',
    ],
    title: [
      'font-toast-title text-toast-title-size text-toast-title-fg',
      'data-[type=error]:text-toast-error-title',
      'data-[type=success]:text-toast-success-title',
      'data-[type=info]:text-toast-info-title',
      'data-[type=warning]:text-toast-warning-title',
    ],
    description: [
      'text-toast-description-size text-toast-description-fg mt-toast-description-gap',
    ],
    closeButton: [
      'grid place-items-center flex-shrink-0 ml-auto py-0 px-0',
      'cursor-pointer',
      'text-toast-close hover:text-toast-close-hover',
    ],
  },
})

// Toast Item Component
interface ToastProps {
  actor: toast.Options<ReactNode>
  index: number
  parent: toast.GroupService
  placement?: toast.Placement
}

export function Toast({ actor, index, parent, placement }: ToastProps) {
  const composedProps = {
    ...actor,
    index,
    parent,
    placement,
  }
  const service = useMachine(toast.machine, composedProps)
  const api = toast.connect(service, normalizeProps)

  const { root, header, icon, title, description, closeButton } =
    toastVariants()

  return (
    <div className={root()} {...api.getRootProps()}>
      <span {...api.getGhostBeforeProps()} />
      <div className={header()} {...api.getTitleProps()}>
        <span className={icon()} data-type={api.type} />
        <div className={title()} data-type={api.type}>
          {api.type === 'loading' ? 'loading...' : api.title}
        </div>
        <Button
          theme="borderless"
          className={closeButton()}
          {...api.getCloseTriggerProps()}
          icon="token-icon-toast-close"
        />
      </div>
      <div
        className={description()}
        {...api.getDescriptionProps()}
        data-type={api.type}
      >
        {api.description}
      </div>
      <span {...api.getGhostAfterProps()} />
    </div>
  )
}

// Toast Group Component
export interface ToastContainerProps
  extends VariantProps<typeof toastVariants> {
  placement?: toast.Placement
  gap?: number
  offsets?: string
  overlap?: boolean
  max?: number
}

// Create the global toast store
export const toaster = toast.createStore({
  placement: 'bottom-end',
  gap: 16,
  offsets: '24px',
})

export function Toaster() {
  const service = useMachine(toast.group.machine, {
    id: useId(),
    store: toaster,
  })
  const api = toast.group.connect(service, normalizeProps)
  const { group } = toastVariants()
  return (
    <Portal>
      <div className={group()} {...api.getGroupProps()}>
        {api.getToasts().map((toast, index) => (
          <Toast key={toast.id} actor={toast} index={index} parent={service} />
        ))}
      </div>
    </Portal>
  )
}

// Hook for using toaster in components
export function useToast() {
  return toaster
}
