import { type HTMLAttributes } from "react";
import { type VariantProps } from "class-variance-authority";
import { tv } from "tailwind-variants";
import { cn } from "../utils";

const extraTextVariants = tv({
  base: ["text-helper-text"],
  variants: {
    size: {
      sm: "text-helper-sm",
      md: "text-helper-md",
      lg: "text-helper-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ExtraTextProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof extraTextVariants> {
  children?: React.ReactNode;
}

export function ExtraText({ children, size, ...props }: ExtraTextProps) {
  if (!children) return null;

  return (
    <span
      className={cn(
        extraTextVariants({
          size,
        })
      )}
      {...props}
    >
      {children}
    </span>
  );
}
