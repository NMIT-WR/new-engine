import {type LabelHTMLAttributes} from "react";
import { type VariantProps } from "tailwind-variants";
import { tv } from "../utils";

const labelVariants = tv(
  {
    base: ["block", "text-label-text", "font-label", "mb-label"],
    variants: {
      size: {
        sm: "text-label-sm",
        md: "text-label-md",
        lg: "text-label-lg",
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

export function Label({
  inputSize,
  size = inputSize,
  disabled,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={
        labelVariants({
          size,
          disabled,
        })
    }
      {...props}
    >
      {children}
      {required && (
        <span className="text-label-required ml-label">*</span>
      )}
    
    </label>
  );
}


