'use client'

import { useAuth } from '@/hooks/use-auth'
import type { HttpTypes } from '@medusajs/types'
import { Button } from '@ui/atoms/button'
import { ErrorText } from '@ui/atoms/error-text'
import { ExtraText } from '@ui/atoms/extra-text'
import { Icon } from '@ui/atoms/icon'
import { FormInputRaw as FormInput } from '@ui/molecules/form-input'
import { useState } from 'react'

interface ProfileFormProps {
  user: HttpTypes.StoreCustomer
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateProfile, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showBirthdate, setShowBirthdate] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    companyName: user.company_name || '',
    birthdate: '', // For now, we'll leave this empty as it's not in customer model
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length === 0) return ''
    const country = cleaned.slice(0, 3)
    const firstPart = cleaned.slice(3, 6)
    const secondPart = cleaned.slice(6, 9)
    const thirdPart = cleaned.slice(9, 12)

    let formatted = '+'
    if (country) formatted += country
    if (firstPart) formatted += ' ' + firstPart
    if (secondPart) formatted += ' ' + secondPart
    if (thirdPart) formatted += ' ' + thirdPart

    return formatted
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = 'Jméno je povinné'
    if (!formData.lastName) newErrors.lastName = 'Příjmení je povinné'
    if (!formData.email) {
      newErrors.email = 'Email je povinný'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    if (validateForm()) {
      try {
        await updateProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          company_name: formData.companyName || null,
        })
        setIsEditing(false)
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      companyName: user.company_name || '',
      birthdate: '',
    })
    setErrors({})
    setIsEditing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-pf-container border border-pf-container-border bg-pf-container-bg p-pf-container-padding">
        <div className="mb-pf-header-margin-bottom flex items-center gap-pf-header-gap">
          <Icon
            icon="icon-[solar--user-bold]"
            className="h-pf-icon-size w-pf-icon-size text-pf-icon-fg"
          />
          <h2 className="font-pf-title text-pf-title-size">Osobní údaje</h2>
        </div>

        <div className="space-y-pf-fields-gap">
          <div className="grid gap-pf-grid-gap sm:grid-cols-2">
            <FormInput
              id="firstName"
              label="Jméno"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              disabled={!isEditing}
              validateStatus={errors.firstName ? 'error' : 'default'}
              helpText={
                errors.firstName && <ErrorText>{errors.firstName}</ErrorText>
              }
            />

            <FormInput
              id="lastName"
              label="Příjmení"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              disabled={!isEditing}
              validateStatus={errors.lastName ? 'error' : 'default'}
              helpText={
                errors.lastName && <ErrorText>{errors.lastName}</ErrorText>
              }
            />
          </div>

          <FormInput
            id="email"
            label="E-mail"
            type="email"
            required
            value={formData.email}
            disabled
            helpText={<ExtraText>E-mail nelze změnit</ExtraText>}
          />

          <FormInput
            id="companyName"
            label="Číslo zákazníka"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            disabled={!isEditing}
            placeholder="30129389"
          />

          {showBirthdate && (
            <FormInput
              id="birthdate"
              label="Datum narození"
              placeholder="dd.mm.rrrr"
              value={formData.birthdate}
              onChange={(e) =>
                setFormData({ ...formData, birthdate: e.target.value })
              }
              disabled={!isEditing}
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
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="flex justify-end gap-pf-actions-gap">
        {isEditing && (
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Zrušit
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isEditing ? 'Uložit změny' : 'Upravit údaje'}
        </Button>
      </div>
    </form>
  )
}
