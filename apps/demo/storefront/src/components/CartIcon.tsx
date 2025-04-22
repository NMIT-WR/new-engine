import { Suspense } from "react"
import { getCartQuantity } from "@lib/data/cart"
import { Icon, IconProps } from "@/components/Icon"

const CartIconWithQuantity: React.FC<
  Omit<IconProps, "status" | "name">
> = async (props) => {
  const quantity = await getCartQuantity()

  return (
    <Icon name="case" status={quantity > 0 ? quantity : undefined} {...props} />
  )
}

export const CartIcon: React.FC<Omit<IconProps, "status" | "name">> = (
  props
) => {
  return (
    <Suspense fallback={<Icon name="case" {...props} />}>
      <CartIconWithQuantity {...props} />
    </Suspense>
  )
}