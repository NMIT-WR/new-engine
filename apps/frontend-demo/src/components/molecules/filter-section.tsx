import { type ReactNode, useState } from 'react'
import { Button } from 'ui/src/atoms/button'

export interface FilterSectionProps<T = any> {
  title: string
  items?: T[]
  renderItem?: (item: T, index: number) => ReactNode
  children?: ReactNode
  defaultItemsShown?: number
  onClear?: () => void
  className?: string
}

export function FilterSection<T>({
  title,
  items,
  renderItem,
  children,
  defaultItemsShown,
  onClear,
  className,
}: FilterSectionProps<T>) {
  const [showAll, setShowAll] = useState(false)

  const hasItems = items && renderItem
  const hasMore =
    hasItems && defaultItemsShown && items.length > defaultItemsShown
  const visibleItems = hasItems
    ? showAll || !hasMore
      ? items
      : items.slice(0, defaultItemsShown)
    : []

  return (
    <div className="mb-filter-section-margin">
      <div className="mb-filter-section-header-margin flex items-center justify-between">
        <h3 className="font-filter-section-title text-filter-section-title">
          {title}
        </h3>
        {onClear && (
          <Button
            variant="tertiary"
            theme="borderless"
            size="sm"
            onClick={onClear}
          >
            Clear
          </Button>
        )}
      </div>
      <div className={className || ''}>
        {hasItems
          ? visibleItems.map((item, index) => renderItem!(item, index))
          : children}
      </div>
      {hasMore && (
        <div className="mt-filter-section-view-more-margin">
          <Button
            variant="tertiary"
            theme="borderless"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll
              ? 'Show less'
              : `Show ${items!.length - defaultItemsShown!} more`}
          </Button>
        </div>
      )}
    </div>
  )
}
