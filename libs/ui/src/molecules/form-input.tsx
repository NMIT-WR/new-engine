import type { ReactNode } from 'react';
import { Error } from '../atoms/error';
import { ExtraText } from '../atoms/extra-text';
import { Input, type InputProps } from '../atoms/input';
import { Label } from '../atoms/label';

type ValidateStatus = 'default' | 'error' | 'success' | 'warning';

interface FormInputRawProps extends InputProps {
  id: string;
  label: ReactNode;
  validateStatus?: ValidateStatus;
  helpText?: ReactNode;
  extraText?: ReactNode;
}

export function FormInputRaw({
  id,
  label,
  validateStatus = 'default',
  helpText,
  extraText,
  size = 'md',
  required,
  disabled,
  ...props
}: FormInputRawProps) {
  const extraTextId = extraText ? `${id}-extra` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} size={size} required={required} disabled={disabled}>
        {label}
      </Label>
      <Input
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
  );
}

export function FormInput({
  helpText,
  id,
  validateStatus,
  size,
  ...props
}: FormInputRawProps) {
  const helpTextId = helpText ? `${id}-helper` : undefined;

  return (
    <FormInputRaw
      id={id}
      size={size}
      validateStatus={validateStatus}
      helpText={
        validateStatus === 'error' ? (
          <Error id={helpTextId} size={size} showIcon>
            {helpText}
          </Error>
        ) : (
          <ExtraText id={helpTextId} size={size}>
            {helpText}
          </ExtraText>
        )
      }
      {...props}
    />
  );
}
