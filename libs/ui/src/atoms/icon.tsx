import type { HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "../utils";

export type IconType = `token-icon-${string}` | `icon-[${string}]`;

const iconVariants = tv({
  base: ["inline-block flex-shrink-0 align-middle leading-none"],
  variants: {
    size: {
      current: "",
      xs: "text-icon-xs",
      sm: "text-icon-sm",
      md: "text-icon-md",
      lg: "text-icon-lg",
      xl: "text-icon-xl",
    },
    color: {
      current: "text-current",
      primary: "text-primary",
      secondary: "text-secondary",
      danger: "text-danger",
      success: "text-success",
      warning: "text-warning",
    },
  },
  defaultVariants: {
    size: "current",
    color: "current",
  },
});

export interface IconProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof iconVariants> {
  icon: IconType;
  className?: string;
}

export function Icon({
  icon,
  size,
  color,
  className = "",
  ...props
}: IconProps) {
  return (
    <span
      className={`${iconVariants({ size, color, className })} ${icon}`}
      aria-hidden="true"
      {...props}
    />
  );
}
