import { type HTMLAttributes } from "react";
import { type VariantProps } from "tailwind-variants";
import { tv } from "../utils";

const extraTextVariants = tv({
  base: ["text-helper-text"],
  variants: {
    size: {
      sm: "text-helper-sm",
      md: "text-helper-md",
      lg: "text-helper-lg",
      current: "",
    },
  },
  defaultVariants: {
    size: "current",
  },
});

export interface ExtraTextProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof extraTextVariants> {
  children: React.ReactNode;
  className?: string;
}

export function ExtraText({
  children,
  size,
  className,
  ...props
}: ExtraTextProps) {
  return (
    <span
      className={extraTextVariants({
        size,
        className,
      })}
      {...props}
    >
      {children}
    </span>
  );
}
