import { Table } from '@new-engine/ui/organisms/table'

export interface ProductTableRowProps {
  key: string
  value?: string | number | null
}

export const ProductTable = ({ rows }: { rows: ProductTableRowProps[] }) => {
  return (
    <Table variant="striped">
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.key}>
            <Table.Cell className="capitalize">{row.key}</Table.Cell>
            <Table.Cell>{row.value}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
