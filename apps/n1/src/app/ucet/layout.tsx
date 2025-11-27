'use client'

import { AccountMenu } from './_components/account-menu'
import { AccountProvider } from './context/account-context'

export default function AccountLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      <main className="mx-auto w-4xl max-w-full py-400">
        <h1 className="mb-250 font-bold text-xl">Můj profil</h1>
        <div className="grid gap-250 md:grid-cols-[auto_1fr]">
          <AccountMenu />
          {children}
        </div>
      </main>
    </AccountProvider>
  )
}
