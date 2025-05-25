'use client'

import { ButtonLink, type ButtonOwnProps } from '@/components/Button'
import { Link, type LinkOwnProps } from '@/components/Link'
import { useCountryCode } from 'hooks/country-code'
import type { LinkProps } from 'next/link'
import type * as React from 'react'

export const LocalizedLink = <RouteInferType,>({
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'a'> &
  LinkProps<RouteInferType> &
  LinkOwnProps) => {
  const countryCode = useCountryCode()

  return (
    <Link {...props} href={countryCode ? `/${countryCode}${href}` : href}>
      {children}
    </Link>
  )
}

export const LocalizedButtonLink = <RouteInferType,>({
  children,
  href,
  ...props
}: ButtonOwnProps &
  Omit<LinkProps<RouteInferType>, 'passHref'> & {
    className?: string
    children?: React.ReactNode
  }) => {
  const countryCode = useCountryCode()

  return (
    <ButtonLink {...props} href={countryCode ? `/${countryCode}${href}` : href}>
      {children}
    </ButtonLink>
  )
}
