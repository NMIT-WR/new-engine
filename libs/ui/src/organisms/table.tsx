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
    caption: ['text-table-caption-fg', 'text-start'],
    header: ['bg-table-header-bg', 'text-table-header-fg font-table-header'],
    body: '',
    footer: ['bg-table-footer-bg', 'text-table-footer-fg font-table-footer'],
    row: [
      'border-b-(length:--border-width-table) border-table-border',
      'transition-colors duration-200',
    ],
    columnHeader: ['text-start', 'font-table-header'],
    cell: ['text-start'],
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
      interactive: {
        row: 'hover:bg-table-row-bg-hover cursor-pointer',
      },
      striped: {
        row: 'odd:bg-table-row-striped-bg-primary even:bg-table-row-striped-bg-secondary',
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
  },
  defaultVariants: {
    variant: 'line',
    size: 'md',
    stickyHeader: false,
  },
})

// Context for sharing state between sub-components
interface TableContextValue {
  variant?: 'line' | 'outline' | 'interactive' | 'striped'
  size?: 'sm' | 'md' | 'lg'
  stickyHeader?: boolean
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
  stickyHeader,
  children,
  ref,
  className,
  ...props
}: TableProps) {
  const styles = tableVariants({ variant, size, stickyHeader })

  return (
    <TableContext.Provider value={{ variant, size, stickyHeader, styles }}>
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
}

Table.Row = function TableRow({
  children,
  ref,
  className,
  ...props
}: TableRowProps) {
  const { styles } = useTableContext()

  return (
    <tr ref={ref} className={styles.row({ className })} {...props}>
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
      className={styles.columnHeader({ className })}
      style={numeric ? { textAlign: 'end' } : undefined}
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
  const { styles } = useTableContext()

  return (
    <td
      ref={ref}
      className={styles.cell({ className })}
      style={numeric ? { textAlign: 'end' } : undefined}
      {...props}
    >
      {children}
    </td>
  )
}

// Display name
Table.displayName = 'Table'
