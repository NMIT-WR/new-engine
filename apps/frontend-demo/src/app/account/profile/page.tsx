"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ProfileForm } from "@/components/organisms/profile-form"
import { authHooks } from "@/hooks/auth-hooks"
import { useCustomer } from "@/hooks/use-customer"

export default function ProfilePage() {
  const { customer: user, isLoading } = authHooks.useAuth()
  const router = useRouter()

  const { address, isLoading: isAddressLoading } = useCustomer()

  // Redirect to login if not authenticated
  const isInitialized = !isLoading
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/auth/login")
    }
  }, [isInitialized, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
          <p className="text-fg-secondary">Načítání...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto max-w-layout-max">
      <h1 className="mb-8 font-semibold text-2xl">Profil</h1>
      <ProfileForm
        initialAddress={address}
        key={isAddressLoading ? "loading" : address ? "exists" : "new"}
        user={user}
      />
    </div>
  )
}
