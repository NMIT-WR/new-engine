"use client"

import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import * as ReactAria from "react-aria-components"
import Link, { LinkProps } from "next/link"
import { Icon, IconNames } from "@/components/Icon"

export type ButtonOwnProps = {
  isFullWidth?: boolean
  iconName?: IconNames
  iconPosition?: "start" | "end"
  isVisuallyDisabled?: boolean
  isLoading?: boolean
  loadingText?: string
  size?: "sm" | "md"
  spinnerPosition?: "start" | "end"
  variant?: "ghost" | "outline" | "solid" | "link" | "unstyled"
}

export const getButtonClassNames = ({
  isFullWidth,
  iconName,
  iconPosition,
  isVisuallyDisabled,
  isLoading,
  loadingText,
  size,
  spinnerPosition,
  variant = "solid",
}: ButtonOwnProps): string => {
  const variantClasses = {
    ghost: "text-black h-auto disabled:text-grayscale-200",
    unstyled: "text-black h-auto disabled:text-grayscale-200",
    outline:
      "text-black hover:text-grayscale-500 hover:border-grayscale-500 border border-black disabled:text-grayscale-200 disabled:border-grayscale-200",
    solid:
      "bg-black hover:bg-grayscale-500 text-white disabled:bg-grayscale-200",
    link: "text-black h-auto border-b border-current px-0 rounded-none disabled:text-grayscale-200 hover:border-transparent",
  }

  const visuallyDisabledClasses = isVisuallyDisabled
    ? {
        ghost: "pointer-events-none text-grayscale-200",
        link: "pointer-events-none text-grayscale-200",
        unstyled: "pointer-events-none text-grayscale-200",
        outline: "pointer-events-none border-grayscale-200 text-grayscale-200",
        solid: "pointer-events-none bg-grayscale-200",
      }[variant]
    : ""

  const flexDirection =
    iconPosition === "end" || spinnerPosition === "end"
      ? "flex-row-reverse"
      : ""
  const hasGap = (isLoading && loadingText) || iconName
  const sizeClasses =
    size === "sm" ? "px-4 h-8 text-xs" : size === "md" ? "px-6 h-12" : ""

  return twJoin(
    "inline-flex items-center focus-visible:outline-none rounded-xs justify-center transition-colors disabled:pointer-events-none",
    isFullWidth && "w-full",
    flexDirection,
    hasGap && "gap-2",
    sizeClasses,
    variantClasses[variant],
    visuallyDisabledClasses
  )
}

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  ButtonOwnProps &
  ReactAria.ButtonProps

export const Button: React.FC<ButtonProps> = ({
  isFullWidth,
  isVisuallyDisabled,
  iconName,
  iconPosition = "start",
  isLoading,
  loadingText,
  size = "md",
  spinnerPosition = "start",
  variant = "solid",
  type = "button",
  className,
  children,
  ...rest
}) => (
  <ReactAria.Button
    {...rest}
    type={type}
    isPending={isLoading}
    className={twMerge(
      getButtonClassNames({
        isFullWidth,
        isVisuallyDisabled,
        iconName,
        iconPosition,
        isLoading,
        loadingText,
        size,
        spinnerPosition,
        variant,
      }),
      className
    )}
  >
    {Boolean(isLoading) && <Icon name="loader" className="animate-spin" />}
    {iconName && !Boolean(isLoading) && <Icon name={iconName} />}
    {Boolean(isLoading)
      ? Boolean(loadingText)
        ? loadingText
        : null
      : children}
  </ReactAria.Button>
)

export const ButtonAnchor: React.FC<
  React.ComponentPropsWithoutRef<"a"> & ButtonOwnProps
> = ({
  isFullWidth,
  isVisuallyDisabled,
  iconName,
  iconPosition = "start",
  isLoading,
  loadingText,
  size = "md",
  spinnerPosition = "start",
  variant = "solid",
  className,
  children,
  ...rest
}) => (
  <a
    {...rest}
    className={twMerge(
      getButtonClassNames({
        isFullWidth,
        isVisuallyDisabled,
        iconName,
        iconPosition,
        isLoading,
        loadingText,
        size,
        spinnerPosition,
        variant,
      }),
      className
    )}
  >
    {Boolean(isLoading) && <Icon name="loader" className="animate-spin" />}
    {iconName && !Boolean(isLoading) && <Icon name={iconName} />}
    {Boolean(isLoading)
      ? Boolean(loadingText)
        ? loadingText
        : null
      : children}
  </a>
)

export const ButtonLink: React.FC<
  Omit<LinkProps, "passHref"> &
    ButtonOwnProps & {
      className?: string
      children?: React.ReactNode
    }
> = ({
  isFullWidth,
  isVisuallyDisabled,
  iconName,
  iconPosition = "start",
  isLoading,
  loadingText,
  size = "md",
  spinnerPosition = "start",
  variant = "solid",
  className,
  children,
  ...rest
}) => (
  <Link
    {...rest}
    className={twMerge(
      getButtonClassNames({
        isFullWidth,
        isVisuallyDisabled,
        iconName,
        iconPosition,
        isLoading,
        loadingText,
        size,
        spinnerPosition,
        variant,
      }),
      className
    )}
  >
    {Boolean(isLoading) && <Icon name="loader" className="animate-spin" />}
    {iconName && !Boolean(isLoading) && <Icon name={iconName} />}
    {Boolean(isLoading)
      ? Boolean(loadingText)
        ? loadingText
        : null
      : children}
  </Link>
)
