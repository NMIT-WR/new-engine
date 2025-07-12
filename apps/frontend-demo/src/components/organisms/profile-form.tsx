'use client'
import { useCustomer } from '@/hooks/use-customer'
import { COUNTRIES, formatPhoneNumber, formatPostalCode } from '@/lib/address'
import type { FormAddressData, FormUserData } from '@/types/checkout'
import type { HttpTypes } from '@medusajs/types'
import { Button } from '@ui/atoms/button'
import { ExtraText } from '@ui/atoms/extra-text'
import { FormInputRaw as FormInput } from '@ui/molecules/form-input'
import { Select } from '@ui/molecules/select'
import { useState } from 'react'

interface ProfileFormProps {
  initialAddress: FormAddressData | null
  user: HttpTypes.StoreCustomer
}

export function ProfileForm({ initialAddress, user }: ProfileFormProps) {
  const { saveAddress, isSaving, updateProfile, isUpdating } = useCustomer()

  const [formAddressData, setFormAddressData] = useState<FormAddressData>({
    street: initialAddress?.street || '',
    city: initialAddress?.city || '',
    postalCode: initialAddress?.postalCode || '',
    country: initialAddress?.country || 'cz',
  })

  const [formUserData, setFormUserData] = useState<FormUserData>({
    id: user.id,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    company_name: user.company_name || '',
  })

  const hasProfileChanges =
    formUserData.first_name !== user.first_name ||
    formUserData.last_name !== user.last_name ||
    formUserData.phone !== (user.phone || '') ||
    formUserData.company_name !== (user.company_name || '')

  const hasAddressChanges =
    formAddressData.street !== initialAddress?.street ||
    formAddressData.city !== initialAddress?.city ||
    formAddressData.postalCode !== initialAddress?.postalCode ||
    formAddressData.country !== initialAddress?.country


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const addressData: FormAddressData = {
        ...formAddressData,
      }
      const userData: FormUserData = {
        ...formUserData,
      }

      const promises = []

      if (hasProfileChanges) {
        promises.push(updateProfile(userData))
      }
      if (hasAddressChanges) {
        promises.push(saveAddress(addressData))
      }
      if (promises.length > 0) {
        await Promise.all(promises)
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-pf-container border border-pf-container-border bg-pf-container-bg p-pf-container-padding shadow-pf">
        <div className="mb-pf-header-margin-bottom flex items-center gap-pf-header-gap">
          <h2 className="font-pf-title text-pf-title-size">Profil & adresa</h2>
        </div>

        <div className="space-y-pf-fields-gap">
          <div className="grid gap-pf-grid-gap sm:grid-cols-2">
            <FormInput
              id="address-firstName"
              size="sm"
              label="Jméno"
              value={formUserData.first_name}
              onChange={(e) =>
                setFormUserData({
                  ...formUserData,
                  first_name: e.target.value,
                })
              }
              placeholder="Jan"
            />

            <FormInput
              id="address-lastName"
              size="sm"
              label="Příjmení"
              value={formUserData.last_name}
              onChange={(e) =>
                setFormUserData({ ...formUserData, last_name: e.target.value })
              }
              placeholder="Novák"
            />
          </div>
          <FormInput
            id="email"
            size="sm"
            label="E-mail"
            type="email"
            value={user.email || ''}
            disabled
            helpText={<ExtraText size="sm">E-mail nelze změnit</ExtraText>}
          />

          <FormInput
            id="address-company"
            size="sm"
            label={
              <span>
                Firma{' '}
                <span className="text-fg-secondary text-sm">(nepovinné)</span>
              </span>
            }
            value={formUserData.company_name || ''}
            onChange={(e) =>
              setFormUserData({ ...formUserData, company_name: e.target.value })
            }
          />

          <FormInput
            id="address-phone"
            size="sm"
            label={
              <span>
                Telefonní číslo{' '}
                <span className="text-fg-secondary">(nepovinné)</span>
              </span>
            }
            type="tel"
            placeholder="+420 777 888 999"
            value={formUserData.phone}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value)
              setFormUserData({ ...formUserData, phone: formatted })
            }}
          />

          <FormInput
            id="address-street"
            size="sm"
            label="Ulice a číslo popisné"
            value={formAddressData.street}
            onChange={(e) =>
              setFormAddressData({ ...formAddressData, street: e.target.value })
            }
            placeholder="Hlavní 123"
          />

          <div className="grid gap-pf-grid-gap sm:grid-cols-2">
            <FormInput
              id="address-city"
              size="sm"
              label="Město"
              value={formAddressData.city}
              onChange={(e) =>
                setFormAddressData({ ...formAddressData, city: e.target.value })
              }
              placeholder="Praha"
            />

            <FormInput
              id="address-postalCode"
              size="sm"
              label="PSČ"
              value={formAddressData.postalCode}
              onChange={(e) => {
                const formatted = formatPostalCode(e.target.value)
                setFormAddressData({
                  ...formAddressData,
                  postalCode: formatted,
                })
              }}
              placeholder="100 00"
            />
          </div>

          <div className="max-w-[20rem]">
            <label
              htmlFor="address-country-select"
              className="mb-2 block font-medium text-fg-primary text-sm"
            >
              Země
            </label>
            <Select
              id="address-country-select"
              options={COUNTRIES}
              value={[formAddressData.country]}
              onValueChange={(details) =>
                setFormAddressData({
                  ...formAddressData,
                  country: details.value[0],
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-pf-actions-gap">
        <Button
          type="submit"
          isLoading={isSaving || isUpdating}
          disabled={isSaving || isUpdating}
        >
          Uložit změny
        </Button>
      </div>
    </form>
  )
}
