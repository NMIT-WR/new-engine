"use client"

import { Button } from "@techsio/ui-kit/atoms/button"
import { Icon } from "@techsio/ui-kit/atoms/icon"
import { useToast } from "@techsio/ui-kit/molecules/toast"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authHooks } from "@/hooks/auth-hooks"
import { AUTH_MESSAGES } from "@/lib/auth"

const accountLinks = [
  {
    href: "/account/orders",
    label: "Moje objednávky",
    icon: "token-icon-shopping-bag" as const,
  },
  {
    href: "/account/profile",
    label: "Můj profil",
    icon: "token-icon-profile" as const,
  },
]

type AccountLayoutProps = {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const toast = useToast()

  const logoutMutation = authHooks.useLogout({
    onSuccess: () => {
      toast.create({
        ...AUTH_MESSAGES.LOGOUT_SUCCESS,
        type: "success",
      })
      router.push("/")
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <div className="mx-auto max-w-layout-max px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <nav className="sticky top-16 z-5 flex h-fit gap-3 space-y-1 border-b bg-base py-4 lg:block lg:border-none">
          {accountLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                className={`flex items-center gap-3 rounded-md py-2 transition-colors sm:px-3 ${
                  isActive
                    ? "bg-bg-surface-hover text-fg-primary"
                    : "text-fg-secondary hover:bg-bg-surface hover:text-fg-primary"
                }`}
                href={link.href}
                key={link.href}
              >
                <Icon className="hidden h-5 w-5 sm:block" icon={link.icon} />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            )
          })}

          <Button
            className="mx-3 hidden text-fg-reverse sm:flex"
            icon="token-icon-exit"
            onClick={handleLogout}
            size="sm"
          >
            <span className="font-medium text-xs">Odhlásit se</span>
          </Button>
          <Button
            className="mx-3 text-fg-reverse sm:hidden"
            onClick={handleLogout}
            size="sm"
          >
            <span className="font-medium text-xs">Odhlásit se</span>
          </Button>
        </nav>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}
