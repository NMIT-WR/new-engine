'use client'
import { Heading } from '@/components/heading'
import { N1Aside } from '@/components/n1-aside'
import { Breadcrumb } from '@new-engine/ui/molecules/breadcrumb'
import './layout.css'
import { ProductGrid } from '@/components/molecules/product-grid'
import { categoryTree } from '@/data/static/categories'
import { useProducts } from '@/hooks/use-products'
import { CATEGORY_MAP } from '@/lib/constants'
import type { IconType } from '@new-engine/ui/atoms/icon'
import { LinkButton } from '@new-engine/ui/atoms/link-button'
import NextLink from 'next/link'
import { useParams } from 'next/navigation'

const VALID_CATEGORIES = [
  'panske',
  'damske',
  'detske',
  'obleceni-category-347',
  'cyklo-category-378',
  'moto-category-424',
  'snb-skate-category-448',
  'ski-category-466',
]

export default function ProductPage() {
  const params = useParams()
  const category = params.category as string

  const { data } = useProducts({ category_id: CATEGORY_MAP[category] })
  const products =
    data?.products.map((p) => ({
      id: p.id,
      title: p.title,
      price: `${p.variants?.[0].calculated_price?.calculated_amount_with_tax?.toFixed(0)} Kč`,
      imageSrc: p.thumbnail || '/placeholder.jpg',
      stockValue: 'Skladem',
      variants:
        p.variants && p.variants?.length < 2
          ? []
          : p.variants?.map((v) => v.title).filter((v) => v !== null),
    })) || []

  if (!VALID_CATEGORIES.includes(category)) {
    return <div>Category not found</div>
  }

  const rootCategory = categoryTree.find((cat) => cat.handle === category)

  const breadcrumbItems: { label: string; href: string; icon?: IconType }[] = [
    { label: 'Home', href: '/', icon: 'icon-[mdi--home]' },
    { label: rootCategory?.name || category, href: `/${category}` },
  ]

  return (
    <div className="product-layout p-400">
      <header className="col-span-2 row-span-1">
        <Breadcrumb linkAs={NextLink} items={breadcrumbItems} size="lg" />
      </header>
      <N1Aside
        categories={rootCategory?.children || []}
        label={rootCategory?.name}
      />
      <main className="px-300">
        <header className="space-y-300">
          <Heading as="h1">{rootCategory?.name}</Heading>
          <div className="grid grid-cols-4 gap-100">
            {rootCategory?.children?.map((child) => (
              <LinkButton
                key={child.id}
                href={child.name}
                className="border border-overlay bg-surface py-200 text-fg-primary hover:bg-base"
              >
                {child.name}
              </LinkButton>
            ))}
          </div>
        </header>
        <section>
          <ProductGrid products={products} />
        </section>
      </main>
    </div>
  )
}
