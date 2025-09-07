import { normalizeProps, useMachine } from '@zag-js/react'
import * as zagSwitch from '@zag-js/switch'
import { type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { ErrorText } from '../atoms/error-text'
import { ExtraText } from '../atoms/extra-text'
import { Label } from '../atoms/label'
import { tv } from '../utils'

const switchVariants = tv({
  slots: {
    root: ['cursor-pointer', 'data-[disabled]:cursor-not-allowed'],
    control: [
      'me-switch-root p-switch-control',
      'relative inline-flex shrink-0 items-center justify-start',
      'bg-switch-bg hover:bg-switch-bg-hover',
      'w-switch-track-width h-switch-track-height',
      'rounded-switch',
      'transition-colors duration-200',
      'ring-offset-transparent outline-none',
      'border-(length:--border-width-switch) border-switch-border',
      'data-[state=checked]:bg-switch-bg-checked',
      'data-[state=checked]:hover:bg-switch-bg-checked-hover',
      'data-[disabled]:bg-switch-bg-disabled',
      'data-[disabled]:border-switch-border-disabled',
      'data-[focus]:ring-2 data-[focus]:ring-offset-2 data-[focus]:ring-offset-base',
      'data-[focus]:ring-switch-ring data-[focus]:outline-none',
      'data-[invalid]:bg-switch-bg-invalid data-[invalid]:ring-switch-ring-invalid',
    ],
    thumb: [
      'block rounded-full h-switch-thumb-height aspect-square bg-switch-thumb-bg',
      'transform transition-transform duration-200',
      'data-[disabled]:bg-switch-thumb-bg-disabled',
      'data-[state=checked]:translate-x-switch-translate-track',
    ],
    label: [
      'select-none',
      'text-switch-label-fg',
      'data-[disabled]:text-switch-label-fg-disabled',
    ],
    hiddenInput: 'sr-only',
  },
})

export interface SwitchProps extends VariantProps<typeof switchVariants> {
  id?: string
  name?: string
  value?: string | number
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  invalid?: boolean
  readOnly?: boolean
  required?: boolean
  children?: ReactNode
  onCheckedChange?: (checked: boolean) => void
  className?: string
  dir?: 'ltr' | 'rtl'
  helperText?: string
  errorText?: string
}

export function Switch({
  id,
  name,
  value,
  checked,
  defaultChecked,
  disabled = false,
  invalid = false,
  readOnly = false,
  required = false,
  dir = 'ltr',
  children,
  className,
  onCheckedChange,
  helperText,
  errorText,
}: SwitchProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const service = useMachine(zagSwitch.machine, {
    id: uniqueId,
    name,
    value,
    checked,
    defaultChecked,
    dir,
    disabled,
    invalid,
    readOnly,
    required,
    onCheckedChange: ({ checked }) => onCheckedChange?.(checked),
  })

  const api = zagSwitch.connect(service, normalizeProps)

  const { root, control, thumb, label, hiddenInput } = switchVariants({
    className,
  })

  return (
    <div className={className}>
      <Label className={root()} required={required} {...api.getRootProps()}>
        <input className={hiddenInput()} {...api.getHiddenInputProps()} />
        <span className={control()} {...api.getControlProps()}>
          <span className={thumb()} {...api.getThumbProps()} />
        </span>
        {children && (
          <span className={label()} {...api.getLabelProps()}>
            {children}
          </span>
        )}
      </Label>
      {(errorText || helperText) && (
        <div>
          {invalid && errorText && <ErrorText size="sm">{errorText}</ErrorText>}
          {!invalid && helperText && (
            <ExtraText size="sm">{helperText}</ExtraText>
          )}
        </div>
      )}
    </div>
  )
}
