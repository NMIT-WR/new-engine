import {type LabelHTMLAttributes} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const labelVariants = cva(
  ["block", "text-label-text", "font-label", "mb-label"],
  {
    variants: {
      size: {
        sm: "text-label-s",
        md: "text-label-m",
        lg: "text-label-l",
      },
      disabled: {
        true: "text-label-disabled",
      },
    },
    defaultVariants: {
      size: "md",
      disabled: false,
    },
  }
);

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  htmlFor?: string;
  inputSize?: "sm" | "md" | "lg";
}

export function InputLabel({
  inputSize,
  size = inputSize,
  disabled,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        labelVariants({
          size,
          disabled,
        })
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-label-required ml-label">*</span>
      )}
    
    </label>
  );
}

