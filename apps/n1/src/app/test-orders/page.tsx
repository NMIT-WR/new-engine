'use client'

import { useCart, useCompleteCart } from '@/hooks/use-cart'
import { useOrder, useOrders } from '@/hooks/use-orders'
import {
  createPaymentCollection,
  getPaymentProviders,
  getShippingOptions,
  setShippingMethod,
} from '@/services/cart-service'
import { useEffect, useState } from 'react'

export default function TestOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [paymentProviders, setPaymentProviders] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>('')
  const [selectedPayment, setSelectedPayment] =
    useState<string>('pp_system_default')
  const [isLoadingShipping, setIsLoadingShipping] = useState(false)
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)
  const [isSettingShipping, setIsSettingShipping] = useState(false)
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<
    'cart' | 'shipping' | 'payment' | 'complete'
  >('cart')
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Cart
  const { cart, isLoading: isCartLoading, hasItems } = useCart()
  const { mutate: completeCartMutation, isPending: isCompletingCart } =
    useCompleteCart({
      onSuccess: (order) => {
        setCreatedOrderId(order.id)
        setCheckoutStep('complete')
        alert(`✅ Objednávka vytvořena! ID: ${order.id}`)
      },
      onError: (error, cart) => {
        // Handle validation/payment errors with specific messages
        console.error('Cart completion failed:', error, cart)

        let errorMessage = error.message
        if (error.type === 'validation_error') {
          errorMessage = `Validace selhala: ${error.message}`
        } else if (error.type === 'payment_error') {
          errorMessage = `Platba selhala: ${error.message}`
        }

        alert(
          `❌ Chyba: ${errorMessage}\n\nKošík je stále dostupný pro opravu.`
        )
      },
    })

  // Load shipping options when cart is available
  useEffect(() => {
    if (cart?.id && checkoutStep === 'shipping') {
      loadShippingOptions()
    }
  }, [cart?.id, checkoutStep])

  async function loadShippingOptions() {
    if (!cart?.id) {
      console.error('Missing cart ID')
      setDebugInfo({ error: 'Missing cart ID', cart })
      return
    }

    setIsLoadingShipping(true)
    setDebugInfo(null)
    try {
      // Get shipping options for cart
      const options = await getShippingOptions(cart.id)

      setShippingOptions(options)
      setDebugInfo({
        cart_id: cart.id,
        options: options.map((o: any) => ({
          id: o.id,
          name: o.name,
          amount: o.amount,
        })),
      })

      // Auto-select first option
      if (options.length > 0) {
        setSelectedShipping(options[0].id)
      }

      console.log('🚚 Shipping options:', options)
    } catch (error: any) {
      console.error('❌ Failed to load shipping options:', error)
      setDebugInfo({
        error: error.message,
        cart_id: cart.id,
      })
      alert(`Nepodařilo se načíst způsoby dopravy: ${error.message}`)
    } finally {
      setIsLoadingShipping(false)
    }
  }

  async function loadPaymentProviders() {
    if (!cart?.region_id) {
      console.error('Missing region ID')
      return
    }

    setIsLoadingPayment(true)
    try {
      const providers = await getPaymentProviders(cart.region_id)
      setPaymentProviders(providers)

      // Auto-select first provider or keep default
      if (providers.length > 0 && !selectedPayment) {
        setSelectedPayment(providers[0].id)
      }

      console.log('💳 Payment providers:', providers)
      setDebugInfo({
        region_id: cart.region_id,
        providers: providers.map((p: any) => ({ id: p.id, name: p.name })),
      })
    } catch (error: any) {
      console.error('❌ Failed to load payment providers:', error)
      setDebugInfo({ error: error.message, region_id: cart.region_id })
      alert(`Nepodařilo se načíst payment providers: ${error.message}`)
    } finally {
      setIsLoadingPayment(false)
    }
  }

  async function handleDebugShipping() {
    if (!cart) {
      alert('Žádný cart')
      return
    }
    await loadShippingOptions()
  }

  async function handleDebugPayment() {
    if (!cart) {
      alert('Žádný cart')
      return
    }
    await loadPaymentProviders()
  }

  async function handleSetShipping() {
    if (!cart?.id || !selectedShipping) return

    setIsSettingShipping(true)
    try {
      await setShippingMethod(cart.id, selectedShipping)
      alert('✅ Způsob dopravy nastaven')
      setCheckoutStep('payment')
    } catch (error: any) {
      console.error('Failed to set shipping:', error)
      alert(`❌ Chyba: ${error.message}`)
    } finally {
      setIsSettingShipping(false)
    }
  }

  async function handleInitiatePayment() {
    if (!cart?.id) return

    setIsInitiatingPayment(true)
    try {
      // Use selected payment provider
      await createPaymentCollection(cart.id)
      alert(`✅ Payment iniciován (${selectedPayment})`)
      setCheckoutStep('complete')
    } catch (error: any) {
      console.error('Failed to initiate payment:', error)
      alert(`❌ Chyba: ${error.message}`)
    } finally {
      setIsInitiatingPayment(false)
    }
  }

  // Orders
  const { data: ordersData, isLoading: isOrdersLoading } = useOrders()
  const { data: orderDetail, isLoading: isOrderDetailLoading } =
    useOrder(selectedOrderId)

  function handleStartCheckout() {
    if (!cart?.id || !hasItems) {
      alert('Cart je prázdný')
      return
    }
    setCheckoutStep('shipping')
  }

  function handleCompleteCart() {
    if (!cart?.id) {
      alert('Žádný cart k dokončení')
      return
    }

    if (
      confirm(
        `Dokončit cart s ${cart.items?.length || 0} položkami a vytvořit objednávku?`
      )
    ) {
      completeCartMutation({ cartId: cart.id })
    }
  }

  return (
    <div className="container mx-auto space-y-12 p-8">
      <header className="border-b pb-4">
        <h1 className="font-bold text-3xl">Test Orders Page</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Testovací stránka pro vytváření a zobrazení objednávek
        </p>

        {/* Debug Buttons */}
        {cart && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleDebugShipping}
              disabled={isLoadingShipping}
              className="rounded bg-blue-100 px-4 py-2 text-blue-700 text-sm hover:bg-blue-200 disabled:opacity-50"
            >
              {isLoadingShipping ? '⏳ Loading...' : '🚚 Debug Shipping'}
            </button>
            <button
              type="button"
              onClick={handleDebugPayment}
              disabled={isLoadingPayment}
              className="rounded bg-purple-100 px-4 py-2 text-purple-700 text-sm hover:bg-purple-200 disabled:opacity-50"
            >
              {isLoadingPayment ? '⏳ Loading...' : '💳 Debug Payment'}
            </button>
          </div>
        )}

        {/* Debug Info Display */}
        {debugInfo && (
          <div className="mt-4 rounded border bg-gray-100 p-4 text-xs">
            <p className="mb-2 font-bold">Debug Info:</p>
            <pre className="overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </header>

      {/* Checkout Steps Indicator */}
      {cart && hasItems && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <div
            className={`rounded px-4 py-2 ${checkoutStep === 'cart' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            1. Cart
          </div>
          <div
            className={`rounded px-4 py-2 ${checkoutStep === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            2. Shipping
          </div>
          <div
            className={`rounded px-4 py-2 ${checkoutStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            3. Payment
          </div>
          <div
            className={`rounded px-4 py-2 ${checkoutStep === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            4. Complete
          </div>
        </div>
      )}

      {/* Current Cart Section */}
      {checkoutStep === 'cart' && (
        <section className="rounded-lg border bg-gray-50 p-6">
          <h2 className="mb-4 font-bold text-2xl">1. Aktuální Cart</h2>

          {isCartLoading ? (
            <p>Načítání cartu...</p>
          ) : cart ? (
            <div className="space-y-4">
              <div className="rounded border bg-white p-4">
                <p className="font-mono text-sm">
                  <strong>Cart ID:</strong> {cart.id}
                </p>
                <p className="mt-2">
                  <strong>Položky:</strong> {cart.items?.length || 0}
                </p>
                <p>
                  <strong>Total:</strong> {cart.total} {cart.currency_code}
                </p>
              </div>

              {cart.items && cart.items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Cart Items:</h3>
                  {cart.items.map((item) => (
                    <div key={item.id} className="rounded border bg-white p-3">
                      <p>
                        <strong>{item.title}</strong>
                      </p>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity} × {item.unit_price}{' '}
                        {cart.currency_code}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleStartCheckout}
                disabled={!hasItems}
                className="rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Pokračovat na Shipping →
              </button>

              {!hasItems && (
                <p className="text-orange-600 text-sm">
                  ⚠️ Cart je prázdný - přidejte nějaké produkty
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Žádný cart - přidejte produkt do košíku
            </p>
          )}
        </section>
      )}

      {/* Shipping Section */}
      {checkoutStep === 'shipping' && (
        <section className="rounded-lg border bg-blue-50 p-6">
          <h2 className="mb-4 font-bold text-2xl">2. Způsob Dopravy</h2>

          {isLoadingShipping ? (
            <p>Načítání způsobů dopravy...</p>
          ) : shippingOptions.length === 0 ? (
            <p className="text-orange-600">
              ⚠️ Žádné způsoby dopravy k dispozici
            </p>
          ) : (
            <div className="space-y-4">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded border bg-white p-4 hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={selectedShipping === option.id}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{option.name}</p>
                    <p className="font-mono text-gray-600 text-sm">
                      {option.id}
                    </p>
                  </div>
                  <p className="font-bold">{option.amount || 'Zdarma'}</p>
                </label>
              ))}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                  ← Zpět
                </button>
                <button
                  type="button"
                  onClick={handleSetShipping}
                  disabled={!selectedShipping || isSettingShipping}
                  className="flex-1 rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isSettingShipping ? 'Nastavuji...' : 'Potvrdit dopravy →'}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Payment Section */}
      {checkoutStep === 'payment' && (
        <section className="rounded-lg border bg-purple-50 p-6">
          <h2 className="mb-4 font-bold text-2xl">3. Payment</h2>

          <div className="space-y-4">
            <button
              type="button"
              onClick={loadPaymentProviders}
              disabled={isLoadingPayment}
              className="mb-4 rounded bg-purple-200 px-4 py-2 text-sm hover:bg-purple-300"
            >
              {isLoadingPayment
                ? '⏳ Načítám...'
                : '🔄 Načíst Payment Providers'}
            </button>

            {paymentProviders.length > 0 ? (
              <div className="space-y-2">
                {paymentProviders.map((provider: any) => (
                  <label
                    key={provider.id}
                    className="flex cursor-pointer items-center gap-3 rounded border bg-white p-4 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={provider.id}
                      checked={selectedPayment === provider.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{provider.id}</p>
                      <p className="font-mono text-gray-600 text-sm">
                        {provider.name || 'Default Provider'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="rounded border bg-white p-4">
                <p className="font-semibold">Payment Provider:</p>
                <p className="font-mono text-gray-600 text-sm">
                  {selectedPayment}
                </p>
                <p className="mt-2 text-gray-600 text-sm">
                  Medusa default payment provider pro testování
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('shipping')}
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                ← Zpět
              </button>
              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={isInitiatingPayment}
                className="flex-1 rounded bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isInitiatingPayment
                  ? 'Inicializuji payment...'
                  : `Iniciovat Payment (${selectedPayment}) →`}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Complete Section */}
      {checkoutStep === 'complete' && (
        <section className="rounded-lg border bg-green-50 p-6">
          <h2 className="mb-4 font-bold text-2xl">4. Dokončit Objednávku</h2>

          <div className="space-y-4">
            <div className="rounded border bg-white p-4">
              <p className="font-semibold text-green-700">
                ✓ Shipping nastaven
              </p>
              <p className="font-semibold text-green-700">
                ✓ Payment iniciován
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                Vše připraveno k dokončení objednávky
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                ← Reset
              </button>
              <button
                type="button"
                onClick={handleCompleteCart}
                disabled={isCompletingCart}
                className="flex-1 rounded bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isCompletingCart
                  ? 'Vytvářím objednávku...'
                  : '✓ Vytvořit Objednávku'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Created Order Section */}
      {createdOrderId && (
        <section className="rounded-lg border border-green-300 bg-green-50 p-6">
          <h2 className="mb-4 font-bold text-2xl text-green-800">
            ✅ Objednávka Vytvořena!
          </h2>
          <p className="font-mono text-sm">Order ID: {createdOrderId}</p>
          <button
            type="button"
            onClick={() => setSelectedOrderId(createdOrderId)}
            className="mt-4 rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            Zobrazit detail objednávky
          </button>
        </section>
      )}

      {/* Orders List Section */}
      <section className="rounded-lg border p-6">
        <h2 className="mb-4 font-bold text-2xl">2. Seznam Objednávek</h2>

        {isOrdersLoading ? (
          <p>Načítání objednávek...</p>
        ) : ordersData?.orders?.length ? (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              Celkem: {ordersData.count} objednávek
            </p>
            {ordersData.orders.map((order) => (
              <div
                key={order.id}
                className="cursor-pointer rounded border bg-white p-4 hover:bg-gray-50"
                onClick={() => setSelectedOrderId(order.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-gray-600 text-sm">
                      {order.id}
                    </p>
                    <p className="font-semibold">Order #{order.display_id}</p>
                    <p className="text-sm">Status: {order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {order.total} {order.currency_code}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {order.items?.length || 0} položek
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Žádné objednávky</p>
        )}
      </section>

      {/* Order Detail Section */}
      {selectedOrderId && (
        <section className="rounded-lg border bg-blue-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-2xl">3. Detail Objednávky</h2>
            <button
              type="button"
              onClick={() => setSelectedOrderId(null)}
              className="text-blue-600 text-sm hover:underline"
            >
              Zavřít
            </button>
          </div>

          {isOrderDetailLoading ? (
            <p>Načítání detailu...</p>
          ) : orderDetail ? (
            <div className="space-y-4 rounded border bg-white p-6">
              <div>
                <p className="font-mono text-gray-600 text-sm">
                  {orderDetail.id}
                </p>
                <h3 className="font-bold text-xl">
                  Order #{orderDetail.display_id}
                </h3>
                <p className="text-sm">Status: {orderDetail.status}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Customer:</p>
                  <p>{orderDetail.customer?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p className="font-bold text-lg">
                    {orderDetail.total} {orderDetail.currency_code}
                  </p>
                </div>
              </div>

              {orderDetail.shipping_address && (
                <div>
                  <p className="font-semibold text-sm">Shipping Address:</p>
                  <p className="text-gray-700 text-sm">
                    {orderDetail.shipping_address.address_1}
                    {orderDetail.shipping_address.address_2 &&
                      `, ${orderDetail.shipping_address.address_2}`}
                    <br />
                    {orderDetail.shipping_address.city},{' '}
                    {orderDetail.shipping_address.postal_code}
                    <br />
                    {orderDetail.shipping_address.country_code}
                  </p>
                </div>
              )}

              {orderDetail.items && orderDetail.items.length > 0 && (
                <div>
                  <p className="mb-2 font-semibold">Order Items:</p>
                  <div className="space-y-2">
                    {orderDetail.items.map((item) => (
                      <div key={item.id} className="border-t pt-2">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            {item.product && (
                              <p className="text-gray-600 text-sm">
                                Product: {item.product.title}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p>
                              {item.quantity} × {item.unit_price}
                            </p>
                            <p className="font-semibold">{item.total}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-600">Objednávka nenalezena</p>
          )}
        </section>
      )}

      {/* Debug Info */}
      <section className="rounded-lg border bg-gray-100 p-6 text-xs">
        <h3 className="mb-2 font-bold">Debug Info:</h3>
        <pre className="overflow-auto">
          {JSON.stringify(
            {
              cart: cart?.id || 'null',
              cartItems: cart?.items?.length || 0,
              orders: ordersData?.count || 0,
              selectedOrder: selectedOrderId,
              createdOrder: createdOrderId,
            },
            null,
            2
          )}
        </pre>
      </section>
    </div>
  )
}
