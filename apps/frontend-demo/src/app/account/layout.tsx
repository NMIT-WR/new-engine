'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@new-engine/ui/atoms/button'
import { Icon } from '@new-engine/ui/atoms/icon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const accountLinks = [
  {
    href: '/account/orders',
    label: 'Moje objednávky',
    icon: 'token-icon-shopping-bag' as const,
  },
  {
    href: '/account/profile',
    label: 'Můj profil',
    icon: 'token-icon-profile' as const,
  },
]

interface AccountLayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
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
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-md py-2 transition-colors sm:px-3 ${
                  isActive
                    ? 'bg-bg-surface-hover text-fg-primary'
                    : 'text-fg-secondary hover:bg-bg-surface hover:text-fg-primary'
                }`}
              >
                <Icon icon={link.icon} className="hidden h-5 w-5 sm:block" />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            )
          })}

          <Button
            onClick={handleLogout}
            className="mx-3 hidden text-fg-reverse sm:flex"
            icon="token-icon-exit"
            size="sm"
          >
            <span className="font-medium text-xs">Odhlásit se</span>
          </Button>
          <Button
            onClick={handleLogout}
            className="mx-3 text-fg-reverse sm:hidden"
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
