import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const labelVariants = cva(
  ["block", "text-label-text", "font-label", "mb-label"],
  {
    variants: {
      size: {
        small: "text-label-s",
        default: "text-label-m",
        large: "text-label-l",
      },
      disabled: {
        true: "text-label-disabled",
      },
    },
    defaultVariants: {
      size: "default",
      disabled: false,
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
  ref?: React.Ref<HTMLLabelElement>;
  htmlFor?: string;
  inputSize?: "small" | "default" | "large";
}

function Label({
  className,
  inputSize,
  size = inputSize,
  disabled,
  required,
  optional,
  children,
  ref,
  ...props
}: LabelProps) {
  return (
    <label
      ref={ref}
      className={cn(
        labelVariants({
          size,
          disabled,
          className,
        })
      )}
      {...props}
    >
      {children}
      {required && !optional && (
        <span className="text-label-required ml-label">*</span>
      )}
      {optional && (
        <span className="text-label-optional ml-label">(optional)</span>
      )}
    </label>
  );
}

export { Label, labelVariants };
