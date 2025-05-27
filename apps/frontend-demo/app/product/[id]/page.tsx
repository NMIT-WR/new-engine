'use client'

import Link from 'next/link'
import { Badge } from 'ui/atoms/badge'
import { Button } from 'ui/atoms/button'
import { Rating } from 'ui/atoms/rating'
import { Tabs } from 'ui/atoms/tabs'
import { Breadcrumb } from 'ui/molecules/breadcrumb'
import { Carousel } from 'ui/molecules/carousel'
import { NumericInput } from 'ui/molecules/numeric-input'
import { ProductCard } from 'ui/molecules/product-card'

export default function ProductDetailPage({
  params,
}: { params: { id: string } }) {
  // V Next.js 15+ je params Promise, ale zatím funguje i přímý přístup
  const productId = params.id
  
  // Mock data - v reálné aplikaci by přišla z API
  const product = {
    id: productId,
    name: 'Moderní křeslo Comfort+',
    price: '4 990 Kč',
    originalPrice: '5 990 Kč',
    discount: '-17%',
    stockStatus: 'Skladem',
    inStock: 12,
    rating: 4.5,
    reviewCount: 23,
    description:
      'Elegantní a pohodlné křeslo, které dodá vašemu interiéru moderní vzhled. Vyrobeno z kvalitních materiálů s důrazem na ergonomii a dlouhou životnost.',
    features: [
      'Ergonomický design pro maximální pohodlí',
      'Odolné čalounění z prémiové látky',
      'Masivní dřevěná konstrukce',
      'Nosnost až 120 kg',
      'Snadná údržba',
    ],
    specifications: {
      Šířka: '75 cm',
      Hloubka: '80 cm',
      Výška: '85 cm',
      'Výška sedáku': '45 cm',
      Materiál: 'Dřevo, textilie',
      Barva: 'Šedá',
      Hmotnost: '15 kg',
    },
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=800&fit=crop',
    ],
  }

  const relatedProducts = [
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

  const breadcrumbItems = [
    { label: 'Domů', href: '/' },
    { label: 'Produkty', href: '/products' },
    { label: 'Křesla', href: '/products?category=kresla' },
    { label: product.name, href: '#', isActive: true },
  ]

  const tabItems = [
    {
      id: 'description',
      label: 'Popis',
      content: (
        <div className="prose max-w-none">
          <p>{product.description}</p>
          <h3 className="mt-4 mb-2 font-semibold text-lg">
            Hlavní vlastnosti:
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'specifications',
      label: 'Specifikace',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {Object.entries(product.specifications).map(
                ([key, value], index) => (
                  <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-2 font-medium">{key}</td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: 'reviews',
      label: 'Recenze (23)',
      content: (
        <div>
          <p className="text-gray-600">
            Zde budou zobrazeny recenze zákazníků.
          </p>
        </div>
      ),
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

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Product detail */}
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {/* Images */}
          <div>
            <Carousel 
              slides={product.images.map((image, index) => ({
                id: `image-${index}`,
                src: image,
                alt: `${product.name} - ${index + 1}`
              }))}
              aspectRatio="square"
              objectFit="cover"
            />
          </div>

          {/* Product info */}
          <div>
            <div className="mb-4 flex items-start justify-between">
              <h1 className="font-bold text-3xl">{product.name}</h1>
              <Badge variant="success">{product.discount}</Badge>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <Rating value={product.rating} />
              <span className="text-gray-600">
                ({product.reviewCount} recenzí)
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-bold text-3xl">{product.price}</span>
                <span className="text-gray-500 text-xl line-through">
                  {product.originalPrice}
                </span>
              </div>
              <p className="mt-2 text-green-600">
                {product.inStock > 0
                  ? `Skladem (${product.inStock} ks)`
                  : 'Není skladem'}
              </p>
            </div>

            <div className="mb-8 space-y-4">
              <div>
                <label className="mb-2 block font-medium text-sm">
                  Množství:
                </label>
                <div className="flex items-center gap-4">
                  <NumericInput
                    min={1}
                    max={product.inStock}
                    defaultValue={1}
                    onChange={(value) => console.log('Quantity:', value)}
                  />
                  <Button
                    variant="primary"
                    theme="solid"
                    size="lg"
                    className="flex-1"
                  >
                    Přidat do košíku
                  </Button>
                </div>
              </div>
              <Button variant="secondary" theme="outlined" size="lg" block>
                Přidat do oblíbených
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-2 font-semibold">Doprava a platba</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Doprava zdarma při nákupu nad 2 000 Kč</li>
                <li>✓ Doručení do 3-5 pracovních dnů</li>
                <li>✓ Možnost platby kartou, převodem nebo na dobírku</li>
                <li>✓ 30 dní na vrácení zboží</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs with additional info */}
        <div className="mt-12">
          <Tabs items={tabItems} />
        </div>

        {/* Related products */}
        <div className="mt-16">
          <h2 className="mb-6 font-bold text-2xl">Související produkty</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <ProductCard
                  imageUrl={product.imageUrl}
                  name={product.name}
                  price={product.price}
                  stockStatus={product.stockStatus}
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
      </div>
    </div>
  )
}
