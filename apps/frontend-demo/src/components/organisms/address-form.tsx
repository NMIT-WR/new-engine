'use client'
import { useAuth } from '@/hooks/use-auth'
import { useCustomer } from '@/hooks/use-customer'
import {
  ADDRESS_ERRORS,
  COUNTRIES,
  formatPhoneNumber,
  formatPostalCode,
  validateAddress,
  validateEmail,
} from '@/lib/address'
import type { AddressData, AddressFormProps } from '@/types/checkout'
import { Button } from '@techsio/ui-kit/atoms/button'
import { ErrorText } from '@techsio/ui-kit/atoms/error-text'
import { Link } from '@techsio/ui-kit/atoms/link'
import { LinkButton } from '@techsio/ui-kit/atoms/link-button'
import { FormCheckboxRaw as FormCheckbox } from '@techsio/ui-kit/molecules/form-checkbox'
import { FormInputRaw as FormInput } from '@techsio/ui-kit/molecules/form-input'
import { Select } from '@techsio/ui-kit/molecules/select'
import { useEffect, useState } from 'react'

export function AddressForm({
  onComplete,
  isLoading = false,
}: AddressFormProps) {
  const { user } = useAuth()
  const { address, isLoading: isAddressLoading } = useCustomer()

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: address?.street || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'cz',
    company: user?.company_name || '',
  })

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: address?.street || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'cz',
    company: user?.company_name || '',
  })

  useEffect(() => {
    if (address) {
      setShippingAddress((prev) => ({
        ...prev,
        street: address.street || prev.street,
        city: address.city || prev.city,
        postalCode: address.postalCode || prev.postalCode,
        country: address.country || prev.country,
      }))
    }
  }, [address?.street, address?.city, address?.postalCode, address?.country])

  const [useSameAddress, setUseSameAddress] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    let newErrors: Record<string, string> = {}

    // Validate shipping address (with email and phone required)
    const shippingErrors = validateAddress(shippingAddress, {
      requireEmail: true,
      requirePhone: true,
      prefix: 'shipping',
    })
    newErrors = { ...newErrors, ...shippingErrors }

    // Validate billing address if different (without email and phone)
    if (!useSameAddress) {
      const billingErrors = validateAddress(billingAddress, {
        requireEmail: false,
        requirePhone: false,
        prefix: 'billing',
      })
      newErrors = { ...newErrors, ...billingErrors }
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

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div>
          <h3 className="mb-1 font-semibold text-fg-primary sm:mb-2 sm:text-lg">
            Doručovací adresa
          </h3>
          <p className="mb-3 text-fg-secondary text-xs sm:mb-4 sm:text-sm">
            Pole označená <span className="text-red-500">*</span> jsou povinná
          </p>
        </div>

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
            label="Země"
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
              label="Země"
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
      <div className="flex w-full justify-between">
        <LinkButton variant="primary" size="sm" as={Link} href="/cart">
          Zpět do košíku
        </LinkButton>
        <Button
          type="submit"
          size="sm"
          isLoading={isLoading}
          disabled={isLoading}
          //className="w-full sm:w-auto"
        >
          Pokračovat
        </Button>
      </div>
    </form>
  )
}
