'use client'

import { Icon, type IconNames } from '@/components/Icon'
import Link, { type LinkProps } from 'next/link'
import type * as React from 'react'
import type { ReactNode } from 'react'
import type * as ReactAria from 'react-aria-components'
import { twJoin, twMerge } from 'tailwind-merge'

export type ButtonOwnProps = {
  isFullWidth?: boolean
  iconName?: IconNames
  iconPosition?: 'start' | 'end'
  isVisuallyDisabled?: boolean
  isLoading?: boolean
  loadingText?: string
  size?: 'sm' | 'md'
  spinnerPosition?: 'start' | 'end'
  variant?: 'ghost' | 'outline' | 'solid' | 'link' | 'unstyled'
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
  variant = 'solid',
}: ButtonOwnProps): string => {
  const variantClasses = {
    ghost: 'text-black h-auto disabled:text-grayscale-200',
    unstyled: 'text-black h-auto disabled:text-grayscale-200',
    outline:
      'text-black hover:text-grayscale-500 hover:border-grayscale-500 border border-black disabled:text-grayscale-200 disabled:border-grayscale-200',
    solid:
      'bg-black hover:bg-grayscale-500 text-white disabled:bg-grayscale-200',
    link: 'text-black h-auto border-b border-current px-0 rounded-none disabled:text-grayscale-200 hover:border-transparent',
  }

  const visuallyDisabledClasses = isVisuallyDisabled
    ? {
        ghost: 'pointer-events-none text-grayscale-200',
        link: 'pointer-events-none text-grayscale-200',
        unstyled: 'pointer-events-none text-grayscale-200',
        outline: 'pointer-events-none border-grayscale-200 text-grayscale-200',
        solid: 'pointer-events-none bg-grayscale-200',
      }[variant]
    : ''

  const flexDirection =
    iconPosition === 'end' || spinnerPosition === 'end'
      ? 'flex-row-reverse'
      : ''
  const hasGap = (isLoading && loadingText) || iconName
  const sizeClasses =
    size === 'sm' ? 'px-4 h-8 text-xs' : size === 'md' ? 'px-6 h-12' : ''

  return twJoin(
    'inline-flex items-center justify-center rounded-xs transition-colors focus-visible:outline-none disabled:pointer-events-none',
    isFullWidth && 'w-full',
    flexDirection,
    hasGap && 'gap-2',
    sizeClasses,
    variantClasses[variant],
    visuallyDisabledClasses
  )
}

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  ButtonOwnProps &
  ReactAria.ButtonProps

export function Button({
  isFullWidth,
  isVisuallyDisabled,
  iconName,
  iconPosition = 'start',
  isLoading,
  loadingText,
  size = 'md',
  spinnerPosition = 'start',
  variant = 'solid',
  type = 'button',
  className,
  children,
  // eslint-disable-next-line
  onPress,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={isVisuallyDisabled}
      {...rest}
      type={type}
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
          : ''
        : children}
    </button>
  )
}

export const ButtonAnchor: React.FC<
  React.ComponentPropsWithoutRef<'a'> & ButtonOwnProps
> = ({
  isFullWidth,
  isVisuallyDisabled,
  iconName,
  iconPosition = 'start',
  isLoading,
  loadingText,
  size = 'md',
  spinnerPosition = 'start',
  variant = 'solid',
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

type ButtonLinkProps = Omit<LinkProps, 'passHref'> &
  ButtonOwnProps & {
    className?: string
    children?: ReactNode
  }

export const ButtonLink = ({
  isFullWidth,
  isVisuallyDisabled,
  iconName,
  iconPosition = 'start',
  isLoading,
  loadingText,
  size = 'md',
  spinnerPosition = 'start',
  variant = 'solid',
  className,
  children,
  ...rest
}: ButtonLinkProps) => (
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
    {isLoading ? <>{loadingText || null}</> : <>{children}</>}
  </Link>
)
