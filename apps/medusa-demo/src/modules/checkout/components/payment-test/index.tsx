import { twMerge } from 'tailwind-merge'

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <span
      className={twMerge(
        'txt-compact-small-plus box-border inline-flex h-8 items-center gap-x-0.5 rounded-md border border-ui-tag-orange-border bg-ui-tag-orange-bg px-2.5 py-[5px] text-ui-tag-orange-text',
        className
      )}
    >
      <span className="font-semibold">Attention:</span> For testing purposes
      only.
    </span>
  )
}

export default PaymentTest
