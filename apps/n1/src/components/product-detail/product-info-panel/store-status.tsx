import { Tooltip } from '@new-engine/ui/atoms/tooltip'

export const StoreStatus = ({ quantity }: { quantity: number }) => {
  const StatusContent = () => (
    <div className="text-xs">
      <h4 className="font-bold">Sklad N1shop - doba dodání 1-2 dny:</h4>
      <p className="font-semibold text-success">{quantity} ks</p>
    </div>
  )

  return (
    <Tooltip
      content={<StatusContent />}
      className="relative bg-secondary text-fg-reverse [--arrow-background:var(--color-secondary)]"
      placement="bottom-start"
      offset={{ mainAxis: 4, crossAxis: 4 }}
    >
      <span className="cursor-help font-bold text-lg text-success underline decoration-1 decoration-dotted underline-offset-4">
        Skladem {quantity} ks
      </span>
    </Tooltip>
  )
}
