import type { HttpTypes } from '@medusajs/types'
import { Text } from '@medusajs/ui'

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  'data-testid'?: string
  'data-value'?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  'data-testid': dataTestid,
  'data-value': dataValue,
}: LineItemOptionsProps) => {
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="txt-medium inline-block w-full overflow-hidden text-ellipsis text-ui-fg-subtle"
    >
      Variant: {variant?.title}
    </Text>
  )
}

export default LineItemOptions
