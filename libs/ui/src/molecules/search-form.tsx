import { type FormHTMLAttributes, type ReactNode, type Ref, useId } from "react"
import type { VariantProps } from "tailwind-variants"
import { Button, type ButtonProps } from "../atoms/button"
import { Icon } from "../atoms/icon"
import { Input, type InputProps } from "../atoms/input"
import { Label } from "../atoms/label"
import { tv } from "../utils"

// icon size looks too small if it is the same as the text
const iconSizeMap = {
  sm: "lg",
  md: "xl",
  lg: "2xl",
} as const

const formVariants = tv({
  base: ["relative grid"],
  variants: {
    size: {
      sm: "gap-search-form-sm",
      md: "gap-search-form-md",
      lg: "gap-search-form-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const inputWrapperVariants = tv({
  base: ["relative grid overflow-hidden rounded-md"],
  variants: {
    size: {
      sm: "gap-search-form-sm",
      md: "gap-search-form-md",
      lg: "gap-search-form-lg",
    },
  },
})

// make option to style button
const buttonVariants = tv({
  base: [
    "absolute",
    "place-self-center justify-self-end",
    "h-full rounded-none p-200",
  ],
})

export interface SearchFormProps
  extends VariantProps<typeof formVariants>,
    Omit<FormHTMLAttributes<HTMLFormElement>, "size"> {
  inputProps?: Omit<InputProps, "size">
  buttonProps?: Omit<ButtonProps, "size">
  label?: ReactNode
  buttonText?: ReactNode
  buttonIcon?: boolean
  placeholder?: string
  ref?: Ref<HTMLFormElement>
  searchId?: string
}

export function SearchForm({
  inputProps,
  buttonProps,
  size = "md",
  buttonText,
  buttonIcon = false,
  placeholder = "Search...",
  label,
  className,
  ref,
  searchId,
  ...props
}: SearchFormProps) {
  // Generate unique ID for input if not provided
  const fallbackId = useId()
  const id = searchId || `search-${fallbackId}`

  const withButton = !!buttonText || buttonIcon
  const iconSize = iconSizeMap[size] || "lg"

  return (
    <search>
      <form
        className={formVariants({ size, className })}
        onSubmit={props.onSubmit}
        ref={ref}
        {...props}
      >
        {label && (
          <Label htmlFor={id} size={size}>
            {label}
          </Label>
        )}
        <div className={inputWrapperVariants({ size })}>
          <Input
            aria-label={label ? undefined : "Search"}
            id={id}
            placeholder={placeholder}
            size={size}
            type="search"
            withButtonInside={withButton && "right"}
            {...inputProps}
          />
          {withButton && (
            <Button
              aria-label={buttonText ? undefined : "Search"}
              block={false}
              className={buttonVariants({
                className: buttonText ? "" : "aspect-square",
              })}
              size={size}
              theme={buttonProps?.theme || "borderless"}
              type="submit"
              {...buttonProps}
            >
              {buttonText}
              {buttonIcon && (
                <Icon icon={"token-icon-search"} size={iconSize} />
              )}
            </Button>
          )}
        </div>
      </form>
    </search>
  )
}

SearchForm.displayName = "SearchForm"
