'use client'

import { Badge } from '@new-engine/ui/atoms/badge'
import { Icon } from '@new-engine/ui/atoms/icon'
import { Popover } from '@new-engine/ui/molecules/popover'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { useHeaderContext } from './store/header-context'
import { CartContent } from './cart-content'

export const CartPopover = () => {
  const { isCartOpen, toggleCart } = useHeaderContext()
  const { isAuthenticated } = useAuth()
  const { data: cart, isLoading } = useCart()

  const itemCount = cart?.items?.length || 0

  return (
    <Popover
      id="cart-popover"
      trigger={
        <div className="relative">
          <Icon icon="icon-[mdi--shopping-cart-outline]" />
          {itemCount > 0 && (
            <Badge
              variant="primary"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-white"
            >
              {itemCount > 99 ? '99+' : itemCount.toString()}
            </Badge>
          )}
        </div>
      }
      open={isCartOpen}
      onOpenChange={toggleCart}
      triggerClassName="text-2xl"
      gutter={12}
      placement="bottom-end"
      contentClassName="w-[400px] max-w-[calc(100vw-2rem)]"
      title={itemCount > 0 ? `Košík (${itemCount})` : 'Košík'}
      shadow={false}
    >
      <CartContent
        cart={cart}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        onClose={toggleCart}
      />
    </Popover>
  )
}