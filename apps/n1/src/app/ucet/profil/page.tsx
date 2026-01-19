'use client'

import { Tabs } from '@techsio/ui-kit/molecules/tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { AddressList } from './_components/address-list'
import { OrderList } from './_components/order-list'
import { ProfileForm } from './_components/profile-form'

const ACCOUNT_TABS = ['profile', 'addresses', 'orders'] as const
type AccountTab = (typeof ACCOUNT_TABS)[number]

const resolveTab = (value: string | null): AccountTab => {
  if (value === 'addresses' || value === 'orders' || value === 'profile') {
    return value
  }
  return 'profile'
}

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = resolveTab(searchParams.get('tab'))

  const handleTabChange = (value: string) => {
    const nextTab = resolveTab(value)
    const params = new URLSearchParams(searchParams.toString())

    if (nextTab === 'profile') {
      params.delete('tab')
    } else {
      params.set('tab', nextTab)
    }

    const query = params.toString()
    router.replace(query ? `/ucet/profil?${query}` : '/ucet/profil', {
      scroll: false,
    })
  }

  return (
    <Tabs
      className="w-full gap-400"
      orientation="vertical"
      value={activeTab}
      onValueChange={handleTabChange}
      variant="line"
      size="sm"
    >
      <Tabs.List className="flex w-full flex-col gap-50 md:w-64">
        <Tabs.Trigger value="profile">Osobní údaje</Tabs.Trigger>
        <Tabs.Trigger value="addresses">Adresy</Tabs.Trigger>
        <Tabs.Trigger value="orders">Objednávky</Tabs.Trigger>
      </Tabs.List>

      <div className="min-w-0 flex-1">
        <Tabs.Content value="profile" className="space-y-200">
          <h2 className="font-semibold text-lg">Osobní údaje</h2>
          <ProfileForm />
        </Tabs.Content>

        <Tabs.Content value="addresses" className="space-y-200">
          <h2 className="font-semibold text-lg">Adresy</h2>
          <AddressList />
        </Tabs.Content>

        <Tabs.Content value="orders" className="space-y-200">
          <h2 className="font-semibold text-lg">Objednávky</h2>
          <OrderList />
        </Tabs.Content>
      </div>
    </Tabs>
  )
}
