'use client'

import { COUNTRY_OPTIONS } from '@/lib/constants'
import type {
  AddressErrors,
  AddressFieldKey,
  AddressFormData,
  AddressTouched,
} from '@/utils/address-validation'
import {
  validateAddressField,
  validateAddressForm,
} from '@/utils/address-validation'
import { formatPostalCode } from '@/utils/format/format-postal-code'
import type { HttpTypes } from '@medusajs/types'
import { Button } from '@ui/atoms/button'
import { Dialog } from '@ui/molecules/dialog'
import { FormInput } from '@ui/molecules/form-input'
import { Select } from '@ui/molecules/select'
import { useEffect, useState } from 'react'

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  initialData?: Partial<HttpTypes.StoreCartAddress>
  onSubmit: (data: AddressFormData) => Promise<void>
  isSubmitting?: boolean
  mode?: 'add' | 'edit'
}

export function AddressFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = 'add',
}: AddressFormDialogProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    postal_code: '',
    country_code: 'cz',
    phone: '',
  })

  const [errors, setErrors] = useState<AddressErrors>({})
  const [touched, setTouched] = useState<AddressTouched>({})

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        address_1: initialData.address_1 || '',
        address_2: initialData.address_2 || '',
        city: initialData.city || '',
        postal_code: initialData.postal_code || '',
        country_code: initialData.country_code || 'cz',
        phone: initialData.phone || '',
      })
    }
  }, [initialData])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setErrors({})
      setTouched({})
    }
  }, [open])

  const handleFieldChange = (field: AddressFieldKey, value: string) => {
    // Auto-format postal code using centralized function
    if (field === 'postal_code') {
      value = formatPostalCode(value)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing - use centralized validation
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

  const handleValidateForm = (): boolean => {
    // Use centralized validation
    const newErrors = validateAddressForm(formData)

    setErrors(newErrors)
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    )

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!handleValidateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      onOpenChange({ open: false })
    } catch (_error) {}
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      customTrigger
      title={mode === 'edit' ? 'Edit Shipping Address' : 'Add Shipping Address'}
      description="Please provide your shipping details for order delivery."
      placement="center"
      size="md"
      modal
      closeOnEscape={!isSubmitting}
      closeOnInteractOutside={!isSubmitting}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => onOpenChange({ open: false })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Address'
                : 'Add Address'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-400">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-300">
          <FormInput
            id="first_name"
            label="First Name"
            placeholder="John"
            value={formData.first_name}
            onChange={(e) => handleFieldChange('first_name', e.target.value)}
            onBlur={() => handleFieldBlur('first_name')}
            validateStatus={errors.first_name ? 'error' : 'default'}
            helpText={errors.first_name}
            required
          />
          <FormInput
            id="last_name"
            label="Last Name"
            placeholder="Doe"
            value={formData.last_name}
            onChange={(e) => handleFieldChange('last_name', e.target.value)}
            onBlur={() => handleFieldBlur('last_name')}
            validateStatus={errors.last_name ? 'error' : 'default'}
            helpText={errors.last_name}
            required
          />
        </div>

        {/* Address fields */}
        <FormInput
          id="address_1"
          label="Address Line 1"
          placeholder="Street address"
          value={formData.address_1}
          onChange={(e) => handleFieldChange('address_1', e.target.value)}
          onBlur={() => handleFieldBlur('address_1')}
          validateStatus={errors.address_1 ? 'error' : 'default'}
          helpText={errors.address_1}
          required
        />

        <FormInput
          id="address_2"
          label="Address Line 2"
          placeholder="Apartment, suite, etc. (optional)"
          value={formData.address_2}
          onChange={(e) => handleFieldChange('address_2', e.target.value)}
        />

        {/* City and Postal Code */}
        <div className="grid grid-cols-2 gap-300">
          <FormInput
            id="city"
            label="City"
            placeholder="Prague"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            onBlur={() => handleFieldBlur('city')}
            validateStatus={errors.city ? 'error' : 'default'}
            helpText={errors.city}
            required
          />
          <FormInput
            id="postal_code"
            label="Postal Code"
            placeholder={formData.country_code === 'cz' ? '110 00' : '811 01'}
            value={formData.postal_code}
            onChange={(e) => handleFieldChange('postal_code', e.target.value)}
            onBlur={() => handleFieldBlur('postal_code')}
            validateStatus={errors.postal_code ? 'error' : 'default'}
            helpText={errors.postal_code}
            required
          />
        </div>

        {/* Country and Phone */}
        <div className="grid grid-cols-2 gap-300">
          <Select
            id="country_code"
            label="Country"
            options={COUNTRY_OPTIONS}
            value={[formData.country_code]}
            onValueChange={(details) => {
              const value = details.value[0]
              if (value) {
                handleFieldChange('country_code', value)
                // Clear postal code error when country changes
                if (errors.postal_code) {
                  handleFieldBlur('postal_code')
                }
              }
            }}
            required
          />
          <FormInput
            id="phone"
            label="Phone"
            placeholder="+420 123 456 789"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            onBlur={() => handleFieldBlur('phone')}
            validateStatus={errors.phone ? 'error' : 'default'}
            helpText={errors.phone}
          />
        </div>
      </div>
    </Dialog>
  )
}
