import { Button } from '@ui/atoms/button'

export function OrdersError() {
  return (
    <div className="rounded-sm border border-orders-danger bg-orders-card-bg p-lg text-center">
      <p className="mb-xs font-medium text-orders-danger">
        Chyba při načítání objednávek
      </p>
      <p className="mb-sm text-orders-fg-secondary text-orders-md">
        Zkontrolujte console pro více informací
      </p>
      <Button
        variant="secondary"
        theme="solid"
        onClick={() => window.location.reload()}
        size="sm"
      >
        Zkusit znovu
      </Button>
    </div>
  )
}
