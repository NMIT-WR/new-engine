import * as checkbox from '@zag-js/checkbox'
import { normalizeProps, useMachine } from '@zag-js/react'
import { type InputHTMLAttributes, type Ref, useId } from 'react'
import { Label } from '../atoms/label'
import { tv } from '../utils'

const checkboxVariants = tv({
  base: [
    'appearance-none relative cursor-pointer',
    'h-checkbox w-checkbox',
    'border border-checkbox-border rounded-checkbox',
    'bg-checkbox data-[state=checked]:bg-checkbox-checked border-checkbox',
    /* center icon, grid and place items do not work e.g. flex */
    'after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2',
    'data-[state=checked]:after:token-icon-checkbox text-icon-text data-[state=checked]:text-checkbox-icon-md',
    'data-[disabled]:opacity-checkbox-disabled data-[disabled]:cursor-not-allowed data-[disabled]:grayscale',
    'transition-all duration-200',
    'data-[focus]:outline-none data-[focus]:ring-2 data-[focus]:ring-checkbox-ring data-[focus]:ring-offset-checkbox-offset data-[focus]:ring-offset-2',
    'data-[invalid]:ring-checkbox-error ',
    'data-[invalid]:border-checkbox-border-error',
    'data-[state=indeterminate]:bg-checkbox-indeterminate',
    'data-[state=indeterminate]:after:w-indeterminate data-[state=indeterminate]:after:h-indeterminate',
    'data-[state=indeterminate]:after:bg-icon-text',
  ],
})

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  ref?: Ref<HTMLInputElement>
  readOnly?: boolean

  defaultChecked?: boolean
  indeterminate?: boolean
  invalid?: boolean

  onChange?: (checked: boolean | 'indeterminate') => void
}

export function Checkbox({
  id,
  name,
  checked,
  defaultChecked,
  indeterminate,
  disabled,
  onChange,
  className,
  invalid,
  readOnly,
}: CheckboxProps) {
  const fallbackId = useId()
  const service = useMachine(checkbox.machine, {
    id: id || fallbackId,
    name,
    disabled,
    defaultChecked,
    readOnly,
    checked: indeterminate ? 'indeterminate' : checked,
    invalid: invalid,
    onCheckedChange: (details) => {
      onChange?.(details.checked)
    },
  })

  const api = checkbox.connect(service, normalizeProps)

  return (
    <Label {...api.getRootProps()}>
      <div
        {...api.getControlProps()}
        className={checkboxVariants({
          className,
        })}
        data-invalid={invalid}
      />
      <input {...api.getHiddenInputProps()} />
    </Label>
  )
}

Checkbox.displayName = 'Checkbox'
