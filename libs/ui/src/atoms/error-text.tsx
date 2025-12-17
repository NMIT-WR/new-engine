import type { HTMLAttributes, ReactNode, Ref } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "../utils"
import { Icon } from "./icon"

const errorVariants = tv({
  base: ["text-error-text-fg", "flex items-center gap-error-text-icon-gap"],
  variants: {
    size: {
      sm: "text-error-text-sm",
      md: "text-error-text-md",
      lg: "text-error-text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface ErrorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  ref?: Ref<HTMLDivElement>
  showIcon?: boolean
  children: ReactNode
}

export function ErrorText({
  className,
  showIcon,
  children,
  ref,
  size,
  ...props
}: ErrorProps) {
  return (
    <div
      className={errorVariants({
        size,
        className,
      })}
      ref={ref}
      {...props}
    >
      {showIcon && <Icon icon="token-icon-error" />}
      <span>{children}</span>
    </div>
  )
}
