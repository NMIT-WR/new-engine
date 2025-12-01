'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AccountMenu } from './_components/account-menu'
import { AccountProvider } from './context/account-context'

export default function AccountLayout({
  children,
}: { children: React.ReactNode }) {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, isTokenExpired } = useAuth()
  const [showExpiredMessage, setShowExpiredMessage] = useState(false)

  // Handle session expiration
  useEffect(() => {
    if (isTokenExpired) {
      setShowExpiredMessage(true)
      const timeout = setTimeout(() => {
        router.push('/prihlaseni')
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [isTokenExpired, router])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isTokenExpired) {
      router.push('/prihlaseni')
    }
  }, [isAuthenticated, isLoading, isTokenExpired, router])

  // Session expired - full page
  if (showExpiredMessage) {
    return (
      <main className="mx-auto w-2xl max-w-full py-300">
        <div className="rounded bg-warning-light p-250">
          <div className="mb-100 font-semibold text-md text-warning">
            Platnost relace vypršela
          </div>
          <p className="text-sm text-warning">
            Vaše přihlášení vypršelo po 24 hodinách. Za chvíli budete
            přesměrováni na přihlašovací stránku...
          </p>
        </div>
      </main>
    )
  }

  // Loading - full page
  if (isLoading) {
    return (
      <main className="mx-auto w-2xl max-w-full py-400">
        <div className="text-center text-fg-secondary">Načítám...</div>
      </main>
    )
  }

  // Not authenticated - redirecting
  if (!customer) {
    return null
  }

  return (
    <AccountProvider>
      <main className="mx-auto w-full max-w-4xl px-400 py-400">
        <h1 className="mb-400 font-bold text-xl">Můj profil</h1>
        <div className="grid grid-cols-1 gap-400 md:grid-cols-[auto_1fr]">
          <AccountMenu />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </AccountProvider>
  )
}
