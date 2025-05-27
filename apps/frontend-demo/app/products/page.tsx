'use client'

import Link from 'next/link'
import { Button } from 'ui/atoms/button'
import { Checkbox } from 'ui/molecules/checkbox'
import { ProductCard } from 'ui/molecules/product-card'
import { RangeSlider } from 'ui/molecules/range-slider'
import { Select } from 'ui/molecules/select'

export default function ProductsPage() {
  // Mock data - v reálné aplikaci by přišla z API
  const products = [
    {
      id: 1,
      name: 'Moderní křeslo',
      price: '4 990 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      badges: [{ variant: 'success' as const, children: 'Novinka' }],
      category: 'Křesla',
    },
    {
      id: 2,
      name: 'Dřevěný konferenční stolek',
      price: '3 490 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      category: 'Stoly',
    },
    {
      id: 3,
      name: 'Designová lampa',
      price: '2 290 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      badges: [{ variant: 'warning' as const, children: '-20%' }],
      category: 'Osvětlení',
    },
    {
      id: 4,
      name: 'Pohovka třímístná',
      price: '12 990 Kč',
      stockStatus: 'Na objednávku',
      imageUrl:
        'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=400&h=400&fit=crop',
      category: 'Pohovky',
    },
    {
      id: 5,
      name: 'Kancelářská židle',
      price: '6 990 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
      category: 'Židle',
    },
    {
      id: 6,
      name: 'Knihovna modulární',
      price: '8 490 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop',
      badges: [{ variant: 'info' as const, children: 'Eco' }],
      category: 'Úložné prostory',
    },
    {
      id: 7,
      name: 'Jídelní stůl rozkládací',
      price: '9 990 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop',
      category: 'Stoly',
    },
    {
      id: 8,
      name: 'Noční stolek',
      price: '1 990 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=400&h=400&fit=crop',
      category: 'Ložnice',
    },
  ]

  const categories = [
    'Křesla',
    'Stoly',
    'Osvětlení',
    'Pohovky',
    'Židle',
    'Úložné prostory',
    'Ložnice',
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-gray-200 border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-xl">
                Demo Shop
              </Link>
              <div className="hidden gap-6 md:flex">
                <Link href="/products" className="font-medium text-gray-900">
                  Produkty
                </Link>
                <Link
                  href="/search"
                  className="text-gray-700 hover:text-gray-900"
                >
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
                  Košík
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar with filters */}
          <aside className="w-64 shrink-0">
            <h2 className="mb-4 font-semibold text-lg">Filtry</h2>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium">Kategorie</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Checkbox
                    key={category}
                    label={category}
                    onChange={(checked) => console.log(category, checked)}
                  />
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium">Cena</h3>
              <div className="px-2">
                <RangeSlider
                  min={0}
                  max={20000}
                  step={500}
                  defaultValue={[0, 20000]}
                  onChange={(values) => console.log('Price range:', values)}
                />
                <div className="mt-2 flex justify-between text-gray-600 text-sm">
                  <span>0 Kč</span>
                  <span>20 000 Kč</span>
                </div>
              </div>
            </div>

            {/* Stock status */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium">Dostupnost</h3>
              <div className="space-y-2">
                <Checkbox
                  label="Skladem"
                  onChange={(checked) => console.log('Skladem', checked)}
                />
                <Checkbox
                  label="Na objednávku"
                  onChange={(checked) => console.log('Na objednávku', checked)}
                />
              </div>
            </div>

            <Button variant="primary" theme="solid" size="md" block>
              Použít filtry
            </Button>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="font-bold text-2xl">Všechny produkty</h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Řadit podle:</span>
                <Select
                  options={[
                    { value: 'newest', label: 'Nejnovější' },
                    { value: 'price-asc', label: 'Cena vzestupně' },
                    { value: 'price-desc', label: 'Cena sestupně' },
                    { value: 'name', label: 'Název' },
                  ]}
                  placeholder="Vyberte..."
                  onChange={(option) => console.log('Sort by:', option)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <ProductCard
                    imageUrl={product.imageUrl}
                    name={product.name}
                    price={product.price}
                    stockStatus={product.stockStatus}
                    badges={product.badges}
                    addToCartText="Do košíku"
                    onAddToCart={(e) => {
                      e.preventDefault()
                      console.log('Add to cart:', product.name)
                    }}
                    className="h-full transition-shadow hover:shadow-lg"
                  />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button variant="secondary" theme="outlined" size="sm">
                  Předchozí
                </Button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? 'primary' : 'secondary'}
                    theme={page === 1 ? 'solid' : 'borderless'}
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="secondary" theme="outlined" size="sm">
                  Další
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
