import type { ReactNode } from 'react'
import { Error } from '../atoms/error'
import { ExtraText } from '../atoms/extra-text'
import { Label } from '../atoms/label'
import { Checkbox, type CheckboxProps } from './checkbox'

type ValidateStatus = 'default' | 'error' | 'success' | 'warning'

interface FormCheckboxProps extends Omit<CheckboxProps, 'size'> {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  extraText?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function FormCheckboxRaw({
  id,
  label,
  validateStatus = 'default',
  helpText,
  extraText,
  size = 'md',
  required,
  disabled,
  ...props
}: FormCheckboxProps) {
  const extraTextId = extraText ? `${id}-extra` : undefined

  return (
    <div className="flex gap-2xs">
      <div className="mt-2 flex items-start">
        <Checkbox id={id} required={required} disabled={disabled} {...props} />
      </div>
      <div className="flex flex-col">
        <Label htmlFor={id} size={size} required={required} disabled={disabled}>
          {label}
        </Label>
        {helpText}
        {extraText && (
          <ExtraText id={extraTextId} size={size}>
            {extraText}
          </ExtraText>
        )}
      </div>
    </div>
  )
}

export function FormCheckbox({
  helpText,
  id,
  validateStatus,
  size,
  ...props
}: FormCheckboxProps) {
  const helpTextId = helpText ? `${id}-helper` : undefined

  return (
    <FormCheckboxRaw
      id={id}
      size={size}
      validateStatus={validateStatus}
      helpText={
        validateStatus === 'error' ? (
          <Error id={helpTextId} size={size}>
            {helpText}
          </Error>
        ) : helpText ? (
          <ExtraText id={helpTextId} size={size}>
            {helpText}
          </ExtraText>
        ) : null
      }
      {...props}
    />
  )
}
