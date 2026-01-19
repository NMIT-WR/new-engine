"use client"

import { Tabs } from "@techsio/ui-kit/molecules/tabs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { resolveTab } from "@/lib/account-tabs"
import { AddressList } from "./_components/address-list"
import { OrderList } from "./_components/order-list"
import { ProfileForm } from "./_components/profile-form"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const activeTab = resolveTab(searchParams.get("tab"), pathname)

  const handleTabChange = (value: string) => {
    const nextTab = resolveTab(value, pathname)
    const params = new URLSearchParams(searchParams.toString())

    if (nextTab === "profile") {
      params.delete("tab")
    } else {
      params.set("tab", nextTab)
    }

    const query = params.toString()
    router.replace(query ? `/ucet/profil?${query}` : "/ucet/profil", {
      scroll: false,
    })
  }

  return (
    <Tabs
      className="w-full gap-400"
      onValueChange={handleTabChange}
      orientation="vertical"
      size="sm"
      value={activeTab}
      variant="line"
    >
      <Tabs.List className="flex w-full flex-col gap-50 md:w-64">
        <Tabs.Trigger value="profile">Osobní údaje</Tabs.Trigger>
        <Tabs.Trigger value="addresses">Adresy</Tabs.Trigger>
        <Tabs.Trigger value="orders">Objednávky</Tabs.Trigger>
      </Tabs.List>

      <div className="min-w-0 flex-1">
        <Tabs.Content className="space-y-200" value="profile">
          <h2 className="font-semibold text-lg">Osobní údaje</h2>
          <ProfileForm />
        </Tabs.Content>

        <Tabs.Content className="space-y-200" value="addresses">
          <h2 className="font-semibold text-lg">Adresy</h2>
          <AddressList />
        </Tabs.Content>

        <Tabs.Content className="space-y-200" value="orders">
          <h2 className="font-semibold text-lg">Objednávky</h2>
          <OrderList />
        </Tabs.Content>
      </div>
    </Tabs>
  )
}
