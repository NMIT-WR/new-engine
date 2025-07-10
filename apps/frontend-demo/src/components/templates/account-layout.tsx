'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@ui/atoms/button'
import { Icon } from '@ui/atoms/icon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

const accountLinks = [
  {
    href: '/account/orders',
    label: 'Tvé objednávky',
    icon: 'token-icon-shopping-bag' as const,
  },
  {
    href: '/account/profile',
    label: 'Profil & zabezpečení',
    icon: 'token-icon-profile' as const,
  },
  {
    href: '/account/settings',
    label: 'Nastavení',
    icon: 'token-icon-setting' as const,
  },
  {
    href: '#',
    label: 'Pomoc',
    icon: 'token-icon-help' as const,
  },
]

interface AccountLayoutProps {
  children: ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="container mx-auto max-w-layout-max px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <nav className="space-y-1">
          {accountLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-bg-surface-hover text-fg-primary'
                    : 'text-fg-secondary hover:bg-bg-surface hover:text-fg-primary'
                }`}
              >
                <Icon icon={link.icon} className="h-5 w-5" />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            )
          })}

          <Button
            onClick={handleLogout}
            className="text-fg-reverse transition-colors"
            icon="token-icon-exit"
          >
            <span className="font-medium text-sm">Odhlásit se</span>
          </Button>
        </nav>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}
