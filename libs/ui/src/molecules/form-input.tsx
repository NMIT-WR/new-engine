import { type ReactNode } from "react";
import { Label } from "../atoms/label";
import { Input, type InputProps } from "../atoms/input";
import { Error } from "../atoms/error";
import { ExtraText } from "../atoms/extra-text";

type ValidateStatus = "default" | "error" | "success" | "warning";

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
  validateStatus = "default",
  helpText,
  extraText,
  size = "md", 
  required, 
  disabled,
  ...props
}: FormInputRawProps) {

  const helpTextId = helpText ? `${id}-helper` : undefined;
  const extraTextId = extraText ? `${id}-extra` : undefined;
  
  return (
    <div className="flex flex-col">
      <Label
        htmlFor={id}
        size={size}
        required={required}
        disabled={disabled}
      >
        {label}
      </Label>
      <Input
        id={id} 
        size={size}
        required={required}
        variant={validateStatus}
        {...props} 
      />
      
      {/* Status message */}
      {helpText && (
        validateStatus === "error" ? (
          <Error
            id={helpTextId}
            inputSize={size}
            className="mt-1"
          >
            {helpText}
          </Error>
        ) : (
          <ExtraText
            id={helpTextId}
            size={size}
            className="mt-1"
            variant={validateStatus}
          >
            {helpText}
          </ExtraText>
        )
      )}

      {extraText && (
        <ExtraText
          id={extraTextId}
          size={size}
          className="mt-1"
        >
          {extraText}
        </ExtraText>
      )}
    </div>
  );
}


export function FormInput(props: FormInputRawProps) {
 
    return <FormInputRaw {...props} />;
  
}