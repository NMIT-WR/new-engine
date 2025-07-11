'use client'

import { useAuth } from '@/hooks/use-auth'
import {
  ADDRESS_ERRORS,
  COUNTRIES,
  createAddressMetadata,
  formatPhoneNumber,
  formatPostalCode,
  getAddressFromMetadata,
  validateEmail,
} from '@/lib/address'
import type { HttpTypes } from '@medusajs/types'
import { Button } from '@ui/atoms/button'
import { ErrorText } from '@ui/atoms/error-text'
import { ExtraText } from '@ui/atoms/extra-text'
import { Icon } from '@ui/atoms/icon'
import { FormInputRaw as FormInput } from '@ui/molecules/form-input'
import { Select } from '@ui/molecules/select'
import { useState } from 'react'

interface ProfileFormProps {
  user: HttpTypes.StoreCustomer
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateProfile, isLoading } = useAuth()
  const [showBirthdate, setShowBirthdate] = useState(false)

  // Get address from metadata
  const addressData = getAddressFromMetadata(user)

  const [formData, setFormData] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    companyName: user.company_name || '',
    birthdate: '', // For now, we'll leave this empty as it's not in customer model
    // Address fields from metadata
    street: addressData.street || '',
    city: addressData.city || '',
    postalCode: addressData.postal_code || '',
    country: addressData.country || 'cz',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // if (!formData.firstName) newErrors.firstName = ADDRESS_ERRORS.firstName
    // if (!formData.lastName) newErrors.lastName = ADDRESS_ERRORS.lastName
    if (!formData.email) {
      newErrors.email = ADDRESS_ERRORS.email
    } else if (!validateEmail(formData.email)) {
      newErrors.email = ADDRESS_ERRORS.emailInvalid
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        await updateProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          company_name: formData.companyName || null,
          metadata: {
            ...user.metadata,
            address: createAddressMetadata(
              formData.street,
              formData.city,
              formData.postalCode,
              formData.country
            ),
          },
        })
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-pf-container border border-pf-container-border bg-pf-container-bg p-pf-container-padding shadow-pf">
          <div className="mb-pf-header-margin-bottom flex items-center gap-pf-header-gap">
            <h2 className="font-pf-title text-pf-title-size">Osobní údaje</h2>
          </div>

          <div className="space-y-pf-fields-gap">
            <div className="grid gap-pf-grid-gap sm:grid-cols-2">
              <FormInput
                id="firstName"
                size="sm"
                label="Jméno"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                validateStatus={errors.firstName ? 'error' : 'default'}
                helpText={
                  errors.firstName && <ErrorText>{errors.firstName}</ErrorText>
                }
              />

              <FormInput
                id="lastName"
                size="sm"
                label="Příjmení"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                validateStatus={errors.lastName ? 'error' : 'default'}
                helpText={
                  errors.lastName && <ErrorText>{errors.lastName}</ErrorText>
                }
              />
            </div>

            <FormInput
              id="email"
              size="sm"
              label="E-mail"
              type="email"
              required
              value={formData.email}
              disabled
              helpText={<ExtraText size="sm">E-mail nelze změnit</ExtraText>}
            />

            {showBirthdate && (
              <FormInput
                id="birthdate"
                size="sm"
                label="Datum narození"
                placeholder="dd.mm.rrrr"
                value={formData.birthdate}
                onChange={(e) =>
                  setFormData({ ...formData, birthdate: e.target.value })
                }
                helpText={
                  <button
                    type="button"
                    className="text-error hover:underline"
                    onClick={() => setShowBirthdate(false)}
                  >
                    <Icon
                      icon="icon-[solar--check-circle-bold]"
                      className="mr-1 inline h-4 w-4"
                    />
                    Skrýt datum narození
                  </button>
                }
              />
            )}

            <FormInput
              id="phone"
              size="sm"
              label={
                <span>
                  Telefonní číslo{' '}
                  <span className="text-fg-secondary">(nepovinné)</span>
                </span>
              }
              type="tel"
              placeholder="+420 777 235 511"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value)
                setFormData({ ...formData, phone: formatted })
              }}
            />
          </div>
        </div>

        {/* Address section */}
        <div className="rounded-pf-container border border-pf-container-border bg-pf-container-bg p-pf-container-padding shadow-pf">
          <div className="mb-pf-header-margin-bottom flex items-center gap-pf-header-gap">
            <h2 className="font-pf-title text-pf-title-size">Adresa</h2>
          </div>

          <div className="space-y-pf-fields-gap">
            <FormInput
              id="street"
              size="sm"
              label="Ulice a číslo popisné"
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              placeholder="Hlavní 123"
            />

            <div className="grid gap-pf-grid-gap sm:grid-cols-2">
              <FormInput
                id="city"
                size="sm"
                label="Město"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Praha"
              />

              <FormInput
                id="postalCode"
                size="sm"
                label="PSČ"
                value={formData.postalCode}
                onChange={(e) => {
                  const formatted = formatPostalCode(e.target.value)
                  setFormData({ ...formData, postalCode: formatted })
                }}
                placeholder="100 00"
              />
            </div>

            <div className="max-w-[20rem]">
              <label
                htmlFor="country-select"
                className="mb-2 block font-medium text-fg-primary text-sm"
              >
                Země
              </label>
              <Select
                id="country-select"
                options={COUNTRIES}
                value={[formData.country]}
                onValueChange={(details) =>
                  setFormData({
                    ...formData,
                    country: details.value[0],
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-pf-actions-gap">
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Uložit změny
          </Button>
        </div>
      </form>
      <Button onClick={() => console.log(user)}>Check user</Button>
    </>
  )
}
