import { type ReactNode, useState } from 'react'
import { Button } from 'ui/src/atoms/button'
import { tv } from 'ui/src/utils'

const filterSectionVariants = tv({
  slots: {
    root: 'mb-filter-section-margin',
    header: 'flex items-center justify-between mb-filter-section-header-margin',
    title: 'text-filter-section-title font-filter-section-title',
    content: '',
    viewMore: 'mt-filter-section-view-more-margin',
  },
})

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
  const styles = filterSectionVariants()

  const hasItems = items && renderItem
  const hasMore =
    hasItems && defaultItemsShown && items.length > defaultItemsShown
  const visibleItems = hasItems
    ? showAll || !hasMore
      ? items
      : items.slice(0, defaultItemsShown)
    : []

  return (
    <div className={styles.root()}>
      <div className={styles.header()}>
        <h3 className={styles.title()}>{title}</h3>
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
      <div className={`${styles.content()} ${className || ''}`}>
        {hasItems
          ? visibleItems.map((item, index) => renderItem!(item, index))
          : children}
      </div>
      {hasMore && (
        <div className={styles.viewMore()}>
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
