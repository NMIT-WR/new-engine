import { normalizeProps, useMachine } from '@zag-js/react'
import * as zagSwitch from '@zag-js/switch'
import { type ReactNode, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const switchVariants = tv({
  slots: {
    root: [
      'inline-flex items-center gap-root',
      'cursor-pointer',
      'data-[disabled]:cursor-not-allowed',
    ],
    control: [
      'relative inline-flex shrink-0 items-center justify-start p-control-padding',
      'bg-switch-bg hover:bg-switch-hover',
      'w-track-width h-track-height',
      'rounded-switch',
      'transition-colors duration-200',
      'ring-offset-transparent outline-none',
      'border-(length:--border-width-switch) border-switch-border',
      'data-[state=checked]:bg-switch-checked',
      'data-[state=checked]:hover:bg-switch-checked-hover',
      'data-[disabled]:bg-switch-disabled',
      'data-[disabled]:border-switch-border-disabled',
      'data-[focus]:ring-2 data-[focus]:ring-offset-2 data-[focus]:ring-offset-base',
      'data-[focus]:ring-switch-ring data-[focus]:outline-none',
      ' data-[invalid]:bg-switch-invalid data-[invalid]:ring-switch-ring-invalid',
    ],
    thumb: [
      'block rounded-full h-thumb-height aspect-square bg-switch-thumb',
      'transform transition-transform duration-200',
      'data-[disabled]:bg-switch-thumb-disabled',
      'data-[state=checked]:translate-x-translate-track',
    ],
    label: [
      'select-none',
      'text-switch-label',
      'data-[disabled]:text-switch-label-disabled',
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
    onCheckedChange: ({ checked }: { checked: boolean }) =>
      onCheckedChange?.(checked),
  })

  const api = zagSwitch.connect(service, normalizeProps)

  const { root, control, thumb, label, hiddenInput } = switchVariants({
    className,
  })

  return (
    <label className={root()} {...api.getRootProps()}>
      <input className={hiddenInput()} {...api.getHiddenInputProps()} />
      <span className={control()} {...api.getControlProps()}>
        <span className={thumb()} {...api.getThumbProps()} />
      </span>
      {children && (
        <span className={label()} {...api.getLabelProps()}>
          {children}
        </span>
      )}
    </label>
  )
}
