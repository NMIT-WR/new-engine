'use client'

import { useCreateAddress, useUpdateAddress } from '@/hooks/use-addresses'
import { Button } from '@ui/atoms/button'
import { useState } from 'react'
import { useFormState } from 'react-hook-form'
import {
  type CheckoutFormData,
  useCheckoutContext,
  useCheckoutForm,
} from '../_context/checkout-context'

/**
 * Panel for saving address changes to customer profile.
 * Shows only when:
 * - Customer is logged in
 * - Form has been modified (isDirty)
 */
export function SaveAddressPanel() {
  const { customer, selectedAddressId } = useCheckoutContext()
  const { watch, reset, control } = useCheckoutForm()

  // Use useFormState for reliable isDirty tracking
  const { isDirty } = useFormState<CheckoutFormData>({ control })

  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'success' | 'error'
  >('idle')

  // Mutations
  const { mutateAsync: createAddressAsync } = useCreateAddress()
  const { mutateAsync: updateAddressAsync } = useUpdateAddress()

  // Watch form values
  const formValues = watch('shippingAddress')

  // Don't render if not logged in or form hasn't been modified
  if (!customer || !isDirty) {
    return null
  }

  const handleSaveNew = async () => {
    setSaveStatus('saving')
    try {
      await createAddressAsync(formValues)
      reset({ shippingAddress: formValues }) // Clear isDirty
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleUpdate = async () => {
    if (!selectedAddressId) return
    setSaveStatus('saving')
    try {
      await updateAddressAsync({
        addressId: selectedAddressId,
        data: formValues,
      })
      reset({ shippingAddress: formValues }) // Clear isDirty
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <div className="mt-400 flex flex-wrap items-center gap-300 rounded border border-info bg-info-light p-300">
      <span className="text-fg-secondary text-sm">
        {saveStatus === 'saving' && 'Ukládání...'}
        {saveStatus === 'success' && '✓ Uloženo'}
        {saveStatus === 'error' && 'Nepodařilo se uložit'}
        {saveStatus === 'idle' && 'Uložit změny do profilu?'}
      </span>

      {saveStatus === 'idle' && (
        <div className="flex gap-200">
          <Button
            type="button"
            variant="tertiary"
            theme="borderless"
            size="sm"
            onClick={handleSaveNew}
          >
            Uložit jako novou
          </Button>
          {selectedAddressId && (
            <Button
              type="button"
              variant="tertiary"
              theme="borderless"
              size="sm"
              onClick={handleUpdate}
            >
              Aktualizovat
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
