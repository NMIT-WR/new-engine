import { type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { type VariantProps } from "tailwind-variants";
import { Icon, type IconType } from "./icon";
import { tv } from "../utils";

const buttonVariants = tv({
  base: [
    "relative",
    "inline-flex items-center justify-center cursor-pointer",
    "font-medium",
    "transition-all duration-200",
    "focus:outline-none",
    "focus-visible:ring-3 focus-visible:ring-offset-2",
    "disabled:text-btn-text-disabled disabled:pointer-events-none",
  ],
  variants: {
    variant: {
      primary: "focus:ring-btn-ring-primary",
      secondary: "focus:ring-btn-ring-secondary",
      tertiary: "focus:ring-btn-ring-tertiary",
      danger: "focus:ring-btn-ring-danger",
      warning: "focus:ring-btn-ring-warning",
    },
    theme: {
      solid: "text-btn-text-solid disabled:bg-btn-disabled",
      light: "text-btn-text-light disabled:bg-btn-disabled",
      borderless:
        "hover:bg-btn-borderless-hover active:bg-btn-borderless-active",
      outlined:
        "border text-btn-text-outlined disabled:border-btn-border-disabled",
    },
    uppercase: {
      true: "uppercase",
    },
    size: {
      sm: "p-btn-sm text-btn-sm rounded-btn-sm gap-btn-sm",
      md: "p-btn-md text-btn-md rounded-btn-md gap-btn-md",
      lg: "p-btn-lg text-btn-lg rounded-btn-lg gap-btn-lg",
    },

    block: {
      true: "w-full",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      theme: "solid",
      className: [
        "bg-btn-primary",
        "hover:bg-btn-primary-hover",
        "active:bg-btn-primary-active",
      ],
    },
    {
      variant: "secondary",
      theme: "solid",
      className: [
        "bg-btn-secondary",
        "hover:bg-btn-secondary-hover",
        "active:bg-btn-secondary-active",
      ],
    },
    {
      variant: "tertiary",
      theme: "solid",
      className: [
        "bg-btn-tertiary",
        "hover:bg-btn-tertiary-hover",
        "active:bg-btn-tertiary-active",
      ],
    },
    {
      variant: "warning",
      theme: "solid",
      className: [
        "bg-btn-warning",
        "hover:bg-btn-warning-hover",
        "active:bg-btn-warning-active",
      ],
    },
    {
      variant: "danger",
      theme: "solid",
      className: [
        "bg-btn-danger",
        "hover:bg-btn-danger-hover",
        "active:bg-btn-danger-active",
      ],
    },
    {
      variant: "primary",
      theme: "light",
      className: [
        "bg-btn-primary-light",
        "hover:bg-btn-primary-light-hover",
        "active:bg-btn-primary-light-active",
      ],
    },
    {
      variant: "secondary",
      theme: "light",
      className: [
        "bg-btn-secondary-light",
        "hover:bg-btn-secondary-light-hover",
        "active:bg-btn-secondary-light-active",
      ],
    },
    {
      variant: "tertiary",
      theme: "light",
      className: [
        "bg-btn-tertiary-light",
        "hover:bg-btn-tertiary-light-hover",
        "active:bg-btn-tertiary-light-active",
      ],
    },
    {
      variant: "warning",
      theme: "light",
      className: [
        "bg-btn-warning-light",
        "hover:bg-btn-warning-light-hover",
        "active:bg-btn-warning-light-active",
      ],
    },
    {
      variant: "danger",
      theme: "light",
      className: [
        "bg-btn-danger-light",
        "hover:bg-btn-danger-light-hover",
        "active:bg-btn-danger-light-active",
      ],
    },
    {
      variant: "primary",
      theme: "outlined",
      className: [
        "border-btn-border-primary",
        "hover:bg-btn-outlined-primary-hover",
        "active:bg-btn-outlined-primary-active",
      ],
    },
    {
      variant: "secondary",
      theme: "outlined",
      className: [
        "border-btn-border-secondary",
        "hover:bg-btn-outlined-secondary-hover",
        "active:bg-btn-outlined-secondary-active",
      ],
    },
    {
      variant: "tertiary",
      theme: "outlined",
      className: [
        "border-btn-border-tertiary",
        "hover:bg-btn-outlined-tertiary-hover",
        "active:bg-btn-outlined-tertiary-active",
      ],
    },
    {
      variant: "warning",
      theme: "outlined",
      className: [
        "border-btn-border-warning",
        "hover:bg-btn-outlined-warning-hover",
        "active:bg-btn-outlined-warning-active",
      ],
    },
    {
      variant: "danger",
      theme: "outlined",
      className: [
        "border-btn-border-danger",
        "hover:bg-btn-outlined-danger-hover",
        "active:bg-btn-outlined-danger-active",
      ],
    },
    {
      variant: "primary",
      theme: "borderless",
      className: ["text-btn-primary"],
    },
    {
      variant: "secondary",
      theme: "borderless",
      className: ["text-btn-secondary"],
    },
    {
      variant: "tertiary",
      theme: "borderless",
      className: ["text-btn-tertiary"],
    },
    {
      variant: "warning",
      theme: "borderless",
      className: ["text-btn-warning"],
    },
    {
      variant: "danger",
      theme: "borderless",
      className: ["text-btn-danger"],
    },
    {
      theme: "outlined",
      size: "sm",
      className: "border-(length:--border-btn-width-sm)",
    },
    {
      theme: "outlined",
      size: "md",
      className: "border-(length:--border-btn-width-md)",
    },
    {
      theme: "outlined",
      size: "lg",
      className: "border-(length:--border-btn-width-lg)",
    },
  ],
  defaultVariants: {
    variant: "primary",
    theme: "solid",
    size: "md",
    light: false,
  },
});

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof buttonVariants> {
  icon?: IconType;
  iconPosition?: "left" | "right";
  uppercase?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children?: ReactNode;
}

export function Button({
  variant,
  theme,
  size,
  block,
  isLoading,
  loadingText,
  icon,
  iconPosition = "left",
  uppercase = false,
  children,
  className,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <button
      className={buttonVariants({
        variant,
        theme,
        size,
        block,
        className,
      })}
      disabled={isLoading}
      {...props}
    >
      {icon && iconPosition === "left" && <Icon icon={icon} size={size} />}
      {children}
      {icon && iconPosition === "right" && <Icon icon={icon} size={size} />}
    </button>
  );
}

Button.displayName = "Button";
