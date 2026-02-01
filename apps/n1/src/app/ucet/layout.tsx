"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authHooks } from "@/hooks/auth-hooks"
import { AccountProvider } from "./context/account-context"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { customer, isAuthenticated } = authHooks.useSuspenseAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/prihlaseni")
    }
  }, [isAuthenticated, router])

  if (!customer) {
    return null
  }

  return (
    <AccountProvider>
      <main className="mx-auto w-full max-w-5xl px-400 py-400">{children}</main>
    </AccountProvider>
  )
}
