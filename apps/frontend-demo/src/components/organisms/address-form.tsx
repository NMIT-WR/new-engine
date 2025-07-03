'use client'

import { FormInputRaw as FormInput } from '@ui/molecules/form-input'
import { FormCheckboxRaw as FormCheckbox } from '@ui/molecules/form-checkbox'
import { Select } from '@ui/molecules/select'
import { ErrorText } from '@ui/atoms/error-text'
import { useState } from 'react'
import { tv } from 'tailwind-variants'
import { Button } from '@ui/atoms/button'

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
  onComplete: (data: { shipping: AddressData; billing: AddressData; useSameAddress: boolean }) => void
  initialData?: {
    shipping?: Partial<AddressData>
    billing?: Partial<AddressData>
    useSameAddress?: boolean
  }
}

const countries = [
  { label: 'Česká republika', value: 'CZ' },
  { label: 'Slovensko', value: 'SK' },
  { label: 'Polsko', value: 'PL' },
  { label: 'Německo', value: 'DE' },
  { label: 'Rakousko', value: 'AT' },
]

const addressFormStyles = tv({
  slots: {
    root: 'flex flex-col relative',
    section: 'flex flex-col gap-5',
    title: 'text-lg font-semibold text-fg-primary mb-2',
    grid: 'grid grid-cols-2 gap-4 max-sm:grid-cols-1',
    country: 'max-w-[20rem]',
    divider: 'mt-md',
  },
})

export function AddressForm({ onComplete, initialData }: AddressFormProps) {
  const { root, section, title, grid, country, divider } = addressFormStyles()
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

  const [useSameAddress, setUseSameAddress] = useState(initialData?.useSameAddress ?? true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate shipping address
    if (!shippingAddress.firstName) newErrors.shippingFirstName = 'Jméno je povinné'
    if (!shippingAddress.lastName) newErrors.shippingLastName = 'Příjmení je povinné'
    if (!shippingAddress.email) newErrors.shippingEmail = 'Email je povinný'
    if (!shippingAddress.phone) newErrors.shippingPhone = 'Telefon je povinný'
    if (!shippingAddress.street) newErrors.shippingStreet = 'Ulice je povinná'
    if (!shippingAddress.city) newErrors.shippingCity = 'Město je povinné'
    if (!shippingAddress.postalCode) newErrors.shippingPostalCode = 'PSČ je povinné'

    // Validate billing address if different
    if (!useSameAddress) {
      if (!billingAddress.firstName) newErrors.billingFirstName = 'Jméno je povinné'
      if (!billingAddress.lastName) newErrors.billingLastName = 'Příjmení je povinné'
      if (!billingAddress.street) newErrors.billingStreet = 'Ulice je povinná'
      if (!billingAddress.city) newErrors.billingCity = 'Město je povinné'
      if (!billingAddress.postalCode) newErrors.billingPostalCode = 'PSČ je povinné'
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
    <form onSubmit={handleSubmit} className={root()}>
      <Button size='sm' className='absolute right-0' onClick={setTestInfo}>Vyplnit</Button>
      <div className={section()}>
        <h3 className={title()}>Doručovací adresa</h3>
        
        <div className={grid()}>
          <FormInput
            id="shipping-first-name"
            label="Jméno"
            required
            value={shippingAddress.firstName}
            onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
            validateStatus={errors.shippingFirstName ? 'error' : 'default'}
            helpText={errors.shippingFirstName && <ErrorText>{errors.shippingFirstName}</ErrorText>}
          />
          
          <FormInput
            id="shipping-last-name"
            label="Příjmení"
            required
            value={shippingAddress.lastName}
            onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
            validateStatus={errors.shippingLastName ? 'error' : 'default'}
            helpText={errors.shippingLastName && <ErrorText>{errors.shippingLastName}</ErrorText>}
          />
        </div>

        <FormInput
          id="shipping-company"
          label="Firma (nepovinné)"
          value={shippingAddress.company}
          onChange={(e) => setShippingAddress({ ...shippingAddress, company: e.target.value })}
        />

        <div className={grid()}>
          <FormInput
            id="shipping-email"
            label="Email"
            type="email"
            required
            value={shippingAddress.email}
            onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
            validateStatus={errors.shippingEmail ? 'error' : 'default'}
            helpText={errors.shippingEmail && <ErrorText>{errors.shippingEmail}</ErrorText>}
          />
          
          <FormInput
            id="shipping-phone"
            label="Telefon"
            type="tel"
            required
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
            validateStatus={errors.shippingPhone ? 'error' : 'default'}
            helpText={errors.shippingPhone && <ErrorText>{errors.shippingPhone}</ErrorText>}
          />
        </div>

        <FormInput
          id="shipping-street"
          label="Ulice a číslo popisné"
          required
          value={shippingAddress.street}
          onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
          validateStatus={errors.shippingStreet ? 'error' : 'default'}
          helpText={errors.shippingStreet && <ErrorText>{errors.shippingStreet}</ErrorText>}
        />

        <div className={grid()}>
          <FormInput
            id="shipping-city"
            label="Město"
            required
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            validateStatus={errors.shippingCity ? 'error' : 'default'}
            helpText={errors.shippingCity && <ErrorText>{errors.shippingCity}</ErrorText>}
          />
          
          <FormInput
            id="shipping-postal-code"
            label="PSČ"
            required
            value={shippingAddress.postalCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
            validateStatus={errors.shippingPostalCode ? 'error' : 'default'}
            helpText={errors.shippingPostalCode && <ErrorText>{errors.shippingPostalCode}</ErrorText>}
          />
        </div>

        <div className={country()}>
          <Select
            options={countries}
            value={[shippingAddress.country]}
            onValueChange={(details) => setShippingAddress({ ...shippingAddress, country: details.value[0] })}
            required
          />
        </div>
      </div>

      <div className={divider()}>
        <FormCheckbox
          id="same-address"
          label="Fakturační adresa je stejná jako doručovací"
          checked={useSameAddress}
          onCheckedChange={(details) => setUseSameAddress(details.checked as boolean)}
        />
      </div>

      {!useSameAddress && (
        <div className={section()}>
          <h3 className={title()}>Fakturační adresa</h3>
          
          <div className={grid()}>
            <FormInput
              id="billing-first-name"
              label="Jméno"
              required
              value={billingAddress.firstName}
              onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
              validateStatus={errors.billingFirstName ? 'error' : 'default'}
              helpText={errors.billingFirstName && <ErrorText>{errors.billingFirstName}</ErrorText>}
            />
            
            <FormInput
              id="billing-last-name"
              label="Příjmení"
              required
              value={billingAddress.lastName}
              onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
              validateStatus={errors.billingLastName ? 'error' : 'default'}
              helpText={errors.billingLastName && <ErrorText>{errors.billingLastName}</ErrorText>}
            />
          </div>

          <FormInput
            id="billing-company"
            label="Firma (nepovinné)"
            value={billingAddress.company}
            onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })}
          />

          <FormInput
            id="billing-street"
            label="Ulice a číslo popisné"
            required
            value={billingAddress.street}
            onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
            validateStatus={errors.billingStreet ? 'error' : 'default'}
            helpText={errors.billingStreet && <ErrorText>{errors.billingStreet}</ErrorText>}
          />

          <div className={grid()}>
            <FormInput
              id="billing-city"
              label="Město"
              required
              value={billingAddress.city}
              onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
              validateStatus={errors.billingCity ? 'error' : 'default'}
              helpText={errors.billingCity && <ErrorText>{errors.billingCity}</ErrorText>}
            />
            
            <FormInput
              id="billing-postal-code"
              label="PSČ"
              required
              value={billingAddress.postalCode}
              onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
              validateStatus={errors.billingPostalCode ? 'error' : 'default'}
              helpText={errors.billingPostalCode && <ErrorText>{errors.billingPostalCode}</ErrorText>}
            />
          </div>

          <div className={country()}>
            <Select
              options={countries}
              value={[billingAddress.country]}
              onValueChange={(details) => setBillingAddress({ ...billingAddress, country: details.value[0] })}
              required
            />
          </div>
        </div>
      )}

      <Button type="submit">Submit</Button>
    </form>
  )
}