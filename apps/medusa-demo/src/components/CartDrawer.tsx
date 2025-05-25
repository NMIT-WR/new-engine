'use client'

import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { Icon } from '@/components/Icon'
import { LocalizedButtonLink, LocalizedLink } from '@/components/LocalizedLink'
import { withReactQueryProvider } from '@lib/util/react-query'
import type { HttpTypes } from '@medusajs/types'
import CartTotals from '@modules/cart/components/cart-totals'
import DiscountCode from '@modules/cart/components/discount-code'
import Item from '@modules/cart/components/item'
import { getCheckoutStep } from '@modules/cart/utils/getCheckoutStep'
import { useCart, useCartQuantity } from 'hooks/cart'
import * as React from 'react'

export const CartDrawer = withReactQueryProvider(() => {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)

  const { data: cart, isPending } = useCart({ enabled: isCartDrawerOpen })

  const step = getCheckoutStep(cart as HttpTypes.StoreCart)

  const { data: quantity, isPending: pendingQuantity } = useCartQuantity()

  return (
    <>
      <Button
        onClick={() => setIsCartDrawerOpen(true)}
        variant="ghost"
        className="p-1 group-data-[light=true]:md:text-white group-data-[sticky=true]:md:text-black"
        aria-label="Open cart"
      >
        {pendingQuantity ? (
          <Icon name="case" className=" h-6 w-6" />
        ) : (
          <Icon
            name="case"
            className=" h-6 w-6"
            status={quantity && quantity > 0 ? quantity : undefined}
          />
        )}
      </Button>
      <Drawer
        colorScheme="light"
        animateFrom="right"
        isOpen={isCartDrawerOpen}
        onOpenChange={setIsCartDrawerOpen}
        className="max-w-139 px-12 pt-10 max-sm:max-w-100 max-sm:px-6"
      >
        {({ close }) => (
          <>
            <div className="mb-2 flex justify-between">
              <div>
                <p className="text-md">Cart</p>
              </div>
              <button onClick={close} aria-label="Close cart">
                <Icon name="close" className="w-6" />
              </button>
            </div>
            {cart?.items?.length ? (
              <>
                <div className="overflow-y-scroll pr-3 pb-8 sm:pr-4">
                  {cart?.items
                    .sort((a, b) => {
                      return (a.created_at ?? '') > (b.created_at ?? '')
                        ? -1
                        : 1
                    })
                    .map((item) => {
                      return (
                        <Item
                          key={item.id}
                          item={item}
                          className="py-8 last:border-b-0 last:pb-0"
                        />
                      )
                    })}
                </div>
                <div className="sticky bottom-0 left-0 mt-auto border-grayscale-200 border-t bg-white pt-4">
                  <CartTotals isPartOfCartDrawer cart={cart} />
                  <DiscountCode cart={cart} className="mt-6" />
                  <LocalizedButtonLink
                    href={`/checkout/?step=${step}`}
                    isFullWidth
                    className="mt-4"
                  >
                    Proceed to checkout
                  </LocalizedButtonLink>
                </div>
              </>
            ) : isPending ? (
              <div className="flex h-screen items-center justify-around align-middle ">
                <Icon name="loader" className="w-10 animate-spin md:w-15" />
              </div>
            ) : (
              <>
                <p className="mt-2 mb-6 max-sm:mr-10 md:text-sm">
                  You don&apos;t have anything in your cart. Let&apos;s change
                  that, use the link below to start browsing our products.
                </p>
                <div>
                  <LocalizedLink
                    href="/store"
                    onClick={() => {
                      setIsCartDrawerOpen(false)
                    }}
                  >
                    Explore products
                  </LocalizedLink>
                </div>
              </>
            )}
          </>
        )}
      </Drawer>
    </>
  )
})
