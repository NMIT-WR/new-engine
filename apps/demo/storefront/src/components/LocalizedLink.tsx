"use client"

import * as React from "react"
import { LinkProps } from "next/link"
import { useCountryCode } from "hooks/country-code"
import { Link, LinkOwnProps } from "@/components/Link"
import { ButtonLink, ButtonOwnProps } from "@/components/Button"

export const LocalizedLink = <RouteInferType,>({
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"a"> &
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
  Omit<LinkProps<RouteInferType>, "passHref"> & {
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
