import { useDate } from '@/hooks/use-date'
import { Tooltip } from '@techsio/ui-kit/atoms/tooltip'
import Link from 'next/link'

export const DeliveryDate = () => {
  const { addDays, day, short } = useDate()
  const deliveryDate = addDays(3)

  const tooltipContent = (
    <article>
      <Link href="/doprava-a-platba" className="font-bold underline">
        PPL Doručení do výdejních míst
      </Link>
      <p>
        Vyzvedněte si zásilku, kde je vám to blízké, v PPL Parcelboxu nebo PPL
        Parcelshopu.
      </p>
    </article>
  )
  return (
    <div className="flex items-center gap-150">
      <Tooltip
        content={tooltipContent}
        placement="bottom-start"
        className="max-w-2xs bg-secondary text-fg-reverse [--arrow-background:var(--color-secondary)]"
      >
        <span className="cursor-help border-2 border-success border-t-5 px-150 font-bold text-fg-secondary text-xl">
          {day(deliveryDate)}
        </span>
      </Tooltip>
      <div className="flex flex-col text-2xs text-fg-secondary">
        <span>Doručení do</span>
        <span>{short(deliveryDate)}</span>
      </div>
    </div>
  )
}
