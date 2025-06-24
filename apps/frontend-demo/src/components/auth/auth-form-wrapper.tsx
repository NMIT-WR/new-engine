import Link from 'next/link'
import * as React from 'react'

interface AuthFormWrapperProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footerText: string
  footerLinkText: string
  footerLinkHref: string
}

export function AuthFormWrapper({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthFormWrapperProps) {
  return (
    <div className="rounded-auth-card bg-auth-card-bg p-auth-card-padding shadow-auth-card">
      <div className="mb-auth-header-margin text-center">
        <h1 className="mb-auth-title-margin font-auth-title text-auth-title-size">
          {title}
        </h1>
        <p className="text-md">{subtitle}</p>
      </div>

      {children}

      <div className="mt-auth-footer-margin text-center text-auth-footer">
        {footerText}{' '}
        <Link
          href={footerLinkHref}
          className="text-auth-link hover:text-auth-link-hover"
        >
          {footerLinkText}
        </Link>
      </div>
    </div>
  )
}
