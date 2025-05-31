import * as hoverCard from '@zag-js/hover-card'
import { Portal, normalizeProps, useMachine } from '@zag-js/react'
import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useId,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

// === COMPONENT VARIANTS ===
const hoverCardVariants = tv({
  slots: {
    trigger: '',
    positioner: ['isolate z-(--z-index)'],
    content: [
      'bg-hover-card-bg border border-hover-card-border',
      'rounded-hover-card shadow-hover-card',
      'p-hover-card',
      'min-w-hover-card-min-w max-w-hover-card-max-w',
      'focus:outline-none',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[placement=top]:slide-in-from-bottom-2',
      'data-[placement=bottom]:slide-in-from-top-2',
      'data-[placement=left]:slide-in-from-right-2',
      'data-[placement=right]:slide-in-from-left-2',
    ],
    arrow: [
      'fill-hover-card-arrow-bg',
      'stroke-hover-card-arrow-border',
      'stroke-1',
    ],
  },
  variants: {
    size: {
      sm: {
        content: 'text-sm p-hover-card-sm',
      },
      md: {
        content: 'text-base p-hover-card',
      },
      lg: {
        content: 'text-lg p-hover-card-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// === COMPONENT PROPS ===
export interface HoverCardProps
  extends VariantProps<typeof hoverCardVariants>,
    hoverCard.Props {
  children: ReactNode
  content: ReactNode
  className?: string
  showArrow?: boolean
}

export function HoverCard({
  // NATIVE PROPS

  dir,
  id,
  openDelay = 700,
  closeDelay = 300,
  positioning,
  open,
  defaultOpen,
  onOpenChange,

  // CUSTOM PROPS
  children,
  content,
  className,
  size = 'md',
  showArrow = true,
}: HoverCardProps) {
  const generatedId = useId()

  const service = useMachine(hoverCard.machine, {
    id: id || generatedId,
    dir,
    openDelay,
    closeDelay,
    positioning,
    open,
    defaultOpen,
    onOpenChange,
  })

  const api = hoverCard.connect(service as hoverCard.Service, normalizeProps)

  const {
    // trigger,
    positioner,
    content: contentSlot,
    arrow,
  } = hoverCardVariants({ size })

  const renderTrigger = () => {
    if (isValidElement(children)) {
      return cloneElement(children as ReactElement, {
        ...api.getTriggerProps(),
      })
    }
    return <span {...api.getTriggerProps()}>{children}</span>
  }

  return (
    <>
      {renderTrigger()}
      {api.open && (
        <Portal>
          <div className={positioner()} {...api.getPositionerProps()}>
            <div
              className={`${contentSlot()} ${className || ''}`}
              {...api.getContentProps()}
            >
              {showArrow && (
                <div {...api.getArrowProps()}>
                  <div {...api.getArrowTipProps()}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className={arrow()}
                    >
                      <path d="M1 6L6 1L11 6" />
                    </svg>
                  </div>
                </div>
              )}
              {content}
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}

HoverCard.displayName = 'HoverCard'
