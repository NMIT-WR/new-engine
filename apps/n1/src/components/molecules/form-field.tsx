import { Input } from '@new-engine/ui/atoms/input'
import { Label } from '@new-engine/ui/atoms/label'
import type { ChangeEvent, InputHTMLAttributes } from 'react'

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
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
}

/**
 * Reusable form field combining Label + Input + error message
 *
 * Eliminuje opakování pattern:
 * - Label s required prop
 * - Input s peer validation classes
 * - Error message s peer-user-invalid visibility
 *
 * Použití:
 * ```tsx
 * <FormField
 *   id="email"
 *   name="email"
 *   type="email"
 *   label="E-mailová adresa"
 *   required
 *   errorMessage="Zadejte platnou e-mailovou adresu"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   disabled={isPending}
 * />
 * ```
 */
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
