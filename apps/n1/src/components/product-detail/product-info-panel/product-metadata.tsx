interface MetadataRows {
  label: string
  value?: string | number
}

export const ProductMetadata = ({ rows }: { rows: MetadataRows[] }) => {
  return (
    <div className="text-secondary">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between">
          <span>{row.label}</span>
          <span>{row.value || '—'}</span>
        </div>
      ))}
    </div>
  )
}
