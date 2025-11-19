'use client'

import { useAuth } from '@/hooks/use-auth'
import { useLogout } from '@/hooks/use-logout'
import { Button } from '@new-engine/ui/atoms/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, isTokenExpired } = useAuth()
  const [showExpiredMessage, setShowExpiredMessage] = useState(false)

  const logoutMutation = useLogout({
    onSuccess: () => {
      router.push('/prihlaseni')
    },
  })

  // Handle session expiration
  useEffect(() => {
    if (isTokenExpired) {
      setShowExpiredMessage(true)
      // Redirect after 3 seconds
      const timeout = setTimeout(() => {
        router.push('/prihlaseni')
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [isTokenExpired, router])

  // Redirect if not authenticated (but not expired - that's handled above)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isTokenExpired) {
      router.push('/prihlaseni')
    }
  }, [isAuthenticated, isLoading, isTokenExpired, router])

  // Show session expired message
  if (showExpiredMessage) {
    return (
      <div className="container mx-auto max-w-2xl py-xl">
        <div className="rounded bg-warning-bg-subtle p-lg">
          <div className="mb-sm font-semibold text-heading-sm text-warning-fg">
            Platnost relace vypršela
          </div>
          <p className="text-body-md text-warning-fg">
            Vaše přihlášení vypršelo po 24 hodinách. Za chvíli budete
            přesměrováni na přihlašovací stránku...
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-xl">
        <div className="text-center text-fg-muted">Načítám...</div>
      </div>
    )
  }

  if (!customer) {
    return null // Redirecting...
  }

  return (
    <div className="container mx-auto max-w-2xl py-xl">
      <div className="mb-lg flex items-center justify-between">
        <h1 className="font-bold text-heading-lg">Můj profil</h1>
        <Button
          variant="secondary"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Odhlašuji...' : 'Odhlásit se'}
        </Button>
      </div>

      <div className="rounded bg-surface-subtle p-lg">
        <div className="mb-md">
          <h2 className="mb-sm font-semibold text-heading-sm">
            Základní informace
          </h2>
          <div className="grid gap-sm">
            <div>
              <span className="text-body-sm text-fg-muted">Jméno:</span>
              <p className="font-medium text-body-md">
                {customer.first_name} {customer.last_name}
              </p>
            </div>
            <div>
              <span className="text-body-sm text-fg-muted">E-mail:</span>
              <p className="font-medium text-body-md">{customer.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded bg-success-bg-subtle p-md text-success-fg">
          ✓ Autentizace funguje správně!
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-lg rounded bg-surface-subtle p-lg">
          <h2 className="mb-sm font-semibold text-heading-sm">Debug Info</h2>
          <pre className="overflow-auto text-body-xs">
            {JSON.stringify(customer, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
