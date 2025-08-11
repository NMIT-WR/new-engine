import { normalizeProps, useMachine } from '@zag-js/react'
import * as steps from '@zag-js/steps'
import { type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { slugify, tv } from '../utils'

const stepsVariants = tv({
  slots: {
    root: [
      'relative flex bg-steps-root-bg',
      'gap-root',
      'text-steps-fg',
      'data-[orientation=horizontal]:flex-col',
      'data-[orientation=vertical]:grid data-[orientation=vertical]:grid-cols-[auto_1fr]',
    ],
    list: [
      'relative flex bg-steps-list-bg gap-list',
      'data-[orientation=vertical]:flex-col',
      'data-[orientation=vertical]:h-full',
    ],
    item: [
      'relative flex bg-steps-item-bg items-center gap-item',
      'focus-visible:outline-none',
      'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:justify-start',
      'data-[orientation=vertical]:flex-col data-[orientation=vertical]:h-full',
    ],
    trigger: [
      'relative gap-trigger flex cursor-pointer',
      'items-center justify-center',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-steps-ring focus-visible:ring-offset-2 focus-visible:ring-offset-steps-list-bg',
      'data-[orientation=horizontal]:flex-row',
      'data-[orientation=vertical]:flex-col',
    ],
    content: [
      'grid p-content bg-steps-content-bg',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steps-ring',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-steps-list-bg',
      'data-[orientation=horizontal]:w-full',
      'data-[orientation=vertical]:flex-1',
    ],
    indicator: [
      'grid place-items-center',
      'h-steps-indicator rounded-full aspect-square',
      'bg-steps-indicator-bg data-[complete]:bg-steps-indicator-complete',
      'data-[current]:bg-steps-indicator-current data-[current]:ring-2',
      'data-[current]:ring-steps-ring data-[current]:ring-offset-2',
      'data-[current]:ring-offset-steps-list-bg data-[current]:outline-none',
      'data-[current]:text-steps-fg-current data-[complete]:text-steps-fg-active',
    ],
    separator: [
      'bg-steps-separator-bg',
      'data-[complete]:bg-steps-separator-complete',
      'data-[orientation=horizontal]:h-steps-separator data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-1',
      'data-[orientation=vertical]:w-steps-separator data-[orientation=vertical]:h-full',
    ],
    progress: ['absolute top-0 left-0 h-full transition-all duration-300'],
    containerButtons: [
      'flex gap-2 h-fit',
      'data-[orientation=vertical]:col-start-2',
    ],
    stepButton: [
      'rounded-none p-steps-btn',
      'focus-visible:ring-2 focus-visible:ring-steps-ring focus-visible:ring-offset-2 focus-visible:ring-offset-steps-list-bg',
    ],
  },
})

export type StepItem = {
  value: number
  title: string
  content?: ReactNode
  icon?: ReactNode
}

export interface StepsProps extends VariantProps<typeof stepsVariants> {
  id?: string
  items: StepItem[]
  currentStep?: number
  orientation?: 'horizontal' | 'vertical'
  linear?: boolean
  showProgress?: boolean
  completeText?: ReactNode
  onStepChange?: (step: number) => void
  onStepComplete?: () => void
  className?: string
  showControls?: boolean
}

export function Steps({
  id,
  items,
  currentStep = 0,
  orientation = 'horizontal',
  linear = false,
  showControls = true,
  completeText,
  onStepChange,
  onStepComplete,
}: StepsProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(steps.machine, {
    id: uniqueId,
    count: items.length,
    step: currentStep,
    orientation,
    linear,
    onStepChange: (details) => {
      onStepChange?.(details.step)
    },
    onStepComplete: () => {
      onStepComplete?.()
    },
  })

  const api = steps.connect(service, normalizeProps)

  const {
    root,
    list,
    item,
    trigger,
    separator,
    indicator,
    content,
    containerButtons,
    stepButton,
  } = stepsVariants()

  return (
    <div className={root()} {...api.getRootProps()}>
      <div className={list()} {...api.getListProps()}>
        {items.map((step, index) => (
          <div className={item()} key={slugify(step.title)} {...api.getItemProps({ index })}>
            <button className={trigger()} {...api.getTriggerProps({ index })}>
              <span
                className={indicator()}
                {...api.getIndicatorProps({ index })}
              >
                {index + 1}
              </span>
              <span>{step.title}</span>
            </button>
            {index < items.length - 1 && (
              <div
                className={separator()}
                {...api.getSeparatorProps({ index })}
              />
            )}
          </div>
        ))}
      </div>
      {items.map((step, index) => (
        <div
          className={content()}
          key={`content-${slugify(step.title)}`}
          {...api.getContentProps({ index })}
        >
          <article className="h-fit">
            <h3>{step.title}</h3>
            {step.content}
          </article>
        </div>
      ))}
      <div
        className={content()}
        {...api.getContentProps({ index: items.length })}
      >
        {completeText}
      </div>

      {showControls && (
        <div className={containerButtons()} data-orientation={orientation}>
          <Button
            theme="solid"
            size="sm"
            className={stepButton()}
            {...api.getPrevTriggerProps()}
          >
            Back
          </Button>
          <Button
            size="sm"
            theme="solid"
            className={stepButton()}
            {...api.getNextTriggerProps()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
