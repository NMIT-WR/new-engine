'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAccountContext } from '../context/account-context'
import { AddressList } from './_components/address-list'
import { OrderList } from './_components/order-list'
import { ProfileForm } from './_components/profile-form'

export default function ProfilePage() {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, isTokenExpired } = useAuth()
  const [showExpiredMessage, setShowExpiredMessage] = useState(false)
  const { activeTab } = useAccountContext()

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
      <div className="mx-auto w-2xl max-w-full py-300">
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
      <div className="mx-auto w-2xl max-w-full py-400">
        <div className="text-center text-fg-secondary">Načítám...</div>
      </div>
    )
  }

  if (!customer) {
    return null // Redirecting...
  }

  return (
    <div className="px-250">
      {activeTab === 'profile' && (
        <div className="space-y-200">
          <h2 className="font-semibold text-lg">Osobní údaje</h2>
          <ProfileForm />
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-200">
          <h2 className="font-semibold text-lg">Adresy</h2>
          <AddressList />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-200">
          <h2 className="font-semibold text-lg">Objednávky</h2>
          <OrderList />
        </div>
      )}
    </div>
  )
}
