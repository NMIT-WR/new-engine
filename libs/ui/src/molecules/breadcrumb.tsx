import { type VariantProps, tv } from 'tailwind-variants'
import { Icon, type IconType } from '../atoms/icon'
import { Link } from '../atoms/link'

// === VARIANTS ===
const breadcrumbsVariants = tv({
  slots: {
    root: [
      'inline-flex flex-wrap items-center p-breadcrumb',
      'bg-breadcrumb-bg',
    ],
    list: ['flex items-center', 'break-words', 'list-none'],
    item: [
      'inline-flex items-center',
      'text-breadcrumb-item-fg',
      'hover:text-breadcrumb-link-hover',
      'data-[current=true]:text-breadcrumb-current-fg',
      'h-full',
    ],
    link: [
      'no-underline',
      'cursor-pointer',
      'hover:text-breadcrumb-link-hover',
      'focus:outline-none focus:ring-2 focus:ring-breadcrumb-link-ring focus:ring-offset-2',
    ],
    currentLink: ['cursor-default'],
    separator: [
      'text-breadcrumb-separator-fg',
      'inline-flex items-center justify-center',
      'rtl:rotate-180',
    ],
    ellipsis: [
      'text-breadcrumb-ellipsis-fg',
      'inline-flex items-center justify-center',
    ],
  },
  compoundSlots: [
    {
      slots: ['link', 'currentLink'],
      class: [
        'font-medium inline-flex items-center',
        'outline-none focus:outline-none',
      ],
    },
  ],
  variants: {
    size: {
      sm: {
        root: 'text-breadcrumb-sm',
        list: 'gap-breadcrumb-sm',
        item: 'gap-breadcrumb-sm',
        separator: 'gap-breadcrumb-sm',
        ellipsis: 'text-breadcrumb-sm',
      },
      md: {
        root: 'text-breadcrumb-md',
        list: 'gap-breadcrumb-md',
        item: 'gap-breadcrumb-md',
        separator: 'gap-breadcrumb-md',
        ellipsis: 'text-breadcrumb-md',
      },
      lg: {
        root: 'text-breadcrumb-lg',
        list: 'gap-breadcrumb-lg',
        item: 'gap-breadcrumb-lg',
        separator: 'gap-breadcrumb-lg',
        ellipsis: 'text-breadcrumb-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// === TYPES ===
export type BreadcrumbItemType = {
  label: string
  href?: string
  icon?: IconType
  separator?: IconType
  isCurrent?: boolean
}

function BreadcrumbItem({
  label,
  href,
  icon,
  separator = 'token-icon-breadcrumb-separator',
  isCurrentPage,
  lastItem,
  linkComponent,
}: {
  label: string
  href?: string
  icon?: IconType
  separator?: IconType
  lastItem: boolean
  isCurrentPage?: boolean
  linkComponent?: React.ElementType
}) {
  const {
    item,
    currentLink,
    link,
    separator: separatorSlot,
  } = breadcrumbsVariants({ size: 'md' })
  return (
    <li className={item()} data-current={isCurrentPage}>
      {icon && <Icon icon={icon} />}
      {isCurrentPage ? (
        <span className={currentLink()} aria-current="page">
          {label}
        </span>
      ) : (
        <Link as={linkComponent} href={href || '#'} className={link()}>
          {label}
        </Link>
      )}
      {!lastItem && (
        <span className={separatorSlot()}>
          <Icon icon={separator ?? 'token-icon-breadcrumb-separator'} />
        </span>
      )}
    </li>
  )
}

function BreadcrumbEllipsis() {
  const { ellipsis, separator: separatorSlot } = breadcrumbsVariants({
    size: 'md',
  })
  return (
    <li className={ellipsis()}>
      <span aria-hidden="true">
        <Icon icon="token-icon-breadcrumb-ellipsis" />
      </span>
      <span className={separatorSlot()}>
        <Icon icon={'token-icon-breadcrumb-separator'} />
      </span>
    </li>
  )
}

interface BreadcrumbProps extends VariantProps<typeof breadcrumbsVariants> {
  items: BreadcrumbItemType[]
  maxItems?: number
  className?: string
  'aria-label'?: string
  linkComponent?: React.ElementType
}

// === COMPONENT ===
export function Breadcrumb({
  items,
  maxItems = 0,
  size = 'md',
  className,
  'aria-label': ariaLabel = 'breadcrumb',
  linkComponent,
  ...props
}: BreadcrumbProps) {
  const { root, list } = breadcrumbsVariants({ size })

  const displayItems =
    maxItems <= 0 || items.length <= maxItems
      ? items
      : maxItems === 1
        ? [items.at(-1)]
        : [items[0], 'ellipsis', ...items.slice(-(maxItems - 1))]

  return (
    <nav className={root({ className })} aria-label={ariaLabel} {...props}>
      <ol className={list()}>
        {displayItems.map((item, index) =>
          item === 'ellipsis' ? (
            <BreadcrumbEllipsis key="ellipsis" />
          ) : (
            item &&
            typeof item !== 'string' && (
              <BreadcrumbItem
                key={`${item.label}`}
                label={item.label}
                href={item.href}
                icon={item.icon}
                separator={item.separator}
                lastItem={index === displayItems.length - 1}
                linkComponent={linkComponent}
                isCurrentPage={
                  item.isCurrent || index === displayItems.length - 1
                }
              />
            )
          )
        )}
      </ol>
    </nav>
  )
}
