'use client'

import { useCart } from '@/hooks/use-cart'
import { truncateProductTitle } from '@/lib/order-utils'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/price-utils'
import { Button } from '@ui/atoms/button'
import { Dialog } from '@ui/molecules/dialog'
import { Select } from '@ui/molecules/select'
import { useState } from 'react'

interface AddToCartDialogProps {
  product: Product
  open: boolean
  onOpenChange: (details: { open: boolean }) => void
}

export function AddToCartDialog({
  product,
  open,
  onOpenChange,
}: AddToCartDialogProps) {
  const { addItem, addItemMutation } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')

  const variants = product.variants || []

  const variantOptions = variants.map((variant) => {
    const variantName = variant.options
      ? Object.values(variant.options).join(' / ')
      : variant.title

    const price = variant.calculated_price
      ? formatPrice(
          variant.calculated_price.calculated_amount || 0,
          variant.calculated_price.currency_code
        )
      : ''

    return {
      value: variant.id,
      label: `${variantName}${price ? ` - ${price}` : ''}`,
    }
  })

  const handleAddToCart = () => {
    if (!selectedVariantId) {
      return
    }

    addItem(selectedVariantId)

    if (!addItemMutation.isPending) {
      onOpenChange({ open: false })
    }
  }

  const handleClose = () => {
    onOpenChange({ open: false })
    setSelectedVariantId('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      customTrigger={true}
      title="Přidat do košíku"
      description={`Vyberte variantu produktu ${truncateProductTitle(product.title)}`}
      actions={
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="secondary"
            theme="outlined"
            onClick={handleClose}
          >
            Zrušit
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleAddToCart}
            disabled={!selectedVariantId || addItemMutation.isPending}
            isLoading={addItemMutation.isPending}
          >
            Přidat do košíku
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <Select
            label="Vyberte variantu"
            value={selectedVariantId ? [selectedVariantId] : []}
            options={variantOptions}
            placeholder="Vyberte variantu..."
            onValueChange={(details) => {
              const value = details.value[0]
              if (value) {
                setSelectedVariantId(value)
              }
            }}
            clearIcon={false}
            size="sm"
            className="overflow-hidden"
          />
        </div>
      </div>
    </Dialog>
  )
}
