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
import {
  cleanPhoneNumber,
  formatPhoneNumber,
} from '@/utils/format/format-phone-number'
import {
  cleanPostalCode,
  formatPostalCode,
} from '@/utils/format/format-postal-code'
import { ConfirmDialog } from '@/components/molecules/confirm-dialog'
import { Button } from '@techsio/ui-kit/atoms/button'
import { Input } from '@techsio/ui-kit/atoms/input'
import { Label } from '@techsio/ui-kit/atoms/label'
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
      {/* Tlačítko přidat - pouze když nejsme v edit/add módu a máme adresy */}
      {!isAdding && !editingId && addresses.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsAdding(true)}
            variant="secondary"
            size="sm"
          >
            Přidat adresu
          </Button>
        </div>
      )}

      {/* Formulář pro přidání nové adresy */}
      {isAdding && (
        <div className="rounded border border-border-secondary bg-surface p-200">
          <AddressForm
            onCancel={() => setIsAdding(false)}
            onSuccess={() => setIsAdding(false)}
          />
        </div>
      )}

      {/* Grid s adresami */}
      {addresses.length > 0 && (
        <div className="grid gap-200 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded border border-border-secondary bg-surface p-200"
            >
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
      )}

      {/* Empty state s CTA */}
      {!isAdding && addresses.length === 0 && (
        <div className="py-400 text-center">
          <p className="mb-200 text-fg-secondary">
            Zatím nemáte uložené žádné adresy.
          </p>
          <Button
            onClick={() => setIsAdding(true)}
            variant="secondary"
            size="sm"
          >
            Přidat první adresu
          </Button>
        </div>
      )}
    </div>
  )
}

function AddressCard({
  address,
  onEdit,
}: { address: StoreCustomerAddress; onEdit: () => void }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const deleteAddress = useDeleteAddress()
  const toaster = useToast()

  const handleDelete = () => {
    deleteAddress.mutate(address.id, {
      onSuccess: () => {
        toaster.create({ title: 'Adresa smazána', type: 'success' })
        setIsDeleteDialogOpen(false)
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
      <div className="text-fg-secondary text-sm">
        {address.company && <div>{address.company}</div>}
        <div>{address.address_1}</div>
        {address.address_2 && <div>{address.address_2}</div>}
        <div>
          {formatPostalCode(address.postal_code || '')} {address.city}
        </div>
        {/* Zobrazit zemi pouze pokud není CZ */}
        {address.country_code &&
          address.country_code.toLowerCase() !== 'cz' && (
            <div>{address.country_code.toUpperCase()}</div>
          )}
        {address.phone && <div>{formatPhoneNumber(address.phone)}</div>}
      </div>
      <div className="flex gap-100 pt-100">
        <Button variant="secondary" size="sm" onClick={onEdit}>
          Upravit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Smazat
        </Button>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Smazat adresu?"
        description={`Opravdu chcete smazat adresu "${address.address_1}, ${address.city}"? Tato akce je nevratná.`}
        confirmText="Smazat"
        confirmVariant="danger"
        isLoading={deleteAddress.isPending}
        loadingText="Mažu..."
        onConfirm={handleDelete}
      />
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
    postal_code: formatPostalCode(address?.postal_code || ''),
    country_code: address?.country_code || 'cz',
    phone: formatPhoneNumber(address?.phone || ''),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Očistit formátované hodnoty pro API
    const cleanedData = {
      ...formData,
      postal_code: cleanPostalCode(formData.postal_code),
      phone: cleanPhoneNumber(formData.phone || ''),
    }

    if (address) {
      updateAddress.mutate(
        { addressId: address.id, data: cleanedData },
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
      createAddress.mutate(cleanedData, {
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

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCode(e.target.value)
    setFormData({ ...formData, postal_code: formatted })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 13) {
      setFormData({ ...formData, phone: formatted })
    }
  }

  const isPending = createAddress.isPending || updateAddress.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-150">
      {/* Jméno a příjmení */}
      <div className="grid grid-cols-2 gap-100">
        <div className="space-y-50">
          <Label className="text-sm">Jméno</Label>
          <Input
            placeholder="Jan"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-50">
          <Label className="text-sm">Příjmení</Label>
          <Input
            placeholder="Novák"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Firma */}
      <div className="space-y-50">
        <Label className="text-fg-secondary text-sm">Firma (volitelné)</Label>
        <Input
          placeholder="Název firmy"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
      </div>

      {/* Ulice */}
      <div className="space-y-50">
        <Label className="text-sm">Ulice a číslo popisné</Label>
        <Input
          placeholder="Hlavní 123"
          value={formData.address_1}
          onChange={(e) =>
            setFormData({ ...formData, address_1: e.target.value })
          }
          required
        />
      </div>

      {/* Město a PSČ */}
      <div className="grid grid-cols-2 gap-100">
        <div className="space-y-50">
          <Label className="text-sm">Město</Label>
          <Input
            placeholder="Praha"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div className="space-y-50">
          <Label className="text-sm">PSČ</Label>
          <Input
            placeholder="123 45"
            value={formData.postal_code}
            onChange={handlePostalCodeChange}
            required
          />
        </div>
      </div>

      {/* Telefon */}
      <div className="space-y-50">
        <Label className="text-fg-secondary text-sm">Telefon (volitelné)</Label>
        <Input
          type="tel"
          placeholder="+420 123 456 789"
          value={formData.phone}
          onChange={handlePhoneChange}
        />
      </div>

      {/* Akce */}
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
