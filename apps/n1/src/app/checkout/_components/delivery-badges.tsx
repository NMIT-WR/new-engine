import { Badge } from '@ui/atoms/badge'

export function DeliveryBadges() {
  return (
    <div className="flex gap-200">
      <Badge variant="secondary" className="bg-primary text-white">
        🚀 30 min delivery
      </Badge>
      <Badge variant="secondary" className="bg-primary text-white">
        📦 Pickup available
      </Badge>
    </div>
  )
}
