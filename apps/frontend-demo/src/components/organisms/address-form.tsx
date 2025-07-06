'use client'

import { Button } from '@ui/atoms/button'
import { ErrorText } from '@ui/atoms/error-text'
import { FormCheckboxRaw as FormCheckbox } from '@ui/molecules/form-checkbox'
import { FormInputRaw as FormInput } from '@ui/molecules/form-input'
import { Select } from '@ui/molecules/select'
import { useState } from 'react'

interface AddressData {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  postalCode: string
  country: string
  company?: string
}

interface AddressFormProps {
  onComplete: (data: {
    shipping: AddressData
    billing: AddressData
    useSameAddress: boolean
  }) => void
  initialData?: {
    shipping?: Partial<AddressData>
    billing?: Partial<AddressData>
    useSameAddress?: boolean
  }
  isLoading?: boolean
}

const countries = [
  { label: 'Česká republika', value: 'CZ' },
  { label: 'Slovensko', value: 'SK' },
  { label: 'Polsko', value: 'PL' },
  { label: 'Německo', value: 'DE' },
  { label: 'Rakousko', value: 'AT' },
]

export function AddressForm({
  onComplete,
  initialData,
  isLoading = false,
}: AddressFormProps) {
  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    firstName: initialData?.shipping?.firstName || '',
    lastName: initialData?.shipping?.lastName || '',
    email: initialData?.shipping?.email || '',
    phone: initialData?.shipping?.phone || '',
    street: initialData?.shipping?.street || '',
    city: initialData?.shipping?.city || '',
    postalCode: initialData?.shipping?.postalCode || '',
    country: initialData?.shipping?.country || 'CZ',
    company: initialData?.shipping?.company || '',
  })

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    firstName: initialData?.billing?.firstName || '',
    lastName: initialData?.billing?.lastName || '',
    email: initialData?.billing?.email || '',
    phone: initialData?.billing?.phone || '',
    street: initialData?.billing?.street || '',
    city: initialData?.billing?.city || '',
    postalCode: initialData?.billing?.postalCode || '',
    country: initialData?.billing?.country || 'CZ',
    company: initialData?.billing?.company || '',
  })

  const [useSameAddress, setUseSameAddress] = useState(
    initialData?.useSameAddress ?? true
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    if (cleaned.length <= 9)
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`
  }

  // Format postal code
  const formatPostalCode = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)}`
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate shipping address
    if (!shippingAddress.firstName)
      newErrors.shippingFirstName = 'Jméno je povinné'
    if (!shippingAddress.lastName)
      newErrors.shippingLastName = 'Příjmení je povinné'
    if (!shippingAddress.email) {
      newErrors.shippingEmail = 'Email je povinný'
    } else if (!emailRegex.test(shippingAddress.email)) {
      newErrors.shippingEmail = 'Neplatný formát emailu'
    }
    if (!shippingAddress.phone) {
      newErrors.shippingPhone = 'Telefon je povinný'
    } else if (shippingAddress.phone.replace(/\D/g, '').length < 9) {
      newErrors.shippingPhone = 'Telefon musí mít alespoň 9 číslic'
    }
    if (!shippingAddress.street) newErrors.shippingStreet = 'Ulice je povinná'
    if (!shippingAddress.city) newErrors.shippingCity = 'Město je povinné'
    if (!shippingAddress.postalCode) {
      newErrors.shippingPostalCode = 'PSČ je povinné'
    } else if (shippingAddress.postalCode.replace(/\D/g, '').length !== 5) {
      newErrors.shippingPostalCode = 'PSČ musí mít 5 číslic'
    }

    // Validate billing address if different
    if (!useSameAddress) {
      if (!billingAddress.firstName)
        newErrors.billingFirstName = 'Jméno je povinné'
      if (!billingAddress.lastName)
        newErrors.billingLastName = 'Příjmení je povinné'
      if (!billingAddress.street) newErrors.billingStreet = 'Ulice je povinná'
      if (!billingAddress.city) newErrors.billingCity = 'Město je povinné'
      if (!billingAddress.postalCode)
        newErrors.billingPostalCode = 'PSČ je povinné'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete({
        shipping: shippingAddress,
        billing: useSameAddress ? shippingAddress : billingAddress,
        useSameAddress,
      })
    }
  }

  const setTestInfo = () => {
    const data = {
      firstName: 'Jan',
      lastName: 'Novák',
      email: 'jann@test.cz',
      phone: '777 666 555',
      street: 'Hlavní',
      city: 'Praha',
      postalCode: '100 00',
      country: 'CZ',
      company: 'Test',
    }
    setShippingAddress(data)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col">
      <Button
        size="sm"
        className="absolute top-0 right-0 z-10"
        onClick={setTestInfo}
      >
        Vyplnit
      </Button>
      <div className="flex flex-col gap-4 sm:gap-5">
        <h3 className="mb-1 font-semibold text-fg-primary sm:mb-2 sm:text-lg">
          Doručovací adresa
        </h3>
        <p className="mb-3 text-fg-secondary text-xs sm:mb-4 sm:text-sm">
          Pole označená <span className="text-red-500">*</span> jsou povinná
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <FormInput
            id="shipping-first-name"
            label="Jméno"
            required
            value={shippingAddress.firstName}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                firstName: e.target.value,
              })
            }
            validateStatus={errors.shippingFirstName ? 'error' : 'default'}
            helpText={
              errors.shippingFirstName && (
                <ErrorText>{errors.shippingFirstName}</ErrorText>
              )
            }
          />

          <FormInput
            id="shipping-last-name"
            label="Příjmení"
            required
            value={shippingAddress.lastName}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                lastName: e.target.value,
              })
            }
            validateStatus={errors.shippingLastName ? 'error' : 'default'}
            helpText={
              errors.shippingLastName && (
                <ErrorText>{errors.shippingLastName}</ErrorText>
              )
            }
          />
        </div>

        <FormInput
          id="shipping-company"
          label={
            <span>
              Firma{' '}
              <span className="text-fg-secondary text-sm">(nepovinné)</span>
            </span>
          }
          value={shippingAddress.company}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, company: e.target.value })
          }
        />
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <FormInput
            id="shipping-email"
            label="Email"
            type="email"
            required
            value={shippingAddress.email}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, email: e.target.value })
            }
            onBlur={(e) => {
              const email = e.target.value
              if (email && !emailRegex.test(email)) {
                setErrors({
                  ...errors,
                  shippingEmail: 'Neplatný formát emailu',
                })
              } else {
                setErrors({ ...errors, shippingEmail: '' })
              }
            }}
            validateStatus={errors.shippingEmail ? 'error' : 'default'}
            helpText={
              errors.shippingEmail && (
                <ErrorText>{errors.shippingEmail}</ErrorText>
              )
            }
          />

          <FormInput
            id="shipping-phone"
            label="Telefon"
            type="tel"
            required
            placeholder="123 456 789"
            value={shippingAddress.phone}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value)
              setShippingAddress({ ...shippingAddress, phone: formatted })
            }}
            validateStatus={errors.shippingPhone ? 'error' : 'default'}
            helpText={
              errors.shippingPhone && (
                <ErrorText>{errors.shippingPhone}</ErrorText>
              )
            }
          />
        </div>

        <FormInput
          id="shipping-street"
          label="Ulice a číslo popisné"
          required
          value={shippingAddress.street}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, street: e.target.value })
          }
          validateStatus={errors.shippingStreet ? 'error' : 'default'}
          helpText={
            errors.shippingStreet && (
              <ErrorText>{errors.shippingStreet}</ErrorText>
            )
          }
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <FormInput
            id="shipping-city"
            label="Město"
            required
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
            validateStatus={errors.shippingCity ? 'error' : 'default'}
            helpText={
              errors.shippingCity && (
                <ErrorText>{errors.shippingCity}</ErrorText>
              )
            }
          />

          <FormInput
            id="shipping-postal-code"
            label="PSČ"
            required
            placeholder="123 45"
            value={shippingAddress.postalCode}
            onChange={(e) => {
              const formatted = formatPostalCode(e.target.value)
              setShippingAddress({ ...shippingAddress, postalCode: formatted })
            }}
            validateStatus={errors.shippingPostalCode ? 'error' : 'default'}
            helpText={
              errors.shippingPostalCode && (
                <ErrorText>{errors.shippingPostalCode}</ErrorText>
              )
            }
          />
        </div>

        <div className="max-w-[20rem] mb-4 sm:mb-6">
          <Select
            options={countries}
            value={[shippingAddress.country]}
            onValueChange={(details) =>
              setShippingAddress({
                ...shippingAddress,
                country: details.value[0],
              })
            }
            required
          />
        </div>
      </div>

      <div className='mb-4 sm:mb-6'>
        <FormCheckbox
          id="same-address"
          label="Fakturační adresa je stejná jako doručovací"
          checked={useSameAddress}
          onCheckedChange={(details) =>
            setUseSameAddress(details.checked as boolean)
          }
        />
      </div>

      {!useSameAddress && (
        <div className="flex flex-col gap-4 sm:gap-5">
          <h3 className="mb-1 font-semibold text-fg-primary sm:mb-2 sm:text-lg">
            Fakturační adresa
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <FormInput
              id="billing-first-name"
              label="Jméno"
              required
              value={billingAddress.firstName}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  firstName: e.target.value,
                })
              }
              validateStatus={errors.billingFirstName ? 'error' : 'default'}
              helpText={
                errors.billingFirstName && (
                  <ErrorText>{errors.billingFirstName}</ErrorText>
                )
              }
            />

            <FormInput
              id="billing-last-name"
              label="Příjmení"
              required
              value={billingAddress.lastName}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  lastName: e.target.value,
                })
              }
              validateStatus={errors.billingLastName ? 'error' : 'default'}
              helpText={
                errors.billingLastName && (
                  <ErrorText>{errors.billingLastName}</ErrorText>
                )
              }
            />
          </div>

          <FormInput
            id="billing-company"
            label="Firma (nepovinné)"
            value={billingAddress.company}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, company: e.target.value })
            }
          />

          <FormInput
            id="billing-street"
            label="Ulice a číslo popisné"
            required
            value={billingAddress.street}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, street: e.target.value })
            }
            validateStatus={errors.billingStreet ? 'error' : 'default'}
            helpText={
              errors.billingStreet && (
                <ErrorText>{errors.billingStreet}</ErrorText>
              )
            }
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <FormInput
              id="billing-city"
              label="Město"
              required
              value={billingAddress.city}
              onChange={(e) =>
                setBillingAddress({ ...billingAddress, city: e.target.value })
              }
              validateStatus={errors.billingCity ? 'error' : 'default'}
              helpText={
                errors.billingCity && (
                  <ErrorText>{errors.billingCity}</ErrorText>
                )
              }
            />

            <FormInput
              id="billing-postal-code"
              label="PSČ"
              required
              value={billingAddress.postalCode}
              onChange={(e) =>
                setBillingAddress({
                  ...billingAddress,
                  postalCode: e.target.value,
                })
              }
              validateStatus={errors.billingPostalCode ? 'error' : 'default'}
              helpText={
                errors.billingPostalCode && (
                  <ErrorText>{errors.billingPostalCode}</ErrorText>
                )
              }
            />
          </div>

          <div className="max-w-[20rem] mb-4 sm:mb-6">
            <Select
              options={countries}
              value={[billingAddress.country]}
              onValueChange={(details) =>
                setBillingAddress({
                  ...billingAddress,
                  country: details.value[0],
                })
              }
              required
            />
          </div>
        </div>
      )}
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        Pokračovat
      </Button>
    </form>
  )
}
