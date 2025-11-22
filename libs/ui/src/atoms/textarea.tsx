import type { Ref, TextareaHTMLAttributes } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "../utils"

const textareaVariants = tv({
  base: [
    "block w-full",
    "bg-textarea-bg",
    "text-textarea-fg",
    "placeholder:text-textarea-placeholder",
    "border-(length:--border-textarea-width) border-textarea-border",
    "rounded-textarea",
    "transition-all duration-200",
    "hover:border-textarea-border-hover hover:bg-textarea-bg-hover",
    "focus:border-textarea-border-focus focus:bg-textarea-bg-focus focus:outline-none",
    "focus-visible:ring",
    "focus-visible:ring-textarea-ring",
    "disabled:pointer-events-none disabled:border-textarea-border-disabled disabled:bg-textarea-bg-disabled disabled:text-textarea-fg-disabled",
  ],
  variants: {
    variant: {
      default: "",
      error: [
        "border-textarea-border-danger",
        "hover:border-textarea-border-danger-hover",
        "focus:border-textarea-border-danger-focus",
        "placeholder:text-textarea-placeholder-danger",
      ],
      success: [
        "border-textarea-border-success",
        "hover:border-textarea-border-success-hover",
        "focus:border-textarea-border-success-focus",
      ],
      warning: [
        "border-textarea-border-warning",
        "hover:border-textarea-border-warning-hover",
        "focus:border-textarea-border-warning-focus",
      ],
      borderless: [
        "border-transparent",
        "bg-textarea-bg-borderless",
        "hover:bg-textarea-bg-borderless-hover",
        "focus:bg-textarea-bg-borderless-focus",
      ],
    },
    size: {
      sm: "p-textarea-sm text-textarea-sm",
      md: "p-textarea-md text-textarea-md",
      lg: "p-textarea-lg text-textarea-lg",
    },
    resize: {
      none: "resize-none",
      y: "resize-y",
      x: "resize-x",
      both: "resize",
      auto: "field-sizing-content resize-none",
    },
    readonly: {
      true: "cursor-default border-textarea-border-disabled bg-textarea-bg-disabled text-textarea-fg-disabled opacity-90",
    },
  },
  defaultVariants: {
    size: "md",
    resize: "y",
    variant: "default",
  },
})

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({
  size,
  resize,
  variant,
  readonly,
  className,
  ref,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={textareaVariants({
        size,
        resize,
        variant,
        readonly,
        className,
      })}
      readOnly={readonly}
      ref={ref}
      {...props}
    />
  )
}

Textarea.displayName = "Textarea"
