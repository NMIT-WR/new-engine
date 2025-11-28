import { formatPrice } from '@/app/ucet/profil/_components/orders'
import type { StoreOrder } from '@medusajs/types'
import { ItemCard } from './item-card'

interface OrderDetailProps {
  order: StoreOrder
}

export const OrderDetail = ({ order }: OrderDetailProps) => {
  return (
    <div className="space-y-500">
      {/* Products Grid */}
      <div>
        <h2 className="mb-300 font-bold text-fg-primary text-lg">
          Objednané produkty
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-300 sm:grid-cols-3 xl:grid-cols-4">
          {order.items?.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              currency_code={order.currency_code}
            />
          ))}
        </div>
      </div>

      {/* Bottom Info Cards */}
      <div className="grid gap-400 md:grid-cols-2">
        {/* Payment Summary */}
        <div className="rounded border border-border-secondary bg-surface-light p-400">
          <h3 className="mb-300 font-semibold text-fg-primary text-lg">
            Platební přehled
          </h3>
          <div className="space-y-200">
            <div className="flex justify-between">
              <span className="text-fg-secondary">Mezisoučet</span>
              <span className="font-medium text-fg-primary">
                {formatPrice(
                  order.items?.reduce(
                    (sum, item) => sum + (item.subtotal || 0),
                    0
                  ) || 0,
                  order.currency_code
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-secondary">DPH</span>
              <span className="font-medium text-fg-primary">
                {formatPrice(
                  order.items?.reduce(
                    (sum, item) => sum + (item.tax_total || 0),
                    0
                  ) || 0,
                  order.currency_code
                )}
              </span>
            </div>
            {order.shipping_methods?.[0] && (
              <div className="flex justify-between">
                <span className="text-fg-secondary">
                  Doprava ({order.shipping_methods[0].name})
                </span>
                <span className="font-medium text-fg-primary">
                  {formatPrice(
                    order.shipping_methods[0].total || 0,
                    order.currency_code
                  )}
                </span>
              </div>
            )}
            <div className="border-border-secondary border-t pt-200">
              <div className="flex justify-between">
                <span className="font-semibold text-fg-primary text-lg">
                  Celkem
                </span>
                <span className="font-bold text-fg-primary text-lg">
                  {formatPrice(
                    order.summary?.original_order_total || order.total || 0,
                    order.currency_code
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="rounded border border-border-secondary bg-surface-light p-400">
          <h3 className="mb-300 font-semibold text-fg-primary text-lg">
            Detaily objednávky
          </h3>
          <div className="space-y-200">
            <div>
              <p className="text-fg-tertiary text-sm">ID objednávky</p>
              <p className="font-mono text-fg-primary text-sm">{order.id}</p>
            </div>
            <div>
              <p className="text-fg-tertiary text-sm">Vytvořeno</p>
              <p className="font-medium text-fg-primary">
                {new Date(order.created_at).toLocaleString('cs-CZ')}
              </p>
            </div>
            {order.updated_at && (
              <div>
                <p className="text-fg-tertiary text-sm">Poslední aktualizace</p>
                <p className="font-medium text-fg-primary">
                  {new Date(order.updated_at).toLocaleString('cs-CZ')}
                </p>
              </div>
            )}
            {order.email && (
              <div>
                <p className="text-fg-tertiary text-sm">E-mail</p>
                <p className="font-medium text-fg-primary">{order.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
