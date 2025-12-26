import type { HTMLAttributes, ReactNode, Ref } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "../utils"
import { Icon } from "./icon"

const statusTextVariants = tv({
  base: ["flex items-center gap-status-text-icon-gap"],
  variants: {
    status: {
      error: "text-status-text-fg-error",
      success: "text-status-text-fg-success",
      warning: "text-status-text-fg-warning",
      default: "text-status-text-fg-default",
    },
    size: {
      sm: "text-status-text-sm",
      md: "text-status-text-md",
      lg: "text-status-text-lg",
    },
  },
  defaultVariants: {
    status: "default",
    size: "md",
  },
})

const ICON_MAP = {
  error: "token-icon-error",
  success: "token-icon-success",
  warning: "token-icon-warning",
  default: undefined,
} as const

export interface StatusTextProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusTextVariants> {
  ref?: Ref<HTMLDivElement>
  showIcon?: boolean
  children: ReactNode
}

export function StatusText({
  className,
  showIcon = false,
  status = "default",
  size = "md",
  children,
  ref,
  ...props
}: StatusTextProps) {
  const icon = ICON_MAP[status ?? "default"]

  return (
    <div
      className={statusTextVariants({
        status,
        size,
        className,
      })}
      ref={ref}
      {...props}
    >
      {showIcon && icon && <Icon icon={icon} />}
      <span>{children}</span>
    </div>
  )
}
