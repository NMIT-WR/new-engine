'use client'

import { Badge } from 'ui/src/atoms/badge'
import { Button } from 'ui/src/atoms/button'
import { Rating } from 'ui/src/atoms/rating'
import { type TabItem, Tabs } from 'ui/src/atoms/tabs'
import { Accordion } from 'ui/src/molecules/accordion'
import { tv } from 'ui/src/utils'
import type { Product } from '../../types/product'

const productTabsStyles = tv({
  slots: {
    root: 'mt-product-tabs-margin',
    tabContent: 'space-y-product-tabs-content-gap',
    tabText:
      'text-product-tabs-content-size text-product-tabs-content-fg leading-relaxed',
    heading:
      'text-product-tabs-heading-size font-product-tabs-heading text-product-tabs-heading-fg',
    featuresList: 'space-y-product-tabs-features-gap pl-5',
    featureItem:
      'text-product-tabs-content-size text-product-tabs-content-fg list-disc',
    specList: 'space-y-product-tabs-spec-gap',
    specRow:
      'flex gap-product-tabs-spec-gap py-product-tabs-table-cell-y border-b border-product-tabs-spec-border last:border-0',
    specLabel:
      'font-product-tabs-spec-label text-product-tabs-spec-size text-product-tabs-spec-label min-w-[var(--spacing-product-tabs-spec-label-width)]',
    specValue: 'text-product-tabs-spec-size text-product-tabs-spec-value',
    accordionContent:
      'text-product-tabs-content-size text-product-tabs-content-fg space-y-product-tabs-features-gap',
    accordionContainer: 'mt-product-tabs-accordion-margin',
    sizeTable: 'w-full text-product-tabs-review-meta',
    sizeTableRow: 'border-b border-product-tabs-spec-border',
    sizeTableCell: 'py-product-tabs-table-cell-y',
    reviewSection: 'space-y-product-tabs-section-gap',
    reviewSummary:
      'bg-product-tabs-review-bg p-product-tabs-review-card rounded-product-tabs-review-bg',
    reviewSummaryContent:
      'flex items-center gap-product-tabs-review-rating-gap',
    reviewList: 'space-y-product-tabs-content-gap',
    reviewCard:
      'border-b border-product-tabs-review-border pb-product-tabs-content-gap',
    reviewHeader: 'flex items-start justify-between mb-product-tabs-spec-gap',
    reviewMeta: 'text-product-tabs-review-meta text-product-tabs-content-muted',
    reviewComment:
      'text-product-tabs-content-size text-product-tabs-content-fg leading-relaxed',
    noReviews:
      'text-center py-product-tabs-review-card bg-product-tabs-review-bg rounded-product-tabs-review-bg',
  },
})

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  const {
    root,
    tabContent,
    tabText,
    heading,
    featuresList,
    featureItem,
    specList,
    specRow,
    specLabel,
    specValue,
    accordionContent,
    accordionContainer,
    sizeTable,
    sizeTableRow,
    sizeTableCell,
    reviewSection,
    reviewSummary,
    reviewSummaryContent,
    reviewList,
    reviewCard,
    reviewHeader,
    reviewMeta,
    reviewComment,
    noReviews,
  } = productTabsStyles()

  const tabItems: TabItem[] = [
    {
      value: 'description',
      label: 'Description',
      content: (
        <div className={tabContent()}>
          <p className={tabText()}>
            {product.longDescription || product.description}
          </p>
          {product.features && product.features.length > 0 && (
            <div className={tabContent()}>
              <h4 className={heading()}>Key Features</h4>
              <ul className={featuresList()}>
                {product.features.map((feature, idx) => (
                  <li key={idx} className={featureItem()}>
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
        <div className={reviewSection()}>
          {product.specifications && product.specifications.length > 0 && (
            <div className={tabContent()}>
              <h4 className={heading()}>Specifications</h4>
              <dl className={specList()}>
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className={specRow()}>
                    <dt className={specLabel()}>{spec.name}</dt>
                    <dd className={specValue()}>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className={accordionContainer()}>
            <Accordion
              items={[
                {
                  id: 'shipping',
                  value: 'shipping',
                  title: 'Shipping & Returns',
                  content: (
                    <div className={accordionContent()}>
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
                    <div className={accordionContent()}>
                      <p>
                        Our products are true to size. If you're between sizes,
                        we recommend sizing up for a comfortable fit.
                      </p>
                      <p
                        className={`mt-product-tabs-spec-gap font-product-tabs-spec-label`}
                      >
                        Size Chart:
                      </p>
                      <table className={sizeTable()}>
                        <thead>
                          <tr className={sizeTableRow()}>
                            <th className={`text-left ${sizeTableCell()}`}>
                              Size
                            </th>
                            <th className={`text-left ${sizeTableCell()}`}>
                              EU
                            </th>
                            <th className={`text-left ${sizeTableCell()}`}>
                              US
                            </th>
                            <th className={`text-left ${sizeTableCell()}`}>
                              UK
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={sizeTableRow()}>
                            <td className={sizeTableCell()}>S</td>
                            <td className={sizeTableCell()}>36-38</td>
                            <td className={sizeTableCell()}>4-6</td>
                            <td className={sizeTableCell()}>8-10</td>
                          </tr>
                          <tr className={sizeTableRow()}>
                            <td className={sizeTableCell()}>M</td>
                            <td className={sizeTableCell()}>38-40</td>
                            <td className={sizeTableCell()}>6-8</td>
                            <td className={sizeTableCell()}>10-12</td>
                          </tr>
                          <tr className={sizeTableRow()}>
                            <td className={sizeTableCell()}>L</td>
                            <td className={sizeTableCell()}>40-42</td>
                            <td className={sizeTableCell()}>8-10</td>
                            <td className={sizeTableCell()}>12-14</td>
                          </tr>
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
                    <div className={accordionContent()}>
                      <p>• Machine wash cold with like colors</p>
                      <p>• Do not bleach</p>
                      <p>• Tumble dry low or hang to dry</p>
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
      label: `Reviews (${product.reviewCount || 0})`,
      content: (
        <div className={reviewSection()}>
          {product.rating && (
            <div className={reviewSummary()}>
              <div className={reviewSummaryContent()}>
                <Rating value={product.rating} readOnly />
                <span className={`${heading()}`}>
                  {product.rating} out of 5
                </span>
                {product.reviewCount && (
                  <span className="text-product-tabs-content-muted">
                    ({product.reviewCount} reviews)
                  </span>
                )}
              </div>
            </div>
          )}
          {product.reviews && product.reviews.length > 0 ? (
            <div className={reviewList()}>
              {product.reviews.map((review) => (
                <div key={review.id} className={reviewCard()}>
                  <div className={reviewHeader()}>
                    <div className="space-y-1">
                      <div
                        className={`flex items-center gap-product-tabs-spec-gap`}
                      >
                        <Rating value={review.rating} readOnly />
                        <h5
                          className={`${specLabel().replace('min-w-[var(--spacing-product-tabs-spec-label-width)]', '')}`}
                        >
                          {review.title}
                        </h5>
                        {review.verified && (
                          <Badge variant="success">Verified Purchase</Badge>
                        )}
                      </div>
                      <div className={reviewMeta()}>
                        By {review.author} •{' '}
                        {new Date(review.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <p className={reviewComment()}>{review.comment}</p>
                </div>
              ))}
              <Button variant="secondary" className="w-full">
                Load More Reviews
              </Button>
            </div>
          ) : (
            <div className={noReviews()}>
              <p className={`${tabText()} mb-product-tabs-content-gap`}>
                No reviews yet. Be the first to share your experience!
              </p>
              <Button variant="primary">Write a Review</Button>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className={root()}>
      <Tabs items={tabItems} defaultValue="description" />
    </div>
  )
}
