'use client'

import type { HttpTypes } from '@medusajs/types'
import { Button } from '@ui/atoms/button'
import { Dialog } from '@ui/molecules/dialog'
import { FormInput } from '@ui/molecules/form-input'
import { Select } from '@ui/molecules/select'
import { useEffect, useState } from 'react'

export interface AddressFormData {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  postal_code: string
  country_code: string
  phone?: string
}

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  initialData?: Partial<HttpTypes.StoreCartAddress>
  onSubmit: (data: AddressFormData) => Promise<void>
  isSubmitting?: boolean
  mode?: 'add' | 'edit'
}

const COUNTRY_OPTIONS = [
  { value: 'cz', label: 'Czech Republic', displayValue: 'Czech Republic' },
  { value: 'sk', label: 'Slovakia', displayValue: 'Slovakia' },
]

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

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddressFormData, string>>
  >({})
  const [touched, setTouched] = useState<
    Partial<Record<keyof AddressFormData, boolean>>
  >({})

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

  const validateField = (
    field: keyof AddressFormData,
    value: string
  ): string | undefined => {
    switch (field) {
      case 'first_name': {
        if (!value.trim()) {
          return 'First name is required'
        }
        if (value.length < 2) {
          return 'First name must be at least 2 characters'
        }
        break
      }
      case 'last_name': {
        if (!value.trim()) {
          return 'Last name is required'
        }
        if (value.length < 2) {
          return 'Last name must be at least 2 characters'
        }
        break
      }
      case 'address_1': {
        if (!value.trim()) {
          return 'Address is required'
        }
        if (value.length < 5) {
          return 'Please enter a valid address'
        }
        break
      }
      case 'city': {
        if (!value.trim()) {
          return 'City is required'
        }
        if (value.length < 2) {
          return 'Please enter a valid city'
        }
        break
      }
      case 'postal_code': {
        if (!value.trim()) {
          return 'Postal code is required'
        }
        // Czech postal code format: XXX XX
        if (
          formData.country_code === 'cz' &&
          !/^\d{3}\s?\d{2}$/.test(value.replace(/\s/g, ''))
        ) {
          return 'Enter valid Czech postal code (e.g., 110 00)'
        }
        // Slovak postal code format: XXX XX
        if (
          formData.country_code === 'sk' &&
          !/^\d{3}\s?\d{2}$/.test(value.replace(/\s/g, ''))
        ) {
          return 'Enter valid Slovak postal code (e.g., 811 01)'
        }
        break
      }
      case 'phone':
        if (value && !/^\+?[\d\s()-]+$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        break
    }
    return undefined
  }

  const handleFieldChange = (field: keyof AddressFormData, value: string) => {
    // Auto-format postal code
    if (field === 'postal_code') {
      const cleaned = value.replace(/\s/g, '')
      if (cleaned.length === 5) {
        value = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleFieldBlur = (field: keyof AddressFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldValue = formData[field] || ''
    const error = validateField(field, fieldValue)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {}

    // Required fields
    const requiredFields: (keyof AddressFormData)[] = [
      'first_name',
      'last_name',
      'address_1',
      'city',
      'postal_code',
    ]

    requiredFields.forEach((field) => {
      const fieldValue = formData[field] || ''
      const error = validateField(field, fieldValue)
      if (error) {
        newErrors[field] = error
      }
    })

    // Optional fields
    if (formData.phone) {
      const phoneError = validateField('phone', formData.phone)
      if (phoneError) {
        newErrors.phone = phoneError
      }
    }

    setErrors(newErrors)
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    )

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
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
