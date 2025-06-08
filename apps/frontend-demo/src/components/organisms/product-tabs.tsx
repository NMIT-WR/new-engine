'use client'

import { Badge } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Rating } from 'ui/src/atoms/rating'
import { type TabItem, Tabs } from 'ui/src/atoms/tabs'
import { Accordion } from 'ui/src/molecules/accordion'
import type { Product } from '../../types/product'

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  const mockReviews = [
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Absolutely love this! The quality is amazing and it fits perfectly.',
      verified: true,
    },
    {
      id: '2',
      author: 'John D.',
      rating: 4,
      date: '1 month ago',
      comment: 'Great product, exactly as described. Would recommend.',
      verified: true,
    },
  ]

  const tabs: TabItem[] = [
    {
      value: 'description',
      label: 'Description',
      content: (
        <div className="space-y-product-tabs-content-gap">
          <p className="text-product-tabs-content-size text-product-tabs-content-fg leading-relaxed">
            {product.description ||
              'Experience premium quality and modern design with this exceptional product. Crafted with attention to detail and built to last.'}
          </p>
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="text-product-tabs-heading-size font-product-tabs-heading text-product-tabs-heading-fg">
                Key Features
              </h4>
              <ul className="space-y-product-tabs-features-gap pl-5">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="text-product-tabs-content-size text-product-tabs-content-fg list-disc"
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
      label: 'Product Details',
      content: (
        <div className="space-y-product-tabs-section-gap">
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-product-tabs-content-gap">
              <h4 className="text-product-tabs-heading-size font-product-tabs-heading text-product-tabs-heading-fg">Specifications</h4>
              <dl className="space-y-product-tabs-spec-gap">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-product-tabs-spec-gap py-product-tabs-table-cell-y border-b border-product-tabs-spec-border last:border-0">
                    <dt className="font-product-tabs-spec-label text-product-tabs-spec-size text-product-tabs-spec-label min-w-[var(--spacing-product-tabs-spec-label-width)]">{spec.name}</dt>
                    <dd className="text-product-tabs-spec-size text-product-tabs-spec-value">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="mt-product-tabs-accordion-margin">
            <Accordion
              items={[
                {
                  id: 'shipping',
                  value: 'shipping',
                  title: 'Shipping & Returns',
                  content: (
                    <div className="text-product-tabs-content-size text-product-tabs-content-fg space-y-product-tabs-features-gap">
                      <p>• Free shipping on orders over €50</p>
                      <p>• Express delivery available (1-2 business days)</p>
                      <p>• 30-day return policy</p>
                      <p>• Returns accepted in original condition with tags</p>
                    </div>
                  ),
                },
                {
                  id: 'sizing',
                  value: 'sizing',
                  title: 'Size Guide',
                  content: (
                    <div className="text-product-tabs-content-size text-product-tabs-content-fg space-y-product-tabs-features-gap">
                      <p>
                        Our products are true to size. If you're between sizes,
                        we recommend sizing up for a comfortable fit.
                      </p>
                      <table className="w-full text-product-tabs-review-meta">
                        <thead>
                          <tr className="border-b border-product-tabs-spec-border">
                            <th className="py-product-tabs-table-cell-y text-left">Size</th>
                            <th className="py-product-tabs-table-cell-y">Chest (cm)</th>
                            <th className="py-product-tabs-table-cell-y">Length (cm)</th>
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
                              className="border-b border-product-tabs-spec-border"
                            >
                              <td className="py-product-tabs-table-cell-y">{size}</td>
                              <td className="py-product-tabs-table-cell-y text-center">{chest}</td>
                              <td className="py-product-tabs-table-cell-y text-center">{length}</td>
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
                  title: 'Care Instructions',
                  content: (
                    <div className="text-product-tabs-content-size text-product-tabs-content-fg space-y-product-tabs-features-gap">
                      <p>• Machine wash cold with like colors</p>
                      <p>• Do not bleach</p>
                      <p>• Tumble dry low</p>
                      <p>• Cool iron if needed</p>
                      <p>• Do not dry clean</p>
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
      label: 'Reviews',
      content: (
        <div className="space-y-product-tabs-section-gap">
          {mockReviews.length > 0 ? (
            <>
              <div className="bg-product-tabs-review-bg p-product-tabs-review-card rounded-product-tabs-review-bg">
                <div className="flex items-center gap-product-tabs-review-rating-gap">
                  <span className="text-product-tabs-heading-size font-product-tabs-heading text-product-tabs-heading-fg">
                    4.5
                  </span>
                  <Rating value={4.5} />
                  <span className="text-product-tabs-review-meta text-product-tabs-content-muted">
                    Based on {mockReviews.length} reviews
                  </span>
                </div>
              </div>
              <div className="space-y-product-tabs-content-gap">
                {mockReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-product-tabs-review-border pb-product-tabs-content-gap"
                  >
                    <div className="flex items-start justify-between mb-product-tabs-spec-gap">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <Badge variant="success">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Rating value={review.rating} size="sm" />
                      </div>
                      <span className="text-product-tabs-review-meta text-product-tabs-content-muted">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-product-tabs-content-size text-product-tabs-content-fg leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Button variant="secondary">Load More Reviews</Button>
              </div>
            </>
          ) : (
            <div className="text-center py-product-tabs-review-card bg-product-tabs-review-bg rounded-product-tabs-review-bg">
              <p className="text-product-tabs-content-size text-product-tabs-content-fg leading-relaxed">
                No reviews yet. Be the first to review this product!
              </p>
              <Button className="mt-4">Write a Review</Button>
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