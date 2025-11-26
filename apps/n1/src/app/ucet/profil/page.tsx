'use client'

import { useAuth } from '@/hooks/use-auth'
import { useLogout } from '@/hooks/use-logout'
import { Button } from '@techsio/ui-kit/atoms/button'
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
      <div className="container mx-auto max-w-2xl py-300">
        <div className="rounded bg-warning-light p-250">
          <div className="mb-100 font-semibold text-md text-warning-light">
            Platnost relace vypršela
          </div>
          <p className="text-sm text-warning-light">
            Vaše přihlášení vypršelo po 24 hodinách. Za chvíli budete
            přesměrováni na přihlašovací stránku...
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-400">
        <div className="text-center text-fg-secondary">Načítám...</div>
      </div>
    )
  }

  if (!customer) {
    return null // Redirecting...
  }

  return (
    <div className="container mx-auto max-w-4xl py-400">
      <div className="mb-250 flex items-center justify-between">
        <h1 className="font-bold text-xl">Můj profil</h1>
        <Button
          variant="secondary"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Odhlašuji...' : 'Odhlásit se'}
        </Button>
      </div>

      <div className="grid gap-250 md:grid-cols-[240px_1fr]">
        <nav className="space-y-50">
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

        <div className="rounded bg-surface-light p-250">
          {activeTab === 'profile' && (
            <div className="space-y-200">
              <h2 className="font-semibold text-md">Osobní údaje</h2>
              <ProfileForm />
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-200">
              <h2 className="font-semibold text-md">Adresy</h2>
              <AddressList />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-200">
              <h2 className="font-semibold text-md">Objednávky</h2>
              <OrderList />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
