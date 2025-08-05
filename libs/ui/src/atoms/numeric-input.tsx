import * as numberInput from '@zag-js/number-input'
import { normalizeProps, useMachine } from '@zag-js/react'
import { type InputHTMLAttributes, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'
import { Button } from './button'
import { Input } from './input'

const numericInput = tv({
  slots: {
    root: ['flex relative'],
    container: [
      'flex relative border-(length:--border-width-ni)',
      'border-ni-border rounded-ni overflow-hidden items-center',
      'data-[invalid]:bg-ni-invalid-bg',
      'data-[invalid]:border-ni-invalid-border',
    ],
    input: [
      'p-ni-input',
      'bg-ni-input-bg border-none focus:bg-ni-input-bg-active hover:bg-ni-input-bg-hover',
      'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
      'data-[invalid]:focus:border-input-border-danger-focus',
    ],
    triggerContainer:
      'flex flex-col h-fit justify-center bg-ni-trigger-container',
    trigger: [
      'px-ni-trigger-x py-ni-trigger-y',
      'cursor-pointer  focus:ring-increment-btn-ring',
    ],
    scrubber: 'absolute inset-0 cursor-ew-resize',
  },
  variants: {
    size: {
      sm: {
        root: 'text-ni-sm',
        trigger: 'text-ni-sm',
        input: 'text-ni-sm',
      },
      md: {
        root: 'text-ni-md',
        trigger: 'text-ni-md',
        input: 'text-ni-md',
      },
      lg: {
        root: 'text-ni-lg',
        trigger: 'text-ni-lg',
        input: 'text-ni-lg',
      },
    },
    hideControls: {
      true: {
        triggerContainer: 'invisible',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export interface NumericInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'defaultValue' | 'onChange' | 'type'
  > {
  size?: VariantProps<typeof numericInput>['size']
  hideControls?: boolean
  allowScrubbing?: boolean
  name?: string
  disabled?: boolean

  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  dir?: 'ltr' | 'rtl'
  min?: number
  max?: number
  step?: number
  precision?: number
  allowMouseWheel?: boolean
  allowOverflow?: boolean
  clampValueOnBlur?: boolean
  spinOnPress?: boolean
  formatOptions?: Intl.NumberFormatOptions
  invalid?: boolean
}

export function NumericInput({
  size = 'md',
  hideControls = true,
  allowScrubbing = false,
  disabled = false,
  min,
  max,
  step = 1,
  precision,
  value,
  defaultValue,
  onChange,
  allowMouseWheel = true,
  allowOverflow,
  clampValueOnBlur = true,
  spinOnPress = true,
  dir = 'ltr',
  formatOptions,
  name,
  className,
  invalid,
  id: providedId,
  ...props
}: NumericInputProps) {
  const generatedId = useId()
  const id = providedId || generatedId

  const stringValue = value !== undefined ? String(value) : undefined
  const stringDefaultValue =
    defaultValue !== undefined ? String(defaultValue) : undefined

  const service = useMachine(numberInput.machine, {
    id,
    min,
    max,
    step,
    name,
    disabled,
    dir,
    invalid,
    value: stringValue,
    defaultValue: stringDefaultValue,
    allowMouseWheel,
    allowOverflow,
    clampValueOnBlur,
    spinOnPress,
    formatOptions: precision
      ? { maximumFractionDigits: precision }
      : formatOptions,
    onValueChange: (details) => {
      onChange?.(details.valueAsNumber)
    },
    focusInputOnChange: true,
  })

  const api = numberInput.connect(service, normalizeProps)

  const { root, container, input, triggerContainer, trigger, scrubber } =
    numericInput({ size, hideControls })

  const reducedProps = {
    ...props,
    size: undefined,
  }

  return (
    <div className={root({ className })} {...api.getRootProps()}>
      <div
        className={container()}
        {...api.getControlProps()}
        data-invalid={invalid || undefined}
      >
        {allowScrubbing && (
          <div className={scrubber()} {...api.getScrubberProps()} />
        )}
        <Input className={input()} {...api.getInputProps()} {...reducedProps} />
        <div className={triggerContainer()}>
          <Button
            size="sm"
            theme="borderless"
            className={trigger()}
            {...api.getIncrementTriggerProps()}
            icon="token-icon-ni-increment"
          />
          <Button
            size="sm"
            theme="borderless"
            className={trigger()}
            {...api.getDecrementTriggerProps()}
            icon="token-icon-ni-decrement"
          />
        </div>
      </div>
    </div>
  )
}
