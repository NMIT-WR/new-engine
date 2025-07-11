'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from 'ui/src/atoms/button'

export default function AccountPage() {
  const { user, isLoading, isInitialized, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after auth is initialized and we're sure there's no user
    if (isInitialized && !user) {
      router.push('/auth/login')
    }
  }, [user, isInitialized, router])

  // Show loading while auth is initializing or loading
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-account-bg py-account-page-py">
      <div className="mx-auto max-w-account-container-max-w px-account-container-px">
        <h1 className="mb-account-title-mb font-account-title text-account-title-fg text-account-title-size">
          My Account
        </h1>

        <div className="mb-account-card-mb rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card">
          <h2 className="mb-account-subtitle-mb font-account-subtitle text-account-subtitle-fg text-account-subtitle-size">
            Profile Information
          </h2>
          <div className="space-y-account-field-gap">
            <div>
              <span className="font-account-label text-account-label-fg">
                Email:
              </span>
              <span className="ml-account-label-mr text-account-value-fg">
                {user.email}
              </span>
            </div>
            <div>
              <span className="font-account-label text-account-label-fg">
                Name:
              </span>
              <span className="ml-account-label-mr text-account-value-fg">
                {user.first_name || user.last_name
                  ? `${user.first_name || ''} ${user.last_name || ''}`
                  : 'Not set'}
              </span>
            </div>
            <div>
              <span className="font-account-label text-account-label-fg">
                Customer ID:
              </span>
              <span className="ml-account-label-mr font-mono text-account-id-fg text-account-id-size">
                {user.id}
              </span>
            </div>
            <div>
              <span className="font-account-label text-account-label-fg">
                Phone:
              </span>
              <span className="ml-account-label-mr text-account-value-fg">
                {user.phone || 'Not set'}
              </span>
            </div>
            <div>
              <span className="font-account-label text-account-label-fg">
                Member since:
              </span>
              <span className="ml-account-label-mr text-account-value-fg">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-account-card bg-account-card-bg p-account-card-p shadow-account-card">
          <h2 className="mb-account-subtitle-mb font-account-subtitle text-account-subtitle-fg text-account-subtitle-size">
            Account Actions
          </h2>
          <div className="flex gap-account-actions-gap">
            <Button
              variant="primary"
              theme="solid"
              onClick={() => router.push('/')}
            >
              Continue Shopping
            </Button>
            <Button variant="danger" theme="solid" onClick={() => logout()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
