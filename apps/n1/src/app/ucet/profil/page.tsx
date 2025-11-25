'use client'

import { useAuth } from '@/hooks/use-auth'
import { useLogout } from '@/hooks/use-logout'
import { Button } from '@new-engine/ui/atoms/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AddressList } from './_components/address-list'
import { OrderList } from './_components/order-list'
import { ProfileForm } from './_components/profile-form'

export default function ProfilePage() {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, isTokenExpired } = useAuth()
  const [showExpiredMessage, setShowExpiredMessage] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'profile' | 'addresses' | 'orders'
  >('profile')

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
    <div className="container mx-auto max-w-4xl py-xl">
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

      <div className="grid gap-lg md:grid-cols-[240px_1fr]">
        <nav className="space-y-xs">
          <Button
            variant={activeTab === 'profile' ? 'primary' : 'secondary'}
            theme={activeTab === 'profile' ? 'solid' : 'borderless'}
            className="w-full justify-start"
            onClick={() => setActiveTab('profile')}
          >
            Osobní údaje
          </Button>
          <Button
            variant={activeTab === 'addresses' ? 'primary' : 'secondary'}
            theme={activeTab === 'addresses' ? 'solid' : 'borderless'}
            className="w-full justify-start"
            onClick={() => setActiveTab('addresses')}
          >
            Adresy
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'primary' : 'secondary'}
            theme={activeTab === 'orders' ? 'solid' : 'borderless'}
            className="w-full justify-start"
            onClick={() => setActiveTab('orders')}
          >
            Objednávky
          </Button>
        </nav>

        <div className="rounded bg-surface-subtle p-lg">
          {activeTab === 'profile' && (
            <div className="space-y-md">
              <h2 className="font-semibold text-heading-md">Osobní údaje</h2>
              <ProfileForm />
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-md">
              <h2 className="font-semibold text-heading-md">Adresy</h2>
              <AddressList />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-md">
              <h2 className="font-semibold text-heading-md">Objednávky</h2>
              <OrderList />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
