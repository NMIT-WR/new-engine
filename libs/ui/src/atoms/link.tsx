import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

export interface BaseLinkProps {
  children: ReactNode
  external?: boolean
  className?: string
}

export interface NativeLinkProps
  extends BaseLinkProps,
    Omit<ComponentPropsWithoutRef<'a'>, keyof BaseLinkProps> {
  as?: never
}

export type LinkProps<T extends ElementType = 'a'> = BaseLinkProps &
  Omit<ComponentPropsWithoutRef<T>, keyof BaseLinkProps> & {
    as?: T
  }

export function Link<T extends ElementType = 'a'>({
  as,
  children,
  external = false,
  className,
  ...props
}: LinkProps<T>) {
  const Component = (as || 'a') as ElementType

  const externalProps =
    external && !as ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Component {...externalProps} {...props}>
      {children}
    </Component>
  )
}
