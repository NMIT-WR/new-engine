'use client'

import { ProfileForm } from '@/components/organisms/profile-form'
import { AccountLayout } from '@/components/templates/account-layout'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isLoading, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/auth/login')
    }
  }, [isInitialized, user, router])

  if (isLoading || !isInitialized) {
    return (
      <AccountLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
            <p className="text-fg-secondary">Načítání...</p>
          </div>
        </div>
      </AccountLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AccountLayout>
      <div className="mx-auto max-w-layout-max">
        <h1 className="mb-8 font-semibold text-2xl">Profil & zabezpečení</h1>
        <ProfileForm user={user} />
      </div>
    </AccountLayout>
  )
}
