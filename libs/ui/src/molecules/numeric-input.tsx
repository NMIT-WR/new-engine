import * as numberInput from '@zag-js/number-input'
import { normalizeProps, useMachine } from '@zag-js/react'
import { tes, useId, useId, useId, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Button } from '../atoms/button'
import { Input } from '../atoms/input'
import { Label } from '../atoms/label'
import { tv } from '../utils'

const numericInput = tv({
  slots: {
    root: ['flex flex-col relative'],
    inputContainer: [
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
      'cursor-pointer text-increment-btn focus:ring-increment-btn-ring',
    ],
    scrubber: 'absolute inset-0 cursor-ew-resize',
    label: '',
  },
  variants: {
    size: {
      sm: {
        root: 'gap-ni-root-sm text-ni-sm',
        trigger: 'text-ni-sm',
        label: 'text-ni-sm',
        input: 'text-ni-sm',
      },
      md: {
        root: 'gap-ni-root-md text-ni-md',
        trigger: 'text-ni-md',
        label: 'text-ni-md',
        input: 'text-ni-md',
      },
      lg: {
        root: 'gap-ni-root-lg text-ni-lg',
        trigger: 'text-ni-lg',
        label: 'text-ni-lg',
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
  labelText?: string
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
  labelText,
  name,
  className,
  invalid,
  ...props
}: NumericInputProps) {
  const generatedId = useId()
  const id = props.id || generatedId

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

  const {
    root,
    inputContainer,
    input,
    triggerContainer,
    trigger,
    label,
    scrubber,
  } = numericInput()

  const reducedProps = {
    ...props,
    size: undefined,
  }

  return (
    <div className={root({ className })} {...api.getRootProps()}>
      {labelText && (
        <Label className={label({ size })} {...api.getLabelProps()}>
          {labelText}
        </Label>
      )}
      <div className={inputContainer()} {...api.getControlProps()}>
        {allowScrubbing && (
          <div className={scrubber()} {...api.getScrubberProps()} />
        )}
        <Input
          className={input({ size })}
          {...api.getInputProps()}
          {...reducedProps}
        />
        <div className={triggerContainer({ hideControls })}>
          <Button
            size="sm"
            theme="borderless"
            className={trigger({ size })}
            {...api.getIncrementTriggerProps()}
            icon="token-icon-ni-increment"
          />
          <Button
            size="sm"
            theme="borderless"
            className={trigger({ size })}
            {...api.getDecrementTriggerProps()}
            icon="token-icon-ni-decrement"
          />
        </div>
      </div>
    </div>
  )
}
