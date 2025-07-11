'use client'

import { useAuth } from '@/hooks/use-auth'
import {
  ADDRESS_ERRORS,
  COUNTRIES,
  formatPhoneNumber,
  formatPostalCode,
  getAddressFromMetadata,
  validateEmail,
  validatePhone,
  validatePostalCode,
} from '@/lib/address'
import type { AddressData, AddressFormProps } from '@/types/checkout'
import { Button } from '@ui/atoms/button'
import { ErrorText } from '@ui/atoms/error-text'
import { FormCheckboxRaw as FormCheckbox } from '@ui/molecules/form-checkbox'
import { FormInputRaw as FormInput } from '@ui/molecules/form-input'
import { Select } from '@ui/molecules/select'
import { useState } from 'react'

export function AddressForm({
  onComplete,
  initialData,
  isLoading = false,
}: AddressFormProps) {
  const { user } = useAuth()

  // Use profile data if no initial data provided
  const getInitialValue = (
    field: keyof AddressData,
    source?: Partial<AddressData>
  ) => {
    if (source?.[field]) return source[field] as string

    // Get address from metadata
    const addressData = getAddressFromMetadata(user)

    // Map user profile fields to address fields
    switch (field) {
      case 'firstName':
        return user?.first_name || ''
      case 'lastName':
        return user?.last_name || ''
      case 'email':
        return user?.email || ''
      case 'phone':
        return user?.phone || ''
      case 'company':
        return user?.company_name || ''
      case 'street':
        return addressData.street || ''
      case 'city':
        return addressData.city || ''
      case 'postalCode':
        return addressData.postal_code || ''
      case 'country':
        return addressData.country || 'cz'
      default:
        return ''
    }
  }

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    firstName: getInitialValue('firstName', initialData?.shipping),
    lastName: getInitialValue('lastName', initialData?.shipping),
    email: getInitialValue('email', initialData?.shipping),
    phone: getInitialValue('phone', initialData?.shipping),
    street: getInitialValue('street', initialData?.shipping),
    city: getInitialValue('city', initialData?.shipping),
    postalCode: getInitialValue('postalCode', initialData?.shipping),
    country: getInitialValue('country', initialData?.shipping),
    company: getInitialValue('company', initialData?.shipping),
  })

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    firstName: getInitialValue('firstName', initialData?.billing),
    lastName: getInitialValue('lastName', initialData?.billing),
    email: getInitialValue('email', initialData?.billing),
    phone: getInitialValue('phone', initialData?.billing),
    street: getInitialValue('street', initialData?.billing),
    city: getInitialValue('city', initialData?.billing),
    postalCode: getInitialValue('postalCode', initialData?.billing),
    country: getInitialValue('country', initialData?.billing),
    company: getInitialValue('company', initialData?.billing),
  })

  const [useSameAddress, setUseSameAddress] = useState(
    initialData?.useSameAddress ?? true
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Removed formatters - now imported from lib/address

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate shipping address
    if (!shippingAddress.firstName)
      newErrors.shippingFirstName = ADDRESS_ERRORS.firstName
    if (!shippingAddress.lastName)
      newErrors.shippingLastName = ADDRESS_ERRORS.lastName
    if (!shippingAddress.email) {
      newErrors.shippingEmail = ADDRESS_ERRORS.email
    } else if (!validateEmail(shippingAddress.email)) {
      newErrors.shippingEmail = ADDRESS_ERRORS.emailInvalid
    }
    if (!shippingAddress.phone) {
      newErrors.shippingPhone = ADDRESS_ERRORS.phone
    } else if (!validatePhone(shippingAddress.phone)) {
      newErrors.shippingPhone = ADDRESS_ERRORS.phoneInvalid
    }
    if (!shippingAddress.street)
      newErrors.shippingStreet = ADDRESS_ERRORS.street
    if (!shippingAddress.city) newErrors.shippingCity = ADDRESS_ERRORS.city
    if (!shippingAddress.postalCode) {
      newErrors.shippingPostalCode = ADDRESS_ERRORS.postalCode
    } else if (!validatePostalCode(shippingAddress.postalCode)) {
      newErrors.shippingPostalCode = ADDRESS_ERRORS.postalCodeInvalid
    }

    // Validate billing address if different
    if (!useSameAddress) {
      if (!billingAddress.firstName)
        newErrors.billingFirstName = ADDRESS_ERRORS.firstName
      if (!billingAddress.lastName)
        newErrors.billingLastName = ADDRESS_ERRORS.lastName
      if (!billingAddress.street)
        newErrors.billingStreet = ADDRESS_ERRORS.street
      if (!billingAddress.city) newErrors.billingCity = ADDRESS_ERRORS.city
      if (!billingAddress.postalCode)
        newErrors.billingPostalCode = ADDRESS_ERRORS.postalCode
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      country: 'cz',
      company: 'Test',
    }
    setShippingAddress(data)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col">
      <Button
        size="sm"
        className="absolute top-0 right-0 z-1"
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
              if (email && !validateEmail(email)) {
                setErrors({
                  ...errors,
                  shippingEmail: ADDRESS_ERRORS.emailInvalid,
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

        <div className="mb-4 max-w-[20rem] sm:mb-6">
          <Select
            options={COUNTRIES}
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

      <div className="mb-4 sm:mb-6">
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

          <div className="mb-4 max-w-[20rem] sm:mb-6">
            <Select
              options={COUNTRIES}
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
