import Link from 'next/link'
import { Button } from 'ui/atoms/button'
import { ProductCard } from 'ui/molecules/product-card'
import { SearchForm } from 'ui/molecules/search-form'

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Moderní křeslo',
      price: '4 990 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      badges: [{ variant: 'success' as const, children: 'Novinka' }],
    },
    {
      id: 2,
      name: 'Dřevěný konferenční stolek',
      price: '3 490 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      name: 'Designová lampa',
      price: '2 290 Kč',
      stockStatus: 'Skladem',
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      badges: [{ variant: 'warning' as const, children: '-20%' }],
    },
    {
      id: 4,
      name: 'Pohovka třímístná',
      price: '12 990 Kč',
      stockStatus: 'Na objednávku',
      imageUrl:
        'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=400&h=400&fit=crop',
    },
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
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-gray-900"
                >
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-bold text-5xl text-gray-900">
              Vítejte v Demo Shopu
            </h1>
            <p className="mb-8 text-gray-600 text-xl">
              Objevte naši kolekci moderního nábytku a bytových doplňků.
              Kvalitní design pro váš domov.
            </p>
            <div className="mb-12 flex justify-center gap-4">
              <Link href="/products">
                <Button variant="primary" theme="solid" size="lg">
                  Prohlédnout produkty
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" theme="outlined" size="lg">
                  Vytvořit účet
                </Button>
              </Link>
            </div>
            <div className="mx-auto max-w-md">
              <SearchForm
                placeholder="Hledat produkty..."
                onSubmit={(value) => console.log('Search:', value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl">
            Doporučené produkty
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-gray-200 border-t bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Demo Shop. Všechna práva vyhrazena.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
