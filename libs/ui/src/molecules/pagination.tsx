import * as pagination from '@zag-js/pagination'
import { normalizeProps, useMachine } from '@zag-js/react'
import { type HTMLAttributes, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Icon } from '../atoms/icon'
import { LinkButton } from '../atoms/link-button'
import { tv } from '../utils'

const paginationVariants = tv({
  slots: {
    base: '',
    list: ['inline-flex items-center gap-pagination-list'],
    item: 'grid cursor-pointer',
    link: [
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-pagination-ring focus-visible:ring-offset-2',
      'border-(length:--border-pagination-width) border-pagination-border rounded-pagination',
      'aspect-square text-pagination-size h-pagination',
      'data-[disabled]:text-pagination-fg-disabled data-[disabled]:hover:bg-transparent',
    ],
    ellipsis: '',
  },
  compoundSlots: [
    {
      slots: ['link', 'ellipsis'],
      className: [
        'inline-flex items-center justify-center',
        'transition-colors duration-200',
        'text-pagination-fg',
      ],
    },
  ],
  variants: {
    variant: {
      filled: {},
      outlined: {},
      minimal: {},
    },
  },
  defaultVariants: {
    variant: 'filled',
  },
  compoundVariants: [
    {
      variant: 'filled',
      className: {
        link: [
          'data-[current=true]:bg-pagination-active data-[current=true]:text-pagination-fg-active data-[current=true]:border-pagination-border-active',
          'hover:bg-pagination-hover hover:border-pagination-border-hover',
          'data-[disabled]:border-pagination-border-disabled',
        ],
        nav: 'hover:bg-pagination-hover hover:border-pagination-border-hover',
      },
    },
    {
      variant: 'outlined',
      className: {
        link: [
          'data-[current=true]:text-pagination-outlined-fg-active data-[current=true]:border-pagination-border-active',
          'hover:border-pagination-border-hover hover:text-pagination-outlined-fg-active',
          'data-[disabled]:border-pagination-border-disabled',
        ],
        nav: 'hover:border-pagination-border-hover',
      },
    },
    {
      variant: 'minimal',
      className: {
        link: [
          'border-transparent',
          'data-[current=true]:bg-pagination-active data-[current=true]:text-pagination-fg-active',
          'hover:bg-pagination-hover',
        ],
        nav: 'border-transparent hover:bg-pagination-hover',
      },
    },
  ],
})

export interface PaginationProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
  page?: number
  defaultPage?: number
  count: number
  pageSize?: number
  siblingCount?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  onPageChange?: (page: number) => void
  dir?: 'ltr' | 'rtl'
}

export function Pagination({
  page,
  defaultPage = 1,
  count,
  pageSize = 10,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  onPageChange,
  variant,
  className,
  dir = 'ltr',
  ...props
}: PaginationProps) {
  const uniqueId = useId()

  const service = useMachine(pagination.machine, {
    id: uniqueId,
    count,
    pageSize,
    siblingCount,
    page,
    dir,
    defaultPage,
    onPageChange: ({ page }) => {
      onPageChange?.(page)
    },
  })

  const api = pagination.connect(service, normalizeProps)
  const { base, list, link, item, ellipsis } = paginationVariants({ variant })

  return (
    <nav className={base({ className })} {...api.getRootProps()} {...props}>
      <ul className={list()} aria-label="Pagination">
        {showPrevNext && (
          <li className={item()}>
            <LinkButton
              className={link()}
              icon="token-icon-pagination-prev"
              onClick={() => api.goToPrevPage()}
              disabled={api.page === 1}
              {...api.getPrevTriggerProps()}
            />
          </li>
        )}

        {api.pages.map((page, i) => {
          if (page.type === 'page') {
            return (
              <li key={page.value} className={item()}>
                <LinkButton
                  className={link()}
                  onClick={() => api.setPage(page.value)}
                  aria-current={api.page === page.value ? 'page' : undefined}
                  data-current={api.page === page.value}
                  {...api.getItemProps(page)}
                >
                  {page.value}
                </LinkButton>
              </li>
            )
          }
          return (
            <li key={`ellipsis-${i}`} className={item()}>
              <span
                className={ellipsis()}
                aria-hidden="true"
                {...api.getEllipsisProps({ index: i })}
              >
                <Icon icon="token-icon-pagination-ellipsis" size="current" />
              </span>
            </li>
          )
        })}

        {showPrevNext && (
          <li className={item()}>
            <LinkButton
              className={link()}
              icon="token-icon-pagination-next"
              onClick={() => api.goToNextPage()}
              disabled={api.page === api.totalPages}
              {...api.getNextTriggerProps()}
            />
          </li>
        )}
      </ul>
    </nav>
  )
}
