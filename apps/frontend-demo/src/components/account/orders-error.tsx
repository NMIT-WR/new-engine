import { Button } from '@new-engine/ui/atoms/button'

export function OrdersError() {
  return (
    <div className="rounded-sm border border-orders-danger bg-orders-card-bg p-lg text-center">
      <p className="mb-xs font-medium text-orders-danger">
        Chyba při načítání objednávek
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
