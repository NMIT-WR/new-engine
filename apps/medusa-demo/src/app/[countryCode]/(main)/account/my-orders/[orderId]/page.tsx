import type { HttpTypes } from '@medusajs/types'
import type { Metadata } from 'next'
import Image from 'next/image'
import type * as React from 'react'

import { Icon } from '@/components/Icon'
import { LocalizedLink } from '@/components/LocalizedLink'
import { UiTag } from '@/components/ui/Tag'
import { UiTagList, UiTagListDivider } from '@/components/ui/TagList'
import { getCustomer } from '@lib/data/customer'
import { retrieveOrder } from '@lib/data/orders'
import { convertToLocale } from '@lib/util/money'
import { OrderTotals } from '@modules/order/components/OrderTotals'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Account - Order',
  description: 'Check your order history',
}

const OrderStatus: React.FC<{ order: HttpTypes.StoreOrder }> = ({ order }) => {
  if (order.fulfillment_status === 'canceled') {
    return (
      <UiTagList>
        <UiTag iconName="close" isActive className="mt-auto self-start">
          Canceled
        </UiTag>
      </UiTagList>
    )
  }

  if (order.fulfillment_status === 'delivered') {
    return (
      <UiTagList>
        <UiTag isActive iconName="package" className="mt-auto self-start">
          Packing
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="truck" className="mt-auto self-start">
          Delivering
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="check" className="mt-auto self-start">
          Delivered
        </UiTag>
      </UiTagList>
    )
  }

  if (
    order.fulfillment_status === 'shipped' ||
    order.fulfillment_status === 'partially_delivered'
  ) {
    return (
      <UiTagList>
        <UiTag isActive iconName="package" className="mt-auto self-start">
          Packing
        </UiTag>
        <UiTagListDivider />
        <UiTag isActive iconName="truck" className="mt-auto self-start">
          Delivering
        </UiTag>
        <UiTagListDivider />
        <UiTag iconName="check" className="mt-auto self-start">
          Delivered
        </UiTag>
      </UiTagList>
    )
  }

  return (
    <UiTagList>
      <UiTag isActive iconName="package" className="mt-auto self-start">
        Packing
      </UiTag>
      <UiTagListDivider />
      <UiTag iconName="truck" className="mt-auto self-start">
        Delivering
      </UiTag>
      <UiTagListDivider />
      <UiTag iconName="check" className="mt-auto self-start">
        Delivered
      </UiTag>
    </UiTagList>
  )
}

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect(`/`)
  }

  const { orderId } = await params
  const order = await retrieveOrder(orderId)

  return (
    <>
      <h1 className="mb-8 text-md md:mb-16 md:text-lg">
        Order: {order.display_id}
      </h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap justify-between rounded-xs border border-grayscale-200 p-4">
          <div className="flex items-center gap-4">
            <Icon name="calendar" />
            <p className="text-grayscale-500">Order date</p>
          </div>
          <div>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="rounded-xs border border-grayscale-200 p-4">
          <div className="flex w-full flex-wrap items-end justify-between gap-x-10 gap-y-8">
            <OrderStatus order={order} />
          </div>
        </div>
        <div className="flex gap-x-4 gap-y-6 max-sm:flex-col md:flex-col lg:flex-row">
          <div className="flex-1 overflow-hidden rounded-xs border border-grayscale-200 p-4">
            <div className="mb-8 flex items-center gap-4">
              <Icon name="map-pin" />
              <p className="text-grayscale-500">Delivery address</p>
            </div>
            <div>
              <p>
                {[
                  order.shipping_address?.first_name,
                  order.shipping_address?.last_name,
                ]
                  .filter(Boolean)
                  .join(' ')}
              </p>
              {Boolean(order.shipping_address?.company) && (
                <p>{order.shipping_address?.company}</p>
              )}
              <p>
                {[
                  order.shipping_address?.address_1,
                  order.shipping_address?.address_2,
                  [
                    order.shipping_address?.postal_code,
                    order.shipping_address?.city,
                  ]
                    .filter(Boolean)
                    .join(' '),
                  order.shipping_address?.country?.display_name,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {Boolean(order.shipping_address?.phone) && (
                <p>{order.shipping_address?.phone}</p>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden rounded-xs border border-grayscale-200 p-4">
            <div className="mb-8 flex items-center gap-4">
              <Icon name="receipt" />
              <p className="text-grayscale-500">Billing address</p>
            </div>
            <div>
              <p>
                {[
                  order.billing_address?.first_name,
                  order.billing_address?.last_name,
                ]
                  .filter(Boolean)
                  .join(' ')}
              </p>
              {Boolean(order.billing_address?.company) && (
                <p>{order.billing_address?.company}</p>
              )}
              <p>
                {[
                  order.billing_address?.address_1,
                  order.billing_address?.address_2,
                  [
                    order.billing_address?.postal_code,
                    order.billing_address?.city,
                  ]
                    .filter(Boolean)
                    .join(' '),
                  order.billing_address?.country?.display_name,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {Boolean(order.billing_address?.phone) && (
                <p>{order.billing_address?.phone}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 rounded-xs border border-grayscale-200 p-4">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex gap-x-4 gap-y-6 border-grayscale-100 border-b pb-6 last:border-0 last:pb-0 sm:gap-x-8"
            >
              {item.thumbnail && (
                <LocalizedLink
                  href={`/products/${item.product_handle}`}
                  className="relative aspect-[3/4] w-full max-w-25 overflow-hidden sm:max-w-37"
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </LocalizedLink>
              )}
              <div className="flex flex-1 flex-col">
                <p className="mb-2 sm:text-md">
                  <LocalizedLink href={`/products/${item.product_handle}`}>
                    {item.product_title}
                  </LocalizedLink>
                </p>
                <div className="flex flex-1 flex-col text-xs">
                  <div>
                    {item.variant?.options?.map((option) => (
                      <p className="mb-1" key={option.id}>
                        <span className="mr-2 text-grayscale-500">
                          {option.option?.title}:
                        </span>
                        {option.value}
                      </p>
                    ))}
                  </div>
                  <div className="relative mt-auto flex xs:items-center justify-between gap-x-10 gap-y-6.5 max-xs:flex-col">
                    <div className="xs:self-end sm:mb-1">
                      <p>
                        <span className="mr-2 text-grayscale-500">
                          Quantity:
                        </span>
                        {item.quantity}
                      </p>
                    </div>
                    <div className="sm:text-md">
                      <p>
                        {convertToLocale({
                          currency_code: order.currency_code,
                          amount: item.total,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-x-10 gap-y-4 rounded-xs border border-grayscale-200 p-4 max-sm:flex-col md:flex-wrap">
          <div className="flex items-center gap-4 self-baseline">
            <Icon name="credit-card" />
            <div>
              <p className="text-grayscale-500">Payment</p>
            </div>
          </div>
          <OrderTotals order={order} />
        </div>
      </div>
    </>
  )
}
