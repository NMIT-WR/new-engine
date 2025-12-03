'use client'

import { useCreateAddress, useUpdateAddress } from '@/hooks/use-addresses'
import { useToast } from '@/hooks/use-toast'
import { AddressValidationError } from '@/lib/errors'
import type { StoreCustomerAddress } from '@/services/customer-service'
import {
  DEFAULT_ADDRESS,
  addressToFormData,
} from '@/utils/address-helpers'
import type { AddressFormData } from '@/utils/address-validation'
import {
  cleanPhoneNumber,
  formatPhoneNumber,
} from '@/utils/format/format-phone-number'
import {
  cleanPostalCode,
  formatPostalCode,
} from '@/utils/format/format-postal-code'
import { Button } from '@ui/atoms/button'
import { useForm } from 'react-hook-form'
import { AddressFormFields } from './address-form-fields'

// ============================================================================
// Types
// ============================================================================

interface AddressFormProps {
  /** Existing address to edit (undefined for new address) */
  address?: StoreCustomerAddress
  /** Called when form is cancelled */
  onCancel: () => void
  /** Called after successful save */
  onSuccess: () => void
}

// ============================================================================
// Component
// ============================================================================

/**
 * Standalone address form for creating/editing addresses.
 * Used in profile page address list.
 *
 * Features:
 * - React Hook Form with inline validation
 * - Auto-formatting for phone and postal code
 * - Error handling with AddressValidationError
 * - Create/update mutation handling
 */
export function AddressForm({ address, onCancel, onSuccess }: AddressFormProps) {
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const toaster = useToast()

  const isEditing = !!address
  const isPending = createAddress.isPending || updateAddress.isPending

  // Initialize form with existing address or defaults
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      ...DEFAULT_ADDRESS,
      ...addressToFormData(address),
      // Format display values
      postal_code: formatPostalCode(address?.postal_code || ''),
      phone: formatPhoneNumber(address?.phone || ''),
    },
    mode: 'onBlur',
  })

  // Handle form submission
  const onSubmit = async (data: AddressFormData) => {
    // Clean data before sending to API
    const cleanedData = {
      ...data,
      postal_code: cleanPostalCode(data.postal_code),
      phone: cleanPhoneNumber(data.phone || ''),
    }

    try {
      if (isEditing && address) {
        await updateAddress.mutateAsync({
          addressId: address.id,
          data: cleanedData,
        })
        toaster.create({ title: 'Adresa upravena', type: 'success' })
      } else {
        await createAddress.mutateAsync(cleanedData)
        toaster.create({ title: 'Adresa přidána', type: 'success' })
      }
      onSuccess()
    } catch (error) {
      // Handle validation errors from hooks
      if (AddressValidationError.isAddressValidationError(error)) {
        toaster.create({
          title: error.firstError,
          type: 'error',
        })
      } else {
        toaster.create({
          title: isEditing ? 'Chyba při úpravě' : 'Chyba při přidání',
          type: 'error',
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-400">
      <AddressFormFields
        control={control}
        errors={errors}
        disabled={isPending}
      />

      <div className="flex justify-end gap-200 pt-200">
        <Button
          type="button"
          theme="borderless"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          Zrušit
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Ukládám...' : isEditing ? 'Uložit' : 'Přidat'}
        </Button>
      </div>
    </form>
  )
}
