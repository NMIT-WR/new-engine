'use client'

import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from '@/hooks/use-addresses'
import { useToast } from '@/hooks/use-toast'
import type {
  CreateAddressData,
  StoreCustomerAddress,
} from '@/services/customer-service'
import { Button } from '@techsio/ui-kit/atoms/button'
import { Input } from '@techsio/ui-kit/atoms/input'
import { useState } from 'react'

export function AddressList() {
  const { data, isLoading } = useAddresses()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  if (isLoading) {
    return <div className="text-fg-secondary">Načítám adresy...</div>
  }

  const addresses = data?.addresses || []

  return (
    <div className="space-y-250">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-md">Moje adresy</h3>
        {!isAdding && !editingId && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="secondary"
            size="sm"
          >
            Přidat adresu
          </Button>
        )}
      </div>

      {isAdding && (
        <AddressForm
          onCancel={() => setIsAdding(false)}
          onSuccess={() => setIsAdding(false)}
        />
      )}

      <div className="grid gap-200 md:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="rounded border p-200">
            {editingId === address.id ? (
              <AddressForm
                address={address}
                onCancel={() => setEditingId(null)}
                onSuccess={() => setEditingId(null)}
              />
            ) : (
              <AddressCard
                address={address}
                onEdit={() => setEditingId(address.id)}
              />
            )}
          </div>
        ))}
      </div>

      {!isAdding && addresses.length === 0 && (
        <div className="py-250 text-center text-fg-secondary">
          Zatím nemáte uložené žádné adresy.
        </div>
      )}
    </div>
  )
}

function AddressCard({
  address,
  onEdit,
}: { address: StoreCustomerAddress; onEdit: () => void }) {
  const deleteAddress = useDeleteAddress()
  const toaster = useToast()

  const handleDelete = () => {
    if (!confirm('Opravdu chcete smazat tuto adresu?')) return

    deleteAddress.mutate(address.id, {
      onSuccess: () => {
        toaster.create({ title: 'Adresa smazána', type: 'success' })
      },
      onError: () => {
        toaster.create({ title: 'Chyba při mazání', type: 'error' })
      },
    })
  }

  return (
    <div className="space-y-100">
      <div className="font-medium">
        {address.first_name} {address.last_name}
      </div>
      <div className="text-fg-secondary">
        <div>{address.company}</div>
        <div>{address.address_1}</div>
        <div>{address.address_2}</div>
        <div>
          {address.postal_code} {address.city}
        </div>
        <div>{address.country_code?.toUpperCase()}</div>
      </div>
      <div className="flex gap-100 pt-100">
        <Button
          theme="borderless"
          variant="secondary"
          size="sm"
          onClick={onEdit}
        >
          Upravit
        </Button>
        <Button
          theme="borderless"
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={deleteAddress.isPending}
        >
          Smazat
        </Button>
      </div>
    </div>
  )
}

function AddressForm({
  address,
  onCancel,
  onSuccess,
}: {
  address?: StoreCustomerAddress
  onCancel: () => void
  onSuccess: () => void
}) {
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const toaster = useToast()

  const [formData, setFormData] = useState<CreateAddressData>({
    first_name: address?.first_name || '',
    last_name: address?.last_name || '',
    company: address?.company || '',
    address_1: address?.address_1 || '',
    address_2: address?.address_2 || '',
    city: address?.city || '',
    postal_code: address?.postal_code || '',
    country_code: address?.country_code || 'cz',
    phone: address?.phone || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (address) {
      updateAddress.mutate(
        { addressId: address.id, data: formData },
        {
          onSuccess: () => {
            toaster.create({ title: 'Adresa upravena', type: 'success' })
            onSuccess()
          },
          onError: () => {
            toaster.create({ title: 'Chyba při úpravě', type: 'error' })
          },
        }
      )
    } else {
      createAddress.mutate(formData, {
        onSuccess: () => {
          toaster.create({ title: 'Adresa přidána', type: 'success' })
          onSuccess()
        },
        onError: () => {
          toaster.create({ title: 'Chyba při přidání', type: 'error' })
        },
      })
    }
  }

  const isPending = createAddress.isPending || updateAddress.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-100">
      <div className="grid grid-cols-2 gap-100">
        <Input
          placeholder="Jméno"
          value={formData.first_name}
          onChange={(e) =>
            setFormData({ ...formData, first_name: e.target.value })
          }
          required
        />
        <Input
          placeholder="Příjmení"
          value={formData.last_name}
          onChange={(e) =>
            setFormData({ ...formData, last_name: e.target.value })
          }
          required
        />
      </div>
      <Input
        placeholder="Firma (volitelné)"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
      />
      <Input
        placeholder="Ulice a číslo popisné"
        value={formData.address_1}
        onChange={(e) =>
          setFormData({ ...formData, address_1: e.target.value })
        }
        required
      />
      <div className="grid grid-cols-2 gap-100">
        <Input
          placeholder="Město"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
        <Input
          placeholder="PSČ"
          value={formData.postal_code}
          onChange={(e) =>
            setFormData({ ...formData, postal_code: e.target.value })
          }
          required
        />
      </div>
      <div className="flex justify-end gap-100 pt-100">
        <Button
          type="button"
          theme="borderless"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Zrušit
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Ukládám...' : address ? 'Uložit' : 'Přidat'}
        </Button>
      </div>
    </form>
  )
}
