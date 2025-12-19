'use client'
import { ErrorBoundary } from '@/components/error-boundary'
import { useSuspenseCart } from '@/hooks/use-cart'
import { Badge } from '@techsio/ui-kit/atoms/badge'
import { Icon } from '@techsio/ui-kit/atoms/icon'
import { Popover } from '@techsio/ui-kit/molecules/popover'
import { Suspense } from 'react'
import { CartContent } from './cart-content'
import { CartEmptyState } from './cart-empty-state'
import { CartSkeleton } from './cart-skeleton'
import { useHeaderContext } from './store/header-context'

export const CartPopover = () => {
  const { isCartOpen, toggleCart, setIsCartOpen } = useHeaderContext()

  const handleHover = () => {
    toggleCart()
    setIsCartOpen(true)
  }

  return (
    <div onMouseEnter={handleHover}>
      <ErrorBoundary
        fallback={<CartPopoverErrorFallback onClose={toggleCart} />}
      >
        <Suspense fallback={<CartPopoverLoadingFallback />}>
          <CartPopoverContent onClose={toggleCart} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function CartPopoverContent({ onClose }: { onClose: () => void }) {
  const { isCartOpen, toggleCart } = useHeaderContext()
  const { cart, itemCount } = useSuspenseCart()

  return (
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
              className="-right-2 -top-1 absolute flex size-5 items-center rounded-full bg-primary text-3xs text-fg-primary"
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
      contentClassName="w-sm max-w-mobile-w"
      title={itemCount > 0 ? `Košík (${itemCount})` : 'Košík'}
      shadow={false}
      portalled={false}
    >
      <CartContent cart={cart} onClose={onClose} />
    </Popover>
  )
}

function CartPopoverLoadingFallback() {
  const { isCartOpen, toggleCart } = useHeaderContext()

  return (
    <Popover
      id="cart-popover"
      trigger={
        <div className="relative">
          <Icon
            icon="icon-[mdi--shopping-cart-outline]"
            className="text-fg-reverse hover:text-primary"
          />
        </div>
      }
      open={isCartOpen}
      onOpenChange={toggleCart}
      triggerClassName="text-3xl px-0 py-0 hover:bg-transparent"
      gutter={12}
      placement="bottom-end"
      contentClassName="w-sm max-w-mobile-w"
      title="Košík"
      shadow={false}
      portalled={false}
    >
      <CartSkeleton />
    </Popover>
  )
}

function CartPopoverErrorFallback({ onClose }: { onClose: () => void }) {
  const { isCartOpen, toggleCart } = useHeaderContext()

  return (
    <Popover
      id="cart-popover"
      trigger={
        <div className="relative">
          <Icon
            icon="icon-[mdi--shopping-cart-outline]"
            className="text-fg-reverse hover:text-primary"
          />
        </div>
      }
      open={isCartOpen}
      onOpenChange={toggleCart}
      triggerClassName="text-3xl px-0 py-0 hover:bg-transparent"
      gutter={12}
      placement="bottom-end"
      contentClassName="w-sm max-w-mobile-w"
      title="Košík"
      shadow={false}
      portalled={false}
    >
      <CartEmptyState onContinueShopping={onClose} />
    </Popover>
  )
}
