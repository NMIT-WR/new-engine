import type { ProductDetail, ProductVariantDetail } from '@/types/product'
import { Button } from '@new-engine/ui/atoms/button'
import { NumericInput } from '@new-engine/ui/atoms/numeric-input'
import { slugify } from '@new-engine/ui/utils'

export const AddToCartSection = ({
  selectedVariant,
  detail,
}: {
  selectedVariant: ProductVariantDetail
  detail: ProductDetail
}) => {
  return (
    <div className="flex gap-200">
      <NumericInput
        id={`${slugify(detail.title)}-number-input`}
        min={1}
        max={selectedVariant.inventory_quantity}
        allowOverflow={false}
        allowMouseWheel={true}
        defaultValue={1}
      >
        <NumericInput.DecrementTrigger />

        <NumericInput.Control className="w-12">
          <NumericInput.Input />
        </NumericInput.Control>
        <NumericInput.IncrementTrigger />
      </NumericInput>
      <Button variant="secondary">Přidat do košíku</Button>
    </div>
  )
}
