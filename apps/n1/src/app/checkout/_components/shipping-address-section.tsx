'use client'

import { useAuth } from '@/hooks/use-auth'
import { useUpdateCartAddress } from '@/hooks/use-update-cart-address'
import type { AddressFormData } from '@/schemas/address.schema'
import type { Cart } from '@/services/cart-service'
import { formatAddressForDisplay } from '@/utils/formatters'
import { Badge } from '@ui/atoms/badge'
import { Button } from '@ui/atoms/button'
import { useState } from 'react'
import { AddressFormDialog } from './address-form-dialog'

interface ShippingAddressSectionProps {
  cart: Cart
}

export function ShippingAddressSection({ cart }: ShippingAddressSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { customer } = useAuth()
  const hasAddress = !!cart.shipping_address

  const { mutate: updateAddress, isPending: isUpdating } = useUpdateCartAddress(
    {
      onSuccess: () => {
        setIsDialogOpen(false)
      },
    }
  )

  const handleAddressSubmit = async (data: AddressFormData) => {
    if (!cart.id) {
      return
    }

    return new Promise<void>((resolve, reject) => {
      updateAddress(
        {
          cartId: cart.id,
          address: data,
        },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        }
      )
    })
  }

  const addressLines = cart.shipping_address
    ? formatAddressForDisplay(cart.shipping_address)
    : []

  return (
    <>
      <section className="rounded border border-border-primary bg-surface p-400">
        <div className="mb-400 flex items-center justify-between">
          <div className="flex items-center gap-200">
            <h2 className="font-semibold text-fg-primary text-lg">
              Shipping Address
            </h2>
            {hasAddress && <Badge variant="success">Added</Badge>}
          </div>

          {hasAddress ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              Edit Address
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              Add Address
            </Button>
          )}
        </div>

        {hasAddress && addressLines.length > 0 ? (
          <div className="[&>*+*]:mt-50">
            {addressLines.map((line, index) => (
              <p key={index} className="text-fg-secondary text-sm">
                {line}
              </p>
            ))}
            {cart.shipping_address?.phone && (
              <p className="text-fg-secondary text-sm">
                Phone: {cart.shipping_address.phone}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded bg-overlay p-300">
            <p className="text-fg-secondary text-sm">
              {customer
                ? 'Please add your shipping address to continue with checkout.'
                : 'Add your shipping address to calculate shipping costs and complete your order.'}
            </p>
            {!hasAddress && (
              <Button
                variant="primary"
                size="sm"
                className="mt-300"
                onClick={() => setIsDialogOpen(true)}
              >
                Add Shipping Address
              </Button>
            )}
          </div>
        )}
      </section>

      <AddressFormDialog
        open={isDialogOpen}
        onOpenChange={(details) => setIsDialogOpen(details.open)}
        initialData={
          cart.shipping_address
            ? {
                ...cart.shipping_address,
                country_code: cart.shipping_address.country_code as 'cz' | 'sk',
              }
            : null
        }
        onSubmit={handleAddressSubmit}
        isSubmitting={isUpdating}
        mode={hasAddress ? 'edit' : 'add'}
      />
    </>
  )
}
