import { Icon, type IconProps } from '@/components/Icon'
import { getCartQuantity } from '@lib/data/cart'
import React from 'react'

const CartIconWithQuantity: React.FC<
  Omit<IconProps, 'status' | 'name'>
> = async (props) => {
  const quantity = await getCartQuantity()

  return (
    <Icon name="case" status={quantity > 0 ? quantity : undefined} {...props} />
  )
}

export const CartIcon: React.FC<Omit<IconProps, 'status' | 'name'>> = (
  props
) => {
  return (
    <React.Suspense fallback={<Icon name="case" {...props} />}>
      <CartIconWithQuantity {...props} />
    </React.Suspense>
  )
}
