'use client'

import { ConfirmDialog } from '@/components/molecules/confirm-dialog'
import { FormField } from '@/components/molecules/form-field'
import {
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from '@/hooks/use-addresses'
import { useToast } from '@/hooks/use-toast'
import { AddressValidationError } from '@/lib/errors'
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
import { Button } from '@techsio/ui-kit/atoms/button'
import { useState } from 'react'
import { useAccountContext } from '../../context/account-context'

export function AddressList() {
  const { customer } = useAccountContext()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  if (!customer || !customer.addresses) {
    return <div className="text-fg-secondary">Načítám adresy...</div>
  }

  const addresses = customer.addresses

  return (
    <div className="space-y-250">
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

      {isAdding && (
        <div className="rounded border border-border-secondary bg-surface p-200">
          <AddressForm
            onCancel={() => setIsAdding(false)}
            onSuccess={() => setIsAdding(false)}
          />
        </div>
      )}

      {addresses.length > 0 && (
        <div className="grid auto-rows-min gap-200 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`h-fit rounded border border-border-secondary bg-surface p-200 ${
                editingId === null
                  ? 'row-span-3 grid grid-rows-subgrid gap-0'
                  : 'flex flex-col gap-100'
              }`}
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
    <div className="contents">
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
        {address.country_code &&
          address.country_code.toLowerCase() !== 'cz' && (
            <div>{address.country_code.toUpperCase()}</div>
          )}
        {address.phone && <div>{formatPhoneNumber(address.phone)}</div>}
      </div>
      <div className="flex items-end gap-100 pt-100">
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
          onError: (error) => {
            const message = AddressValidationError.isAddressValidationError(
              error
            )
              ? error.firstError
              : 'Chyba při úpravě'
            toaster.create({ title: message, type: 'error' })
          },
        }
      )
    } else {
      createAddress.mutate(cleanedData, {
        onSuccess: () => {
          toaster.create({ title: 'Adresa přidána', type: 'success' })
          onSuccess()
        },
        onError: (error) => {
          const message = AddressValidationError.isAddressValidationError(error)
            ? error.firstError
            : 'Chyba při přidání'
          toaster.create({ title: message, type: 'error' })
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
      <div className="grid grid-cols-2 gap-100">
        <div className="space-y-50">
          <FormField
            id="first_name"
            label="Jméno"
            name="first_name"
            type="text"
            required
            minLength={2}
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            errorMessage="Jméno musí mít alespoň 2 znaky"
          />
        </div>
        <div className="space-y-50">
          <FormField
            id="last_name"
            label="Příjmení"
            name="last_name"
            type="text"
            required
            minLength={2}
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            errorMessage="Příjmení musí mít alespoň 2 znaky"
          />
        </div>
      </div>

      <div className="space-y-50">
        <FormField
          id="company"
          label="Firma (volitelné)"
          name="company"
          type="text"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
      </div>

      <div className="space-y-50">
        <FormField
          id="address_1"
          label="Adresa"
          name="address_1"
          type="text"
          placeholder="Ulice a číslo popisné"
          value={formData.address_1}
          onChange={(e) =>
            setFormData({ ...formData, address_1: e.target.value })
          }
          required
          minLength={3}
          errorMessage="Adresa musí mít alespoň 3 znaky"
        />
      </div>

      <div className="grid grid-cols-2 gap-100">
        <div className="space-y-50">
          <FormField
            id="city"
            label="Město"
            name="city"
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            minLength={2}
            errorMessage="Město musí mít alespoň 2 znaky"
          />
        </div>
        <div className="space-y-50">
          <FormField
            id="postal_code"
            label="PSČ"
            name="postal_code"
            type="text"
            placeholder="110 00"
            value={formData.postal_code}
            onChange={handlePostalCodeChange}
            required
            pattern="^\d{3}\s?\d{2}$"
            errorMessage="PSČ musí být ve formátu 123 45"
          />
        </div>
      </div>

      <div className="space-y-50">
        <FormField
          id="phone"
          label="Telefon (volitelné)"
          name="phone"
          type="tel"
          placeholder="+420 123 456 789"
          value={formData.phone}
          onChange={handlePhoneChange}
          pattern="^(\+420|\+421)?\s?\d{3}\s?\d{3}\s?\d{3}$"
          errorMessage="Neplatný formát telefonu"
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
