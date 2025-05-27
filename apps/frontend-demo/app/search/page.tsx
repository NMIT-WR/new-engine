'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from 'ui/atoms/button'
import { Badge } from 'ui/atoms/badge'
import { ProductCard } from 'ui/molecules/product-card'
import { SearchForm } from 'ui/molecules/search-form'
import { Checkbox } from 'ui/molecules/checkbox'
import { Select } from 'ui/molecules/select'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    priceRange: 'all',
    availability: 'all'
  })

  // Mock search results
  const searchResults = searchQuery ? [
    {
      id: 1,
      name: 'Moderní křeslo',
      price: '4 990 Kč',
      stockStatus: 'Skladem',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      badges: [{ variant: 'success' as const, children: 'Novinka' }],
      category: 'Křesla'
    },
    {
      id: 3,
      name: 'Designová lampa',
      price: '2 290 Kč',
      stockStatus: 'Skladem',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      badges: [{ variant: 'warning' as const, children: '-20%' }],
      category: 'Osvětlení'
    },
    {
      id: 5,
      name: 'Kancelářská židle',
      price: '6 990 Kč',
      stockStatus: 'Skladem',
      imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
      category: 'Židle'
    }
  ] : []

  const popularSearches = [
    'křeslo', 'stůl', 'lampa', 'pohovka', 'židle', 'skříň', 'postel', 'koberec'
  ]

  const categories = ['Křesla', 'Stoly', 'Osvětlení', 'Pohovky', 'Židle', 'Úložné prostory', 'Ložnice']

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
                <Link href="/search" className="text-gray-900 font-medium">
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
        {/* Search header */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Vyhledávání</h1>
          <SearchForm
            placeholder="Hledejte produkty, kategorie..."
            defaultValue={searchQuery}
            onSubmit={(value) => {
              setSearchQuery(value)
              console.log('Search:', value)
            }}
            size="lg"
          />
          
          {/* Popular searches */}
          {!searchQuery && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Oblíbená vyhledávání:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="flex gap-8">
            {/* Filters sidebar */}
            <aside className="w-64 shrink-0">
              <h2 className="text-lg font-semibold mb-4">Upřesnit výsledky</h2>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Kategorie</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Checkbox
                      key={category}
                      label={`${category} (${Math.floor(Math.random() * 20) + 1})`}
                      onChange={(checked) => console.log(category, checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Cenové rozmezí</h3>
                <Select
                  options={[
                    { value: 'all', label: 'Vše' },
                    { value: '0-2000', label: '0 - 2 000 Kč' },
                    { value: '2000-5000', label: '2 000 - 5 000 Kč' },
                    { value: '5000-10000', label: '5 000 - 10 000 Kč' },
                    { value: '10000+', label: 'Nad 10 000 Kč' }
                  ]}
                  placeholder="Vyberte cenové rozmezí"
                  onChange={(option) => console.log('Price range:', option)}
                />
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Dostupnost</h3>
                <Select
                  options={[
                    { value: 'all', label: 'Vše' },
                    { value: 'in-stock', label: 'Skladem' },
                    { value: 'to-order', label: 'Na objednávku' }
                  ]}
                  placeholder="Vyberte dostupnost"
                  onChange={(option) => console.log('Availability:', option)}
                />
              </div>

              <Button variant="secondary" theme="outlined" size="sm" block>
                Vymazat filtry
              </Button>
            </aside>

            {/* Search results */}
            <main className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl">
                  Nalezeno <strong>{searchResults.length}</strong> výsledků pro "{searchQuery}"
                </h2>
                <Select
                  options={[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'price-asc', label: 'Cena vzestupně' },
                    { value: 'price-desc', label: 'Cena sestupně' },
                    { value: 'name', label: 'Název' }
                  ]}
                  placeholder="Řadit podle..."
                  onChange={(option) => console.log('Sort by:', option)}
                />
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product) => (
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
                        className="h-full hover:shadow-lg transition-shadow"
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    Nenašli jsme žádné produkty odpovídající vašemu vyhledávání.
                  </p>
                  <Button variant="primary" theme="solid" onClick={() => setSearchQuery('')}>
                    Vymazat vyhledávání
                  </Button>
                </div>
              )}
            </main>
          </div>
        )}

        {/* Empty state when no search */}
        {!searchQuery && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Začněte vyhledávat</h2>
            <p className="text-gray-600 mb-8">
              Zadejte název produktu, kategorii nebo klíčové slovo do vyhledávacího pole výše.
            </p>
            <Link href="/products">
              <Button variant="primary" theme="solid" size="lg">
                Prohlédnout všechny produkty
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}