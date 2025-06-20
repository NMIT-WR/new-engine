import type { ReactNode } from 'react'
import { ErrorText } from '../atoms/error-text'
import { ExtraText } from '../atoms/extra-text'
import { Label } from '../atoms/label'
import { NumericInput, type NumericInputProps } from '../atoms/numeric-input'

type ValidateStatus = 'default' | 'error' | 'success' | 'warning'

interface FormNumericInputRawProps extends NumericInputProps {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  extraText?: ReactNode
}

export function FormNumericInputRaw({
  id,
  label,
  validateStatus = 'default',
  helpText,
  extraText,
  size = 'md',
  required,
  disabled,
  ...props
}: FormNumericInputRawProps) {
  const extraTextId = extraText ? `${id}-extra` : undefined

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} size={size} required={required} disabled={disabled}>
        {label}
      </Label>
      <NumericInput
        id={id}
        size={size}
        required={required}
        invalid={validateStatus === 'error'}
        disabled={disabled}
        {...props}
      />

      {/* Status message */}
      {helpText}

      {extraText && (
        <ExtraText id={extraTextId} size={size}>
          {extraText}
        </ExtraText>
      )}
    </div>
  )
}

export function FormNumericInput({
  helpText,
  id,
  validateStatus,
  size,
  ...props
}: FormNumericInputRawProps) {
  const helpTextId = helpText ? `${id}-helper` : undefined

  return (
    <FormNumericInputRaw
      id={id}
      size={size}
      validateStatus={validateStatus}
      helpText={
        helpText ? (
          validateStatus === 'error' ? (
            <ErrorText id={helpTextId} size={size} showIcon>
              {helpText}
            </ErrorText>
          ) : (
            <ExtraText id={helpTextId} size={size}>
              {helpText}
            </ExtraText>
          )
        ) : undefined
      }
      {...props}
    />
  )
}
