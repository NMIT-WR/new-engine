import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const errorVariants = tv(
  {
    base: ["text-error-text",  "flex items-start gap-1"],
    variants: {
      showIcon: {
        true: "",
        false: "",
      },
      size: {
        sm: "text-error-sm",
        md: "text-error-md",
        lg: "text-error-lg",
      },
    },
    defaultVariants: {
      showIcon: true,
      size: "md",
    },
  }
);

export interface ErrorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  showIcon?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  inputSize?: "sm" | "md" | "lg";
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
      className={(
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
