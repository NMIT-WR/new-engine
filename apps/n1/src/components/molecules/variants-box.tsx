import { ProductCard } from '@techsio/ui-kit/molecules/product-card'
import { slugify } from '@techsio/ui-kit/utils'
import { useState } from 'react'

interface VariantsBoxProps {
  variants: string[]
  limit?: number
}

// Variant C: Hover / Expand (Absolute overlay to avoid layout shift)
export const VariantsBox = ({ variants, limit = 3 }: VariantsBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const visibleVariants = variants.slice(0, limit)
  const remainingCount = variants.length - limit
  const hasMore = remainingCount > 0

  return (
    <div 
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={hasMore ? () => setIsExpanded(true) : undefined}
      onMouseLeave={hasMore ? () => setIsExpanded(false) : undefined}
    >
        {/* Static container - always determines size */}
        <ProductCard.Actions className={`flex flex-wrap items-center justify-center gap-50 ${isExpanded ? 'invisible' : ''}`}>
          {visibleVariants.map((variant) => (
            <ProductCard.Button
              key={slugify(variant)}
              buttonVariant="custom"
              className="h-7 min-w-7 items-center border border-border-secondary bg-surface px-50 py-50"
            >
              <span className="font-normal text-2xs text-fg-primary">
                {variant}
              </span>
            </ProductCard.Button>
          ))}
           {hasMore && (
            <span className="text-2xs text-fg-secondary">+{remainingCount}</span>
          )}
        </ProductCard.Actions>

        {/* Absolute expanded container */}
        {isExpanded && hasMore && (
            <ProductCard.Actions className="absolute bottom-0 z-10 flex w-max max-w-full flex-wrap items-center justify-center gap-50 rounded-md border border-border-secondary bg-surface p-50 shadow-lg">
                 {variants.map((variant) => (
                    <ProductCard.Button
                      key={slugify(variant)}
                      buttonVariant="custom"
                      className="h-7 min-w-7 items-center border border-border-secondary bg-surface px-50 py-50"
                    >
                      <span className="font-normal text-2xs text-fg-primary">
                        {variant}
                      </span>
                    </ProductCard.Button>
                  ))}
            </ProductCard.Actions>
        )}
    </div>
  )
}

