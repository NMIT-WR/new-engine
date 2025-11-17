'use client'
import { useCart } from '@/hooks/use-cart'
import { Badge } from '@new-engine/ui/atoms/badge'
import { Icon } from '@new-engine/ui/atoms/icon'
import { Popover } from '@new-engine/ui/molecules/popover'
import { CartContent } from './cart-content'
import { useHeaderContext } from './store/header-context'

export const CartPopover = () => {
  const { isCartOpen, toggleCart, setIsCartOpen } = useHeaderContext()
  const { cart, isLoading, itemCount } = useCart()

  const handleHover = () => {
    toggleCart()
    setIsCartOpen(true)
  }

  return (
    <div onMouseEnter={handleHover}>
      <Popover
        id="cart-popover"
        trigger={
          <div className="relative">
            <Icon
              icon="icon-[mdi--shopping-cart-outline]"
              className="text-fg-reverse hover:text-primary"
            />
            {itemCount > 0 && (
              <Badge
                variant="primary"
                className="-right-2 -top-1 absolute flex h-5 w-5 items-center rounded-full bg-primary text-3xs text-fg-primary"
              >
                {itemCount > 99 ? '99+' : itemCount.toString()}
              </Badge>
            )}
          </div>
        }
        open={isCartOpen}
        onOpenChange={toggleCart}
        triggerClassName="text-3xl px-0 py-0 hover:bg-transparent"
        gutter={12}
        placement="bottom-end"
        contentClassName="w-sm max-w-[calc(100vw-2rem)]"
        title={itemCount > 0 ? `Košík (${itemCount})` : 'Košík'}
        shadow={false}
        portalled={false}
      >
        <CartContent cart={cart} isLoading={isLoading} onClose={toggleCart} />
      </Popover>
    </div>
  )
}
