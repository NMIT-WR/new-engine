import * as checkbox from '@zag-js/checkbox'
import { normalizeProps, useMachine } from '@zag-js/react'
import { type InputHTMLAttributes, type Ref, useId } from 'react'
import { ErrorText } from '../atoms/error-text'
import { ExtraText } from '../atoms/extra-text'
import { Label } from '../atoms/label'
import { tv } from '../utils'

const checkboxVariants = tv({
  slots: {
    root: [],
    label: ['flex items-center gap-2 cursor-pointer'],
    checkbox: [
      'appearance-none relative cursor-pointer flex-shrink-0',
      'h-checkbox w-checkbox',
      'border border-checkbox-border rounded-checkbox',
      'bg-checkbox data-[state=checked]:bg-checkbox-checked border-checkbox',
      /* center icon, grid and place items do not work e.g. flex */
      'after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2',
      'data-[state=checked]:after:token-icon-checkbox text-icon-fg data-[state=checked]:text-checkbox-icon-md',
      'data-[disabled]:opacity-checkbox-disabled data-[disabled]:cursor-not-allowed data-[disabled]:grayscale',
      'transition-all duration-200',
      'data-[focus]:outline-none data-[focus]:ring-2 data-[focus]:ring-checkbox-ring data-[focus]:ring-offset-checkbox-offset data-[focus]:ring-offset-2',
      'data-[invalid]:ring-checkbox-error ',
      'data-[invalid]:border-checkbox-border-error',
      'data-[state=indeterminate]:bg-checkbox-indeterminate',
      'data-[state=indeterminate]:after:w-indeterminate data-[state=indeterminate]:after:h-indeterminate',
      'data-[state=indeterminate]:after:bg-icon-fg',
    ],
  },
})

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  ref?: Ref<HTMLInputElement>
  readOnly?: boolean

  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  invalid?: boolean

  labelText?: string
  helperText?: string
  errorText?: string

  onCheckedChange?: checkbox.Props['onCheckedChange']
}

export function Checkbox({
  id,
  name,
  checked,
  defaultChecked,
  indeterminate,
  disabled,
  onCheckedChange,
  className,
  invalid,
  readOnly,
  labelText,
  errorText,
  helperText,
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
      // Always call the provided handler
      onCheckedChange?.(details)
    },
  })

  const api = checkbox.connect(service, normalizeProps)

  const {
    checkbox: checkboxSlot,
    root,
    label: labelSlot,
  } = checkboxVariants({
    className,
  })

  return (
    <div className={root({ className })}>
      <Label className={labelSlot()} {...api.getRootProps()}>
        <div
          {...api.getControlProps()}
          className={checkboxSlot({
            className,
          })}
          data-invalid={invalid}
        />
        <input {...api.getHiddenInputProps()} />
        {labelText && <Label {...api.getLabelProps()}>{labelText}</Label>}
      </Label>

      {(errorText || helperText) && (
        <div>
          {invalid && errorText && <ErrorText>{errorText}</ErrorText>}
          {!invalid && helperText && <ExtraText>{helperText}</ExtraText>}
        </div>
      )}
    </div>
  )
}

Checkbox.displayName = 'Checkbox'
