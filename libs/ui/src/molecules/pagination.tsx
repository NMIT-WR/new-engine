import * as pagination from '@zag-js/pagination'
import { normalizeProps, useMachine } from '@zag-js/react'
import { type ElementType, type HTMLAttributes, useId } from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Icon } from '../atoms/icon'
import { LinkButton } from '../atoms/link-button'
import { tv } from '../utils'

const paginationVariants = tv({
  slots: {
    base: '',
    list: ['inline-flex items-center gap-pagination-list'],
    item: [
      'grid cursor-pointer',
      // If item is ellipsis => bg-transparent
      'has-[[data-part="ellipsis"]]:bg-pagination-neutral-bg',
      'has-[[data-part="compact-text"]]:bg-pagination-neutral-bg',
    ],
    link: [
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-pagination-ring focus-visible:ring-offset-2',
      'border-(length:--border-pagination-width) border-pagination-border rounded-pagination',
      'aspect-square',
      'data-[disabled]:text-pagination-fg-disabled data-[disabled]:hover:bg-pagination-bg-disabled',
      'data-[disabled]:bg-pagination-bg-disabled',
      'data-[disabled]:border-pagination-border-disabled data-[disabled]:cursor-not-allowed',
    ],
    ellipsis: '',
    compactText: '',
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
      filled: {
        item: 'bg-pagination-bg',
        link: [
          'data-[current=true]:bg-pagination-bg-active data-[current=true]:text-pagination-filled-fg-active data-[current=true]:border-pagination-border-active',
          'hover:bg-pagination-bg-hover hover:border-pagination-border-hover',
          'hover:text-pagination-filled-fg-active',
        ],
      },
      outlined: {
        item: 'bg-pagination-bg',
        link: [
          'data-[current=true]:text-pagination-outlined-fg-active data-[current=true]:border-pagination-border-active',
          'hover:border-pagination-border-hover hover:text-pagination-outlined-fg-active',
        ],
      },
      minimal: {
        link: [
          'border-transparent',
          'data-[current=true]:text-pagination-minimal-fg-active',
          'hover:text-pagination-minimal-fg-active',
        ],
      },
    },
    size: {
      sm: {
        link: ' text-pagination-sm h-pagination-sm',
        compactText: 'text-pagination-sm',
      },
      md: {
        link: ' text-pagination-md h-pagination-md',
        compactText: 'text-pagination-md',
      },
      lg: {
        link: ' text-pagination-lg h-pagination-lg',
        compactText: 'text-pagination-lg',
      },
    },
  },
  defaultVariants: {
    variant: 'filled',
    size: 'md',
  },
})

export interface PaginationProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
  page?: number
  defaultPage?: number
  count: number
  pageSize?: number
  siblingCount?: number
  showPrevNext?: boolean
  onPageChange?: (page: number) => void
  dir?: 'ltr' | 'rtl'
  linkAs?: ElementType
  compact?: boolean
}

export function Pagination({
  page,
  defaultPage = 1,
  count,
  pageSize = 10,
  siblingCount = 1,
  showPrevNext = true,
  onPageChange,
  variant,
  className,
  dir = 'ltr',
  linkAs,
  size,
  compact = false,
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
  const { base, list, link, item, ellipsis, compactText } = paginationVariants({
    variant,
    size,
  })

  return (
    <nav className={base()} {...api.getRootProps()} {...props}>
      <ul className={list()} aria-label="Pagination">
        {showPrevNext && (
          <li className={item()}>
            <LinkButton
              theme="borderless"
              className={link()}
              icon="token-icon-pagination-prev"
              disabled={api.page === 1}
              as={linkAs}
              {...api.getPrevTriggerProps()}
            />
          </li>
        )}
        {compact ? (
          <li className={item()}>
            <span className={compactText()} data-part="compact-text">
              {api.page} of {api.totalPages}
            </span>
          </li>
        ) : (
          api.pages.map((page, i) => {
            if (page.type === 'page') {
              return (
                <li key={page.value} className={item()}>
                  <LinkButton
                    theme="borderless"
                    className={link()}
                    aria-current={api.page === page.value ? 'page' : undefined}
                    data-current={api.page === page.value}
                    as={linkAs}
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
          })
        )}

        {showPrevNext && (
          <li className={item()}>
            <LinkButton
              theme="borderless"
              className={link()}
              icon="token-icon-pagination-next"
              disabled={api.page === api.totalPages}
              as={linkAs}
              {...api.getNextTriggerProps()}
            />
          </li>
        )}
      </ul>
    </nav>
  )
}
