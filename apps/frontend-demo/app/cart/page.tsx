'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from 'ui/atoms/button'
import { NumericInput } from 'ui/molecules/numeric-input'
import { Input } from 'ui/atoms/input'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Moderní křeslo',
      price: 4990,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'Designová lampa',
      price: 2290,
      originalPrice: 2863,
      discount: '-20%',
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    }
  ])

  const [promoCode, setPromoCode] = useState('')

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id))
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 2000 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold">
                Demo Shop
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/products" className="text-gray-700 hover:text-gray-900">
                  Produkty
                </Link>
                <Link href="/search" className="text-gray-700 hover:text-gray-900">
                  Hledat
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="secondary" theme="borderless" size="sm">
                  Přihlásit
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="primary" theme="solid" size="sm">
                  Košík ({cartItems.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nákupní košík</h1>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`p-6 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                    <div className="flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <Button
                            variant="danger"
                            theme="borderless"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 0)}
                          >
                            Odebrat
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Množství:</span>
                            <NumericInput
                              min={1}
                              max={99}
                              value={item.quantity}
                              onChange={(value) => updateQuantity(item.id, value)}
                            />
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                            </div>
                            {item.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                {(item.originalPrice * item.quantity).toLocaleString('cs-CZ')} Kč
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue shopping */}
              <div className="mt-4">
                <Link href="/products">
                  <Button variant="secondary" theme="outlined">
                    Pokračovat v nákupu
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Shrnutí objednávky</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Mezisoučet</span>
                    <span>{subtotal.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doprava</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Zdarma</span>
                      ) : (
                        `${shipping} Kč`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-gray-600">
                      Doprava zdarma při nákupu nad 2 000 Kč
                    </p>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Celkem</span>
                    <span>{total.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Slevový kód
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Zadejte kód"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="secondary" theme="outlined">
                      Použít
                    </Button>
                  </div>
                </div>

                <Button variant="primary" theme="solid" size="lg" block>
                  Pokračovat k pokladně
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    nebo
                  </p>
                  <Button variant="warning" theme="solid" size="md" block className="mt-2">
                    Rychlá platba
                  </Button>
                </div>

                {/* Security badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <span>🔒 Zabezpečená platba</span>
                    <span>📦 Rychlé doručení</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Váš košík je prázdný</h2>
            <p className="text-gray-600 mb-8">
              Vypadá to, že jste si ještě nic nevybrali. Pojďme to napravit!
            </p>
            <Link href="/products">
              <Button variant="primary" theme="solid" size="lg">
                Začít nakupovat
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}