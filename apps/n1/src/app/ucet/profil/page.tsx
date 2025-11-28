'use client'

import { useAccountContext } from '../context/account-context'
import { AddressList } from './_components/address-list'
import { OrderList } from './_components/order-list'
import { ProfileForm } from './_components/profile-form'

export default function ProfilePage() {
  const { activeTab } = useAccountContext()

  return (
    <div className="px-250">
      {activeTab === 'profile' && (
        <div className="space-y-200">
          <h2 className="font-semibold text-lg">Osobní údaje</h2>
          <ProfileForm />
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-200">
          <h2 className="font-semibold text-lg">Adresy</h2>
          <AddressList />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-200">
          <h2 className="font-semibold text-lg">Objednávky</h2>
          <OrderList />
        </div>
      )}
    </div>
  )
}
