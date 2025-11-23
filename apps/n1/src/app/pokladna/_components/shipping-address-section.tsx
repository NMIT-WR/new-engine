'use client'

import { FormField } from '@/components/molecules/form-field'
import { useAddresses } from '@/hooks/use-addresses'
import { useAuth } from '@/hooks/use-auth'
import { useCartToast } from '@/hooks/use-toast'
import { useUpdateCartAddress } from '@/hooks/use-update-cart-address'
import type { Cart } from '@/services/cart-service'
import {
  cartAddressToFormData,
  customerAddressToFormData,
  getDefaultAddress,
} from '@/utils/address-helpers'
import {
  type AddressErrors,
  type AddressFieldKey,
  type AddressFormData,
  type AddressTouched,
  formatPostalCode,
  isAddressFormValid,
  validateAddressField,
  validateAddressForm,
} from '@/utils/address-validation'
import { Button } from '@ui/atoms/button'
import { Select } from '@ui/molecules/select'
import { useEffect, useMemo, useState } from 'react'

interface ShippingAddressSectionProps {
  cart: Cart
}

const COUNTRY_OPTIONS = [
  { value: 'cz', label: 'Česká republika', displayValue: 'Česká republika' },
  { value: 'sk', label: 'Slovensko', displayValue: 'Slovensko' },
]

export function ShippingAddressSection({ cart }: ShippingAddressSectionProps) {
  const { customer } = useAuth()
  const { data: addressesData } = useAddresses()
  const addresses = addressesData?.addresses || []
  const toast = useCartToast()

  // Initialize form data with priority: cart address > customer default > empty
  const [formData, setFormData] = useState<AddressFormData>(() => {
    // Priority 1: Cart shipping address (already set)
    if (cart.shipping_address) {
      return cartAddressToFormData(cart.shipping_address) as AddressFormData
    }

    // Priority 2: Customer default address
    const defaultAddress = getDefaultAddress(addresses)
    if (defaultAddress) {
      return customerAddressToFormData(defaultAddress) as AddressFormData
    }

    // Priority 3: Empty form with CZ default
    return {
      first_name: '',
      last_name: '',
      company: '',
      address_1: '',
      address_2: '',
      city: '',
      province: '',
      postal_code: '',
      country_code: 'cz',
      phone: '',
    }
  })

  const [errors, setErrors] = useState<AddressErrors>({})
  const [touched, setTouched] = useState<AddressTouched>({})
  const [isDirty, setIsDirty] = useState(false)

  // Update form when customer addresses load
  useEffect(() => {
    // Only update if form is empty and we don't have cart address
    if (
      !cart.shipping_address &&
      !formData.first_name &&
      addresses.length > 0
    ) {
      const defaultAddress = getDefaultAddress(addresses)
      if (defaultAddress) {
        setFormData(
          customerAddressToFormData(defaultAddress) as AddressFormData
        )
      }
    }
  }, [addresses, cart.shipping_address, formData.first_name])

  // Manual save mutation
  const { mutate: updateAddress, isPending: isUpdating } =
    useUpdateCartAddress()

  // Check if form is valid (for button disabled state)
  const isFormValid = useMemo(
    () => isAddressFormValid(formData),
    [formData]
  )

  // Handle manual save
  const handleSaveAddress = () => {
    // Validate before saving
    const validationErrors = validateAddressForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as AddressTouched
      )
      setTouched(allTouched)
      setErrors(validationErrors)

      // Show validation warning toast
      const errorFields = Object.keys(validationErrors)
      toast.shippingAddressValidation(errorFields)
      return
    }

    // Save to cart with toast notifications
    updateAddress(
      {
        cartId: cart.id,
        address: formData,
      },
      {
        onSuccess: () => {
          toast.shippingAddressSuccess()
          setIsDirty(false)
        },
        onError: () => {
          toast.shippingAddressError()
        },
      }
    )
  }

  const handleFieldChange = (field: AddressFieldKey, value: string) => {
    // Auto-format postal code
    if (field === 'postal_code') {
      value = formatPostalCode(value)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)

    // Clear error when user starts typing
    if (touched[field]) {
      const error = validateAddressField(field, value, formData.country_code)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleFieldBlur = (field: AddressFieldKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldValue = formData[field] || ''
    const error = validateAddressField(field, fieldValue, formData.country_code)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  return (
    <section className="rounded border border-border-secondary bg-surface/70 p-400">
      <div className="mb-400 flex items-center justify-between">
        <h2 className="font-semibold text-fg-primary text-lg">
          Doručovací adresa
        </h2>
      </div>

      <form className="flex flex-col gap-400">
        {/* First name | Last name */}
        <div className="grid grid-cols-2 gap-300">
          <FormField
            id="first_name"
            label="Jméno"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={(e) => handleFieldChange('first_name', e.target.value)}
            onBlur={() => handleFieldBlur('first_name')}
            errorMessage={errors.first_name}
            required
            disabled={isUpdating}
          />
          <FormField
            id="last_name"
            label="Příjmení"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={(e) => handleFieldChange('last_name', e.target.value)}
            onBlur={() => handleFieldBlur('last_name')}
            errorMessage={errors.last_name}
            required
            disabled={isUpdating}
          />
        </div>

        {/* Company (optional) */}
        <FormField
          id="company"
          label="Firma (volitelné)"
          name="company"
          type="text"
          value={formData.company || ''}
          onChange={(e) => handleFieldChange('company', e.target.value)}
          disabled={isUpdating}
        />

        {/* Address */}
        <FormField
          id="address_1"
          label="Adresa"
          name="address_1"
          type="text"
          value={formData.address_1}
          onChange={(e) => handleFieldChange('address_1', e.target.value)}
          onBlur={() => handleFieldBlur('address_1')}
          errorMessage={errors.address_1}
          required
          disabled={isUpdating}
          placeholder="Ulice a číslo popisné"
        />

        {/* Apartment, suite, etc. (optional) */}
        <FormField
          id="address_2"
          label="Byt, apartmá atd. (volitelné)"
          name="address_2"
          type="text"
          value={formData.address_2 || ''}
          onChange={(e) => handleFieldChange('address_2', e.target.value)}
          disabled={isUpdating}
        />

        {/* City | Country */}
        <div className="grid grid-cols-2 gap-300">
          <FormField
            id="city"
            label="Město"
            name="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            onBlur={() => handleFieldBlur('city')}
            errorMessage={errors.city}
            required
            disabled={isUpdating}
          />
          <Select
            id="country_code"
            label="Země"
            size="lg"
            clearIcon={false}
            options={COUNTRY_OPTIONS}
            value={[formData.country_code]}
            onValueChange={(details) => {
              const value = details.value[0]
              if (value) {
                handleFieldChange('country_code', value)
                // Re-validate postal code when country changes
                if (errors.postal_code) {
                  handleFieldBlur('postal_code')
                }
              }
            }}
            disabled={isUpdating}
            className="grid grid-rows-[auto_1fr] [&_button]:h-full [&_button]:items-center"
          />
        </div>

        {/* State/Province | Postal code */}
        <div className="grid grid-cols-2 gap-300">
          <FormField
            id="province"
            label="Kraj (volitelné)"
            name="province"
            type="text"
            value={formData.province || ''}
            onChange={(e) => handleFieldChange('province', e.target.value)}
            disabled={isUpdating}
          />
          <FormField
            id="postal_code"
            label="PSČ"
            name="postal_code"
            type="text"
            value={formData.postal_code}
            onChange={(e) => handleFieldChange('postal_code', e.target.value)}
            onBlur={() => handleFieldBlur('postal_code')}
            errorMessage={errors.postal_code}
            required
            disabled={isUpdating}
            placeholder={formData.country_code === 'cz' ? '110 00' : '811 01'}
          />
        </div>

        {/* Phone */}
        <FormField
          id="phone"
          label="Telefon (volitelné)"
          name="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleFieldChange('phone', e.target.value)}
          onBlur={() => handleFieldBlur('phone')}
          errorMessage={errors.phone}
          disabled={isUpdating}
          placeholder="+420 123 456 789"
        />
      </form>

      {/* Save button - show only when form has changes */}

      <Button
        onClick={handleSaveAddress}
        disabled={isUpdating || !isFormValid || !isDirty}
        variant="primary"
        className="mt-400 border"
      >
        {isUpdating ? 'Ukládám...' : 'Uložit adresu'}
      </Button>

      {/* Info text */}
      {!customer && (
        <p className="mt-400 text-fg-tertiary text-sm">
          💡 Přihlaste se pro uložení adresy do svého účtu
        </p>
      )}
    </section>
  )
}
