import {
  type ComponentPropsWithoutRef,
  type RefObject,
  createContext,
  useContext,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { tv } from '../utils'

const tableVariants = tv({
  slots: {
    root: [
      'w-full border-collapse',
      'bg-table-bg text-table-fg',
      'border-spacing-0',
    ],
    caption: ['text-table-caption-fg', 'text-start font-table-caption'],
    header: ['bg-table-header-bg', 'text-table-header-fg font-table-header'],
    body: '',
    footer: ['bg-table-footer-bg', 'text-table-footer-fg font-table-footer'],
    row: [
      'border-b-(length:--border-width-table) border-table-border',
      'data-[selected=true]:bg-table-row-bg-selected',
      'transition-colors duration-200',
    ],
    columnHeader: [
      'text-start data-[numeric=true]:text-end',
      'font-table-header',
    ],
    cell: ['text-start data-[numeric=true]:text-end'],
  },
  variants: {
    variant: {
      line: {
        root: '',
        row: 'border-b-(length:--border-width-table) border-table-border',
      },
      outline: {
        root: 'border-(length:--border-width-table) border-table-border rounded-table shadow-table-outline',
      },
      striped: {
        row: 'odd:bg-table-row-striped-bg-primary even:bg-table-row-striped-bg-secondary',
      },
    },
    interactive: {
      true: {
        row: 'hover:bg-table-row-bg-hover cursor-pointer',
      },
    },
    size: {
      sm: {
        cell: 'text-table-sm p-table-cell-sm',
        columnHeader: 'text-table-sm p-table-cell-sm',
        caption: 'text-table-caption-sm p-table-caption-sm',
      },
      md: {
        cell: 'text-table-md p-table-cell-md',
        columnHeader: 'text-table-md p-table-cell-md',
        caption: 'text-table-caption-md p-table-caption-md',
      },
      lg: {
        cell: 'text-table-lg p-table-cell-lg',
        columnHeader: 'text-table-lg p-table-cell-lg',
        caption: 'text-table-caption-lg p-table-caption-lg',
      },
    },
    stickyHeader: {
      true: {
        header: 'sticky top-0 z-10',
      },
    },
    stickyFirstColumn: {
      true: {
        columnHeader: [
          'first:sticky first:start-0 first:z-20',
          'bg-table-header-bg',
        ],
        cell: ['first:sticky first:start-0 first:z-10'],
      },
    },
    showColumnBorder: {
      true: {
        columnHeader:
          '&:not(:last-of-type) border-r-(length:--border-width-table) border-table-border',
        cell: '&:not(:last-of-type) border-r-(length:--border-width-table) border-table-border',
      },
    },
    captionPlacement: {
      top: {
        caption: 'caption-top',
      },
      bottom: {
        caption: 'caption-bottom',
      },
    },
  },
  defaultVariants: {
    variant: 'line',
    size: 'md',
    interactive: false,
    stickyHeader: false,
    stickyFirstColumn: false,
    showColumnBorder: false,
    captionPlacement: 'top',
  },
})

// Context for sharing state between sub-components
interface TableContextValue {
  variant?: 'line' | 'outline' | 'striped'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  stickyHeader?: boolean
  stickyFirstColumn?: boolean
  showColumnBorder?: boolean
  captionPlacement?: 'top' | 'bottom'
  styles: ReturnType<typeof tableVariants>
}

const TableContext = createContext<TableContextValue | null>(null)

function useTableContext() {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error('Table components must be used within Table')
  }
  return context
}

// Root component
interface TableProps
  extends VariantProps<typeof tableVariants>,
    ComponentPropsWithoutRef<'table'> {
  ref?: RefObject<HTMLTableElement>
}

export function Table({
  variant,
  size,
  interactive,
  stickyHeader,
  stickyFirstColumn,
  showColumnBorder,
  captionPlacement,
  children,
  ref,
  className,
  ...props
}: TableProps) {
  const styles = tableVariants({
    variant,
    size,
    interactive,
    stickyHeader,
    stickyFirstColumn,
    showColumnBorder,
    captionPlacement,
  })

  return (
    <TableContext.Provider
      value={{
        variant,
        size,
        interactive,
        stickyHeader,
        stickyFirstColumn,
        showColumnBorder,
        captionPlacement,
        styles,
      }}
    >
      <table ref={ref} className={styles.root({ className })} {...props}>
        {children}
      </table>
    </TableContext.Provider>
  )
}

// Caption component
interface TableCaptionProps extends ComponentPropsWithoutRef<'caption'> {
  ref?: RefObject<HTMLTableCaptionElement>
}

Table.Caption = function TableCaption({
  children,
  ref,
  className,
  ...props
}: TableCaptionProps) {
  const { styles } = useTableContext()

  return (
    <caption ref={ref} className={styles.caption({ className })} {...props}>
      {children}
    </caption>
  )
}

// Header component
interface TableHeaderProps extends ComponentPropsWithoutRef<'thead'> {
  ref?: RefObject<HTMLTableSectionElement>
}

Table.Header = function TableHeader({
  children,
  ref,
  className,
  ...props
}: TableHeaderProps) {
  const { styles } = useTableContext()

  return (
    <thead ref={ref} className={styles.header({ className })} {...props}>
      {children}
    </thead>
  )
}

// Body component
interface TableBodyProps extends ComponentPropsWithoutRef<'tbody'> {
  ref?: RefObject<HTMLTableSectionElement>
}

Table.Body = function TableBody({
  children,
  ref,
  className,
  ...props
}: TableBodyProps) {
  const { styles } = useTableContext()

  return (
    <tbody ref={ref} className={styles.body({ className })} {...props}>
      {children}
    </tbody>
  )
}

// Footer component
interface TableFooterProps extends ComponentPropsWithoutRef<'tfoot'> {
  ref?: RefObject<HTMLTableSectionElement>
}

Table.Footer = function TableFooter({
  children,
  ref,
  className,
  ...props
}: TableFooterProps) {
  const { styles } = useTableContext()

  return (
    <tfoot ref={ref} className={styles.footer({ className })} {...props}>
      {children}
    </tfoot>
  )
}

// Row component
interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  ref?: RefObject<HTMLTableRowElement>
  selected?: boolean
}

Table.Row = function TableRow({
  children,
  ref,
  className,
  selected,
  ...props
}: TableRowProps) {
  const { styles } = useTableContext()

  return (
    <tr
      ref={ref}
      className={styles.row({ className })}
      data-selected={selected}
      {...props}
    >
      {children}
    </tr>
  )
}

// ColumnHeader component
interface TableColumnHeaderProps extends ComponentPropsWithoutRef<'th'> {
  ref?: RefObject<HTMLTableCellElement>
  numeric?: boolean
}

Table.ColumnHeader = function TableColumnHeader({
  children,
  ref,
  className,
  numeric,
  ...props
}: TableColumnHeaderProps) {
  const { styles } = useTableContext()

  return (
    <th
      ref={ref}
      scope="col"
      className={styles.columnHeader({ className })}
      data-numeric={numeric}
      {...props}
    >
      {children}
    </th>
  )
}

// Cell component
interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  ref?: RefObject<HTMLTableCellElement>
  numeric?: boolean
}

Table.Cell = function TableCell({
  children,
  ref,
  className,
  numeric,
  ...props
}: TableCellProps) {
  const { styles, stickyFirstColumn } = useTableContext()

  return (
    <td
      ref={ref}
      className={styles.cell({ className, stickyFirstColumn })}
      data-numeric={numeric}
      {...props}
    >
      {children}
    </td>
  )
}

// Display name
Table.displayName = 'Table'
