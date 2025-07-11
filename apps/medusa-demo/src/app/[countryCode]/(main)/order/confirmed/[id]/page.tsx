import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { retrieveOrder } from '@lib/data/orders'
import OrderCompletedTemplate from '@modules/order/templates/order-completed-template'

type Props = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'You purchase was successful',
}

export default async function OrderConfirmedPage({ params }: Props) {
  const { id } = await params
  const order = await retrieveOrder(id)
  if (!order) {
    return notFound()
  }

  return <OrderCompletedTemplate order={order} />
}
