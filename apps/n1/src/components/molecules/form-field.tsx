import { Input } from '@techsio/ui-kit/atoms/input'
import { Label } from '@techsio/ui-kit/atoms/label'
import type { ChangeEvent, InputHTMLAttributes } from 'react'

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  id: string
  label: string
  name: string
  type: string
  errorMessage?: string
  required?: boolean
  disabled?: boolean
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  containerClassName?: string
  //isTouched?: boolean
}

export const FormField = ({
  id,
  label,
  name,
  type,
  errorMessage,
  required = false,
  disabled = false,
  value,
  onChange,
  className = '',
  containerClassName = '',
  //isTouched = false,
  ...inputProps
}: FormFieldProps) => {
  return (
    <div className={`flex flex-col gap-50 ${containerClassName}`}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`peer user-invalid:border-danger user-valid:border-success focus-visible:user-invalid:ring-danger focus-visible:user-valid:ring-success ${className}`}
        {...inputProps}
      />
      {errorMessage && (
        <p className="invisible font-medium text-2xs text-danger peer-user-invalid:visible">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
