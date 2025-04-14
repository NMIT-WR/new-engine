import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const errorVariants = cva(
  ["text-error-text", "mt-error", "flex items-start gap-1"],
  {
    variants: {
      showIcon: {
        true: "",
        false: "",
      },
      size: {
        small: "text-error-s",
        default: "text-error-m",
        large: "text-error-l",
      },
    },
    defaultVariants: {
      showIcon: true,
      size: "default",
    },
  }
);

export interface ErrorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  showIcon?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  inputSize?: "small" | "default" | "large";
}

function Error({
  className,
  showIcon,
  children,
  ref,
  inputSize,
  ...props
}: ErrorProps) {
  if (!children) return null;

  return (
    <div
      ref={ref}
      className={cn(
        errorVariants({
          showIcon,
          size: inputSize,
          className,
        })
      )}
      {...props}
    >
      {showIcon && (
        <span className="icon-[mdi-light--alert-circle] w-4 h-4 flex-shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
}

export { Error, errorVariants };
