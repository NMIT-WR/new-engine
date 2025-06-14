import type { ReactNode } from 'react'
import { ErrorText } from '../atoms/error-text'
import { ExtraText } from '../atoms/extra-text'
import { Label } from '../atoms/label'
import { Textarea, type TextareaProps } from '../atoms/textarea'

type ValidateStatus = 'default' | 'error' | 'success' | 'warning'

interface FormTextareaRawProps extends TextareaProps {
  id: string
  label: ReactNode
  validateStatus?: ValidateStatus
  helpText?: ReactNode
  extraText?: ReactNode
}

export function FormTextareaRaw({
  id,
  label,
  validateStatus = 'default',
  helpText,
  extraText,
  size = 'md',
  required,
  disabled,
  ...props
}: FormTextareaRawProps) {
  const extraTextId = extraText ? `${id}-extra` : undefined

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} size={size} required={required} disabled={disabled}>
        {label}
      </Label>
      <Textarea
        id={id}
        size={size}
        required={required}
        variant={validateStatus}
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

export function FormTextarea({
  helpText,
  id,
  validateStatus,
  size,
  ...props
}: FormTextareaRawProps) {
  const helpTextId = helpText ? `${id}-helper` : undefined

  return (
    <FormTextareaRaw
      id={id}
      size={size}
      validateStatus={validateStatus}
      helpText={
        validateStatus === 'error' ? (
          <ErrorText id={helpTextId} size={size} showIcon>
            {helpText}
          </ErrorText>
        ) : (
          <ExtraText id={helpTextId} size={size}>
            {helpText}
          </ExtraText>
        )
      }
      {...props}
    />
  )
}
