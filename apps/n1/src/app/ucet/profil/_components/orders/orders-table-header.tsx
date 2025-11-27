export function OrdersTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-300 border-border-secondary border-b bg-surface p-300 font-medium text-fg-secondary text-sm uppercase tracking-wider">
      <div className="col-span-2">Číslo</div>
      <div className="col-span-2">Datum</div>
      <div className="col-span-4">Položky</div>
      <div className="col-span-2 text-right">Celkem</div>
      <div className="col-span-2 text-right">Akce</div>
    </div>
  )
}
