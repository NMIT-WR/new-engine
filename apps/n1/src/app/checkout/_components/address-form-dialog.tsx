'use client'

import type { AddressFormData } from '@/schemas/address.schema'
import { addressSchema } from '@/schemas/address.schema'
import { formatters } from '@/utils/formatters'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/atoms/button'
import { Input } from '@ui/atoms/input'
import { Label } from '@ui/atoms/label'
import { Dialog } from '@ui/molecules/dialog'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
  initialData?: Partial<AddressFormData> | null
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      postal_code: '',
      country_code: 'cz',
      phone: '',
      ...initialData,
    },
    mode: 'onBlur', // Validate on blur for better UX
  })

  const countryCode = watch('country_code')
  const postalCode = watch('postal_code')

  // Auto-format postal code
  useEffect(() => {
    if (postalCode && countryCode) {
      const formatted = formatters.postalCode(postalCode, countryCode)
      if (formatted !== postalCode) {
        setValue('postal_code', formatted, { shouldValidate: false })
      }
    }
  }, [postalCode, countryCode, setValue])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
      onOpenChange({ open: false })
    } catch (error) {
      // Error handled by toast notification in parent
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      customTrigger
      title={mode === 'edit' ? 'Edit Shipping Address' : 'Add Shipping Address'}
    >
      <form onSubmit={onFormSubmit} className="[&>*+*]:mt-400">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-300">
          <div>
            <Label htmlFor="first_name">
              First Name <span className="text-danger">*</span>
            </Label>
            <Input
              id="first_name"
              {...register('first_name')}
              placeholder="John"
              className="mt-100"
            />
            {errors.first_name && (
              <p className="mt-100 text-danger text-xs">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="last_name">
              Last Name <span className="text-danger">*</span>
            </Label>
            <Input
              id="last_name"
              {...register('last_name')}
              placeholder="Doe"
              className="mt-100"
            />
            {errors.last_name && (
              <p className="mt-100 text-danger text-xs">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Address fields */}
        <div>
          <Label htmlFor="address_1">
            Address Line 1 <span className="text-danger">*</span>
          </Label>
          <Input
            id="address_1"
            {...register('address_1')}
            placeholder="123 Main Street"
            className="mt-100"
          />
          {errors.address_1 && (
            <p className="mt-100 text-danger text-xs">
              {errors.address_1.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="address_2">Address Line 2</Label>
          <Input
            id="address_2"
            {...register('address_2')}
            placeholder="Apt 4B (optional)"
            className="mt-100"
          />
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-2 gap-300">
          <div>
            <Label htmlFor="city">
              City <span className="text-danger">*</span>
            </Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Prague"
              className="mt-100"
            />
            {errors.city && (
              <p className="mt-100 text-danger text-xs">
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="postal_code">
              Postal Code <span className="text-danger">*</span>
            </Label>
            <Input
              id="postal_code"
              {...register('postal_code')}
              placeholder="110 00"
              className="mt-100"
            />
            {errors.postal_code && (
              <p className="mt-100 text-danger text-xs">
                {errors.postal_code.message}
              </p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="country_code">
            Country <span className="text-danger">*</span>
          </Label>
          <select
            id="country_code"
            {...register('country_code')}
            className="mt-100 w-full rounded border border-border-primary bg-surface p-200"
          >
            <option value="cz">Czech Republic</option>
            <option value="sk">Slovakia</option>
          </select>
          {errors.country_code && (
            <p className="mt-100 text-danger text-xs">
              {errors.country_code.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            {...register('phone')}
            type="tel"
            placeholder="+420 123 456 789"
            className="mt-100"
          />
          {errors.phone && (
            <p className="mt-100 text-danger text-xs">{errors.phone.message}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-300 pt-400">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange({ open: false })}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Address'
                : 'Add Address'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
