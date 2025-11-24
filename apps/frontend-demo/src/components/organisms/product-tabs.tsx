'use client'

import { SafeHtmlContent } from '@/components/safe-html-content'
import type { Product } from '@/types/product'
import { Badge } from '@techsio/ui-kit/atoms/badge'
import { Button } from '@techsio/ui-kit/atoms/button'
import { Rating } from '@techsio/ui-kit/atoms/rating'
import { type TabItem, Tabs } from '@techsio/ui-kit/atoms/tabs'
import { Accordion } from '@techsio/ui-kit/molecules/accordion'
import { slugify } from '@techsio/ui-kit/utils'

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  const mockReviews = [
    {
      id: '1',
      author: 'Sára M.',
      rating: 5,
      date: 'před 2 týdny',
      comment: 'Naprosto skvělé! Kvalita je úzasná a dokonale to sedí.',
      verified: true,
    },
    {
      id: '2',
      author: 'Jan D.',
      rating: 4,
      date: 'před měsícem',
      comment: 'Skvělý produkt, přesně podle popisu. Doporučuji.',
      verified: true,
    },
  ]

  const tabs: TabItem[] = [
    {
      value: 'description',
      label: 'Popis',
      content: (
        <div className="space-y-product-tabs-content-gap">
          <SafeHtmlContent
            content={
              product.description ||
              'Zažijte prvotřídní kvalitu a moderní design s tímto výjimečným produktem. Vyrobeno s důrazem na detail a vydrží roky.'
            }
            className="text-product-tabs-content-fg text-product-tabs-content-size leading-relaxed"
          />
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="font-product-tabs-heading text-product-tabs-heading-fg text-product-tabs-heading-size">
                Klíčové vlastnosti
              </h4>
              <ul className="space-y-product-tabs-features-gap pl-5">
                {product.features.map((feature) => (
                  <li
                    key={slugify(feature)}
                    className="list-disc text-product-tabs-content-fg text-product-tabs-content-size"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      value: 'details',
      label: 'Detaily produktu',
      content: (
        <div className="space-y-product-tabs-section-gap">
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-product-tabs-content-gap">
              <h4 className="font-product-tabs-heading text-product-tabs-heading-fg text-product-tabs-heading-size">
                Specifikace
              </h4>
              <dl className="space-y-product-tabs-spec-gap">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.name}
                    className="flex gap-product-tabs-spec-gap border-product-tabs-spec-border border-b py-product-tabs-table-cell-y last:border-0"
                  >
                    <dt className="min-w-[var(--spacing-product-tabs-spec-label-width)] font-product-tabs-spec-label text-product-tabs-spec-label text-product-tabs-spec-size">
                      {spec.name}
                    </dt>
                    <dd className="text-product-tabs-spec-size text-product-tabs-spec-value">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="mt-product-tabs-accordion-margin">
            <Accordion
              shadow="none"
              items={[
                {
                  id: 'shipping',
                  value: 'shipping',
                  title: 'Doprava a vracení',
                  content: (
                    <div className="space-y-product-tabs-features-gap text-product-tabs-content-fg text-product-tabs-content-size">
                      <p>• Doprava zdarma při objednávce nad 1250 Kč</p>
                      <p>• Možnost expresní dopravy (1-2 pracovní dny)</p>
                      <p>• 30denní lhůta pro vrácení</p>
                      <p>• Vrácení je možné v originálním stavu s visčkami</p>
                    </div>
                  ),
                },
                {
                  id: 'sizing',
                  value: 'sizing',
                  title: 'Tabulka velikostí',
                  content: (
                    <div className="space-y-product-tabs-features-gap text-product-tabs-content-fg text-product-tabs-content-size">
                      <p>
                        Naše produkty odpovídají standardním velikostem. Pokud
                        jste mezi dvěma velikostmi, doporučujeme zvolit větší
                        pro pohodlné nošení.
                      </p>
                      <table className="w-full text-product-tabs-review-meta">
                        <thead>
                          <tr className="border-product-tabs-spec-border border-b">
                            <th className="py-product-tabs-table-cell-y text-left">
                              Velikost
                            </th>
                            <th className="py-product-tabs-table-cell-y">
                              Hrudník (cm)
                            </th>
                            <th className="py-product-tabs-table-cell-y">
                              Délka (cm)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { size: 'S', chest: '90-95', length: '68' },
                            { size: 'M', chest: '96-101', length: '70' },
                            { size: 'L', chest: '102-107', length: '72' },
                            { size: 'XL', chest: '108-113', length: '74' },
                          ].map(({ size, chest, length }) => (
                            <tr
                              key={size}
                              className="border-product-tabs-spec-border border-b"
                            >
                              <td className="py-product-tabs-table-cell-y">
                                {size}
                              </td>
                              <td className="py-product-tabs-table-cell-y text-center">
                                {chest}
                              </td>
                              <td className="py-product-tabs-table-cell-y text-center">
                                {length}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ),
                },
                {
                  id: 'care',
                  value: 'care',
                  title: 'Péče o produkt',
                  content: (
                    <div className="space-y-product-tabs-features-gap text-product-tabs-content-fg text-product-tabs-content-size">
                      <p>• Prát v pračce na 30°C s podobnými barvami</p>
                      <p>• Nebělit</p>
                      <p>• Sušit v sušičce na nízkou teplotu</p>
                      <p>• Žehlit na nízkou teplotu podle potřeby</p>
                      <p>• Nečistit chemicky</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      value: 'reviews',
      label: 'Recenze',
      content: (
        <div className="space-y-product-tabs-section-gap">
          {mockReviews.length > 0 ? (
            <>
              <div className="rounded-product-tabs-review-bg bg-product-tabs-review-bg p-product-tabs-review-card">
                <div className="flex items-center gap-product-tabs-review-rating-gap">
                  <span className="font-product-tabs-heading text-product-tabs-heading-fg text-product-tabs-heading-size">
                    4.5
                  </span>
                  <Rating value={4.5} />
                  <span className="text-product-tabs-content-muted text-product-tabs-review-meta">
                    Na základě {mockReviews.length} recenzí
                  </span>
                </div>
              </div>
              <div className="space-y-product-tabs-content-gap">
                {mockReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-product-tabs-review-border border-b pb-product-tabs-content-gap"
                  >
                    <div className="mb-product-tabs-spec-gap flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <Badge variant="success">Ověřeno</Badge>
                          )}
                        </div>
                        <Rating value={review.rating} size="sm" />
                      </div>
                      <span className="text-product-tabs-content-muted text-product-tabs-review-meta">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-product-tabs-content-fg text-product-tabs-content-size leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Button variant="secondary">Načíst další recenze</Button>
              </div>
            </>
          ) : (
            <div className="rounded-product-tabs-review-bg bg-product-tabs-review-bg py-product-tabs-review-card text-center">
              <p className="text-product-tabs-content-fg text-product-tabs-content-size leading-relaxed">
                Zatím žádné recenze. Buďte první, kdo tento produkt ohodnotí!
              </p>
              <Button className="mt-4">Napsat recenzi</Button>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="mt-product-tabs-margin">
      <Tabs defaultValue="description" items={tabs} />
    </div>
  )
}
