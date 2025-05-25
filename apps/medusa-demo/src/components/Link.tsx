import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import type * as React from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export type LinkOwnProps = {
  variant?: 'underline' | 'hover:underline' | 'unstyled'
}

export const getLinkClassNames = ({ variant }: LinkOwnProps): string =>
  twJoin(
    variant !== 'unstyled' && 'transition-colors',
    (variant === 'underline' || variant === 'hover:underline') &&
      'border-current border-b pb-0.5 md:pb-1',
    variant === 'hover:underline' &&
      'border-transparent transition-colors hover:border-current',
    variant === 'underline' && 'hover:border-transparent'
  )

export const Link = <RouteInferType,>({
  variant = 'unstyled',
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<'a'> &
  NextLinkProps<RouteInferType> &
  LinkOwnProps) => (
  <NextLink
    {...rest}
    className={twMerge(getLinkClassNames({ variant }), className)}
  >
    <>{children}</>
  </NextLink>
)

export const Anchor: React.FC<
  React.ComponentPropsWithoutRef<'a'> & LinkOwnProps
> = ({ variant = 'unstyled', className, children, ...rest }) => (
  <a {...rest} className={twMerge(getLinkClassNames({ variant }), className)}>
    {children}
  </a>
)
