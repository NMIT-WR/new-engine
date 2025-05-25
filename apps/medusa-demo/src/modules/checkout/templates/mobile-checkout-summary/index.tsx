'use client'

import type { HttpTypes } from '@medusajs/types'
import * as React from 'react'

import { Icon } from '@/components/Icon'
import { convertToLocale } from '@lib/util/money'
import CheckoutSummary from '@modules/checkout/templates/checkout-summary'

const MobileCheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const { currency_code, total } = cart
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const onClickHandler = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >((event) => {
    event.preventDefault()

    const button = event.currentTarget
    const wrapper = wrapperRef.current
    if (!wrapper || !button) {
      return
    }

    const currentHeight = wrapper.clientHeight
    const isOpen = currentHeight > 0
    const newHeight = isOpen ? 0 : wrapper.scrollHeight

    wrapper.style.height = `${currentHeight}px`
    wrapper.style.overflow = 'hidden'

    requestAnimationFrame(() => {
      button.dataset.open = isOpen ? 'no' : 'yes'
      wrapper.style.height = `${newHeight}px`
    })
  }, [])

  return (
    <>
      <button
        type="button"
        className="group flex h-18 w-full items-center justify-between"
        onClick={onClickHandler}
        data-open="no"
      >
        <p>Order summary</p>
        <div className="flex items-center gap-4">
          <span>{convertToLocale({ amount: total ?? 0, currency_code })}</span>
          <Icon
            name="chevron-down"
            className="w-6 transition-transform group-data-[open=yes]:rotate-180"
          />
        </div>
      </button>
      <div
        className="overflow-hidden transition-[height]"
        ref={wrapperRef}
        style={{
          height: '0px',
        }}
      >
        <div className="py-8">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </>
  )
}

export default MobileCheckoutSummary
